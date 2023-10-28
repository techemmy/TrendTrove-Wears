import { Router } from 'express';
import type { IRequestWithAuthenticatedUser } from '../types/requestTypes';
import { body, matchedData } from 'express-validator';
import validationErrorHandlerMiddleware from '../middlewares/validationErrorHandlerMiddleware';
import db from '../database';
import { setFlashMessage } from '../utilities';
import multer, { MulterError } from 'multer';
import path from 'node:path';
import DatauriParser from 'datauri/parser';
import {
    ALLOWED_IMAGE_TYPES,
    ONE_MB_IN_BYTES,
    profileImageUploadLimitInMb,
} from '../constants';
import { v2 as cloudinary } from 'cloudinary';
import { User } from '../models';
import { cloudinaryConfig } from '../config';

const userRouter = Router();
const getUserAvatarFromForm = multer({
    limits: { fileSize: profileImageUploadLimitInMb * ONE_MB_IN_BYTES },
}).single('userAvatar');

cloudinary.config({
    cloud_name: cloudinaryConfig.CLOUD_NAME,
    api_key: cloudinaryConfig.API_KEY,
    api_secret: cloudinaryConfig.API_SECRET,
});

userRouter.get('/profile', (req: IRequestWithAuthenticatedUser, res) => {
    res.render('user/user-profile', { user: req.user });
});

userRouter.post(
    '/upload-profile-img',
    (req, res, next) => {
        getUserAvatarFromForm(req, res, (err) => {
            if (err && err.code === 'LIMIT_FILE_SIZE') {
                setFlashMessage(req, {
                    type: 'warning',
                    message: `Upload failed because the size is greater than ${profileImageUploadLimitInMb} MB. Try another file.`,
                });
                res.redirect('./profile');
                return;
            } else if (err instanceof MulterError) {
                setFlashMessage(req, {
                    type: 'warning',
                    message: err.message,
                });
                res.redirect('./profile');
                return;
            }
            next();
        });
    },
    async (req: any, res, next) => {
        try {
            if (req.file === undefined) {
                setFlashMessage(req, {
                    type: 'info',
                    message: 'No file was detected. Choose a file',
                });
                res.redirect('./profile');
                return;
            }

            const imageType = req.file.mimetype.split('/').at(-1);
            if (!ALLOWED_IMAGE_TYPES.includes(imageType)) {
                setFlashMessage(req, {
                    type: 'warning',
                    message: `Unallowed file type. Only pictures of "${ALLOWED_IMAGE_TYPES.join(
                        ', '
                    )}" type are allowed`,
                });
                res.redirect('./profile');
                return;
            }

            const dUri = new DatauriParser();
            const fileToUpload = dUri.format(
                path.extname(req.file.originalname).toString(),
                req.file.buffer
            ).content;

            const uploadedImg = await cloudinary.uploader.upload(
                fileToUpload as string,
                {
                    public_id: req.user.email,
                    overwrite: true,
                    folder: '/trendtrove/profile-image',
                    resource_type: 'image',
                }
            );

            const user = await User.findByPk(req.user.id);
            await user?.update({ profileImageURL: uploadedImg.url });

            setFlashMessage(req, {
                type: 'success',
                message: 'Profile image uploaded succesfully!',
            });
            res.redirect('./profile');
        } catch (error) {
            console.log('Here:', error.message, error);
            if (error.message) {
                setFlashMessage(req, {
                    type: 'danger',
                    message: error.message,
                });
                res.redirect('./profile');
                return;
            }
            next();
        }
    }
);

userRouter.post(
    '/profile',
    [
        body('name', 'Name is invalid or empty').trim().escape().notEmpty(),
        body('phoneNumber', 'Phone number cannot be empty')
            .trim()
            .escape()
            .notEmpty(),
        body('street', 'Street cannot be empty').trim().escape().notEmpty(),
        body('state', 'State cannot be empty').trim().escape().notEmpty(),
        body('country', 'Country cannot be empty').trim().escape().notEmpty(),
    ],
    validationErrorHandlerMiddleware,
    async (req, res) => {
        const { name, phoneNumber, street, state, country } = matchedData(req);

        const user = await db.users.findByPk(req.user.id);

        if (user === null) {
            setFlashMessage(req, [
                { message: 'User not found', type: 'danger' },
            ]);
            res.redirect('/');
            return;
        }

        let address = await user.getAddress({ where: { userId: user.id } });
        if (address === null) {
            address = await user.createAddress({
                state,
                street,
                country,
            });
        } else {
            await address.update({ ...address, street, state, country });
        }

        await user.update({ ...user, name, phoneNumber });
        setFlashMessage(req, [
            {
                type: 'success',
                message: 'Your details were updated successfully!',
            },
        ]);

        res.redirect('/user/profile');
    }
);
export default userRouter;
