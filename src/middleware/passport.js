const passportJWT = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


module.exports = function (passport) {
  // local strategy passport
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' }, async function (email, password, done) {
        let user;
        try {
          user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'No user by that email' });
          };
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Not a matching password' });
            };
          });
        } catch (err) {
          return done(err);
        };
      })
  );
  // JWT strategy passport
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
    async function (jwtPayload, cb) {
      try {
        const user = await User.findById(jwtPayload._id);
        return cb(null, user);
      } catch (err) {
        return cb(err);
      };
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email, done) => {
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return done(new Error('user not found'));
      }
      done(null, user);
    } catch (e) {
      done(e);
    }
  });

};
