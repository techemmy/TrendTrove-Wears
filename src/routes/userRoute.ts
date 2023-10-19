import { Router } from 'express';
import type { IRequestWithAuthenticatedUser } from '../types/requestTypes';
import { body, matchedData } from 'express-validator';
import validationErrorHandlerMiddleware from '../middlewares/validationErrorHandlerMiddleware';
import db from '../database';
import { setFlashMessages } from '../utilities';

const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.redirect('/user/profile');
});

userRouter.get('/profile', (req: IRequestWithAuthenticatedUser, res) => {
    res.render('user/user-profile', { user: req.user });
});

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
            setFlashMessages(req, [
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
        setFlashMessages(req, [
            {
                type: 'success',
                message: 'Your details were updated successfully!',
            },
        ]);

        res.redirect('/user/profile');
    }
);
export default userRouter;
