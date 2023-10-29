import { Router } from 'express';
import { body } from 'express-validator';
import validationErrorHandlerMiddleware from '../middlewares/validationErrorHandlerMiddleware';
import { setFlashMessage } from '../utilities';
import multer, { MulterError } from 'multer';
import { ONE_MB_IN_BYTES, profileImageUploadLimitInMb } from '../constants';
import * as UserController from '../controllers/userController';

const userRouter = Router();
const getUserAvatarFromForm = multer({
    limits: { fileSize: profileImageUploadLimitInMb * ONE_MB_IN_BYTES },
}).single('userAvatar');

userRouter.get('/', (req, res) => {
    res.redirect('/user/profile');
});
userRouter.get('/profile', UserController.getProfile);

userRouter.post(
    '/profile/img-upload',
    (req, res, next) => {
        getUserAvatarFromForm(req, res, (err) => {
            if (err !== undefined && err?.code === 'LIMIT_FILE_SIZE') {
                setFlashMessage(req, {
                    type: 'warning',
                    message: `Upload failed because the size is greater than ${profileImageUploadLimitInMb} MB. Try another file.`,
                });
                res.redirect('/user/profile');
                return;
            } else if (err instanceof MulterError) {
                setFlashMessage(req, {
                    type: 'warning',
                    message: err.message,
                });
                res.redirect('/user/profile');
                return;
            }
            next();
        });
    },
    UserController.postUploadProfileImage
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
    UserController.postUpdateProfileInformation
);
export default userRouter;
