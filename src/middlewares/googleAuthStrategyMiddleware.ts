import passport from 'passport';
import { Strategy } from 'passport-google-oauth2';
import { User } from '../models';
import { googleOAuthConfig } from '../config';

export default (): void => {
    passport.use(
        new Strategy(
            {
                clientID: googleOAuthConfig.CLIENT_ID,
                clientSecret: googleOAuthConfig.CLIENT_SECRET,
                callbackURL: googleOAuthConfig.CALLBACK_URL,
                passReqToCallback: true,
            },
            async function (request, accessToken, refreshToken, profile, done) {
                try {
                    const [user] = await User.findOrCreate({
                        where: { email: profile.email },
                        defaults: {
                            name: profile.displayName,
                            email: profile.email,
                            providerIdentity: profile.provider,
                        },
                    });
                    return done(null, user);
                } catch (error) {
                    return done(error, profile);
                }
            }
        )
    );
};
