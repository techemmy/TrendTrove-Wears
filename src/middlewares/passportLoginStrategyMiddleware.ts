import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models';
import { setFlashMessages } from '../utilities';

export default (): void => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passReqToCallback: true,
            },
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async function (req, email, password, done) {
                const user = await User.findOne({
                    where: {
                        email,
                    },
                });

                if (user === null) {
                    setFlashMessages(req, [
                        {
                            type: 'danger',
                            message: `We couldn't find an account with that email. <a href='/auth/signup'>Create one now</a>`,
                        },
                    ]);
                    done(null, false);
                    return;
                }

                if (user.providerIdentity === 'google') {
                    setFlashMessages(req, [
                        {
                            type: 'info',
                            message: `Your google account is linked already. Log in with Google instead.`,
                        },
                    ]);
                    done(null, false);
                    return;
                }

                if (!(await user.verifyPassword(password))) {
                    setFlashMessages(req, [
                        { type: 'warning', message: 'Incorrect password' },
                    ]);
                    done(null, false);
                    return;
                }

                done(null, user);
            }
        )
    );
};
