import { Router } from 'express';
import { body } from 'express-validator';
import validationErrorHandlerMiddleware from '../middlewares/validationErrorHandlerMiddleware';
import { setFlashMessage } from '../utilities';
import multer, { MulterError } from 'multer';
import { ONE_MB_IN_BYTES, fileUploadLimit } from '../constants';
import * as UserController from '../controllers/userController';
import getValidFormImage from '../middlewares/getValidFormImageMiddleware';

const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.redirect('/user/profile');
});
userRouter.get('/profile', UserController.getProfile);

userRouter.post(
    '/profile/img-upload',
    getValidFormImage,
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
