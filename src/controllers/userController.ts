import type { NextFunction, Response } from 'express';
import type { IRequestWithAuthenticatedUser } from '../types/requestTypes';
import { cloudinaryAPI, setFlashMessage } from '../utilities';
import db from '../database';
import { matchedData } from 'express-validator';
import { ALLOWED_IMAGE_TYPES } from '../constants';
import DatauriParser from 'datauri/parser';
import { User } from '../models';
import path from 'node:path';

export function getProfile(
    req: IRequestWithAuthenticatedUser,
    res: Response
): void {
    res.render('user/user-profile', { user: req.user });
}

export async function postUpdateProfileInformation(req, res): Promise<void> {
    const { name, phoneNumber, street, state, country } = matchedData(req);

    const user = await db.users.findByPk(req.user.id);

    if (user === null) {
        setFlashMessage(req, [{ message: 'User not found', type: 'danger' }]);
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

export async function postUploadProfileImage(
    req: IRequestWithAuthenticatedUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (req.file === undefined) {
            setFlashMessage(req, {
                type: 'info',
                message: 'No file was detected. Choose a file',
            });
            res.redirect('/user/profile');
            return;
        }

        const imageType = req.file.mimetype.split('/').at(-1) ?? '';
        if (!ALLOWED_IMAGE_TYPES.includes(imageType)) {
            setFlashMessage(req, {
                type: 'warning',
                message: `Unallowed file type. Only pictures of "${ALLOWED_IMAGE_TYPES.join(
                    ', '
                )}" type are allowed`,
            });
            res.redirect('/user/profile');
            return;
        }

        const dUri = new DatauriParser();
        const fileToUpload = dUri.format(
            path.extname(req.file.originalname).toString(),
            req.file.buffer
        ).content;

        const uploadedImg = await cloudinaryAPI().uploader.upload(
            fileToUpload as string,
            {
                public_id: req.user.email,
                overwrite: true,
                folder: '/trendtrove/profile-image',
                resource_type: 'image',
            }
        );

        const user = await User.findByPk(req?.user.id);
        await user?.update({ profileImageURL: uploadedImg.url });

        setFlashMessage(req, {
            type: 'success',
            message: 'Profile image uploaded succesfully!',
        });
        res.redirect('/user/profile');
    } catch (error) {
        if (typeof error.message === 'string' && error.message.length > 0) {
            setFlashMessage(req, {
                type: 'danger',
                message: error.message,
            });
            res.redirect('./');
            return;
        }
        next(error);
    }
}
