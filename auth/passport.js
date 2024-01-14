import passport from "passport";
import LocalStrategy from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";

import { User, userProfile } from "../database/userTables.js";
import { sequelize } from "../database/db.js";

export let passportLoginInit = async (server) => {
  server.use(passport.initialize());
  server.use(passport.session());

  passport_local();
  passport_google();
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};

function passport_local() {
  return passport.use(
    new LocalStrategy({ passReqToCallback: true }, async function (
      req,
      username,
      password,
      done
    ) {
      try {
        let userFieldData = req.body;
        let form_type = userFieldData.form_type;

        let user = await getUser({ UserName: username });

        if (form_type === "signin") {
          if (!user) return done("Username does not exist", null);
          if (user && user.Password === password) return done(null, user);
          return done("Incorrect Password", null);
        }

        if (form_type === "signup") {
          if (user) return done("user name already exists", null);
          let newUser = await createUser(userFieldData);
          return done(null, newUser);
        }

        done("invalid detials", null);
      } catch (err) {
        done(err, null);
      }
    })
  );
}

function passport_google() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async function (req, accessToken, refreshToken, profile, done) {
        try {
          let form_type = req.query.state;
          req.query.googleAuthFor = req.query.state;
          let userFieldData = {
            username: profile.emails[0].value.replace("@gmail.com", ""),
            email: profile.emails[0].value,
            password: profile.id,
            fullname: profile.displayName,
          };
          let user = await getUser({ UserName: userFieldData.username });

          if (form_type === "signin") {
            if (!user) return done("Username does not exists", null);
            if (user && user.Password === userFieldData.password)
              return done(null, user);
            return done("Incorrect Password", null);
          }

          if (form_type === "signup") {
            if (user) return done("user name already exists", null);
            let newUser = await createUser(userFieldData);
            return done(null, newUser);
          }

          done("invalid detials", null);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
}

function passport_facebook() {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_SECRET,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.CLIENT_URL}/auth/facebook/callback`,
      },
      function (accessToken, refreshToken, profile, cb) {
        sequelize.sync({ force: false });
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    )
  );
}

async function createUser(userFieldData) {
  try {
    let creatingUser = await User.create({
      UserName: userFieldData.username,
      Email: userFieldData.email,
      Password: userFieldData.password,
      AccountStatus: "Active",
    });

    let user = creatingUser.toJSON();

    await userProfile.create({
      FullName: userFieldData.fullname,
      UserID: user.UserID,
    });
    return user;
  } catch (err) {
    if (err.parent && err.parent.code === "ER_DUP_ENTRY") {
      let errorMessage = `${err.errors[0].path} already exists`;
      throw errorMessage;
    } else if (err.parent && err.parent.code === "ER_DATA_TOO_LONG") {
      let errorMessage = `Invalid value`;
      throw errorMessage;
    }
    throw err;
  }
}

async function getUser(condition) {
  try {
    let userJson = await User.findAll({
      where: {
        ...condition,
      },
    });

    if (userJson.length === 0) return false;
    let user = userJson[0].dataValues;
    return user;
  } catch (err) {
    //
    throw err;
  }
}
