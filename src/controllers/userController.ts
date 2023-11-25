import type { NextFunction, Response } from 'express';
import type { IRequestWithAuthenticatedUser } from '../types/requestTypes';
import {
    cloudinaryAPI,
    convertBufferToImageURI,
    setFlashMessage,
} from '../utilities';
import db from '../database';
import { matchedData } from 'express-validator';

const User = db.users;

export function getProfile(
    req: IRequestWithAuthenticatedUser,
    res: Response
): void {
    res.render('user/user-profile');
}

export async function postUpdateProfileInformation(req, res): Promise<void> {
    const { name, phoneNumber, street, state, country } = matchedData(req);

    const user = await User.findByPk(req.user.id);

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

        const userImage = convertBufferToImageURI(
            req.file.originalname,
            req.file.buffer
        );
        const uploadedImg = await cloudinaryAPI().uploader.upload(
            userImage as string,
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
