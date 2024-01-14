import Jwt from "jsonwebtoken";
import passport from "passport";

export function passport_local_auth(req, res, next) {
  return passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(401).json({ error: err });
    if (!user) return res.status(401).json({ error: "Invalid credential" });
    let userToken = Jwt.sign(user, process.env.GET_USER_SECRET_KEY, {
      expiresIn: "1h",
    });
    req.login(userToken, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ user: userToken });
    });
  })(req, res, next);
}

export function passport_google_auth(req, res, next) {
  return passport.authenticate(
    "google",
    {
      scope: ["profile", "email", "openid"],
      state: req.query.googleAuthFor,
    },

    (err, user, info) => {
      let returnUrl = `${process.env.CLIENT_URL}${req.query.googleAuthFor}`;
      if (err) return res.redirect(`${returnUrl}?error=${err}` || "/");
      if (!user)
        return res.redirect(
          `${returnUrl}?error=${"invalid credentials"}` || "/"
        );
      let userToken = Jwt.sign(user, process.env.GET_USER_SECRET_KEY, {
        expiresIn: "1h",
      });
      req.login(userToken, (err) => {
        if (err)
          return res.redirect(`${returnUrl}?error=${err.message}` || "/");
        return res.redirect(process.env.CLIENT_URL);
      });
    }
  )(req, res, next);
}

export function passport_google_callback(req, res, next) {
  passport.authenticate(
    "google",
    { failureRedirect: process.env.CLIENT_URL },
    (err, user) => {
      if (err) {
        return res.redirect(`${process.env.CLIENT_URL}?error=${err}`);
      }
      if (!user) {
        return res.redirect(
          `${process.env.CLIENT_URL}?error=invalid credentials`
        );
      }
      res.redirect(process.env.CLIENT_URL);
    }
  )(req, res, next);
}

export function passport_facebook_callback(req, res, next) {
  passport.authenticate(
    "facebook",
    { failureRedirect: process.env.CLIENT_URL },
    (err, user) => {
      if (err) {
        return res.redirect(`${process.env.CLIENT_URL}?error=${err}`);
      }
      if (!user) {
        return res.redirect(
          `${process.env.CLIENT_URL}?error=invalid credentials`
        );
      }

      // If authentication is successful, you can handle it here
      // For example, generate a token and set it in the user's session

      res.redirect(process.env.CLIENT_URL);
    }
  )(req, res, next);
}

export async function getUser(req, res) {
  if (req.userDetail) {
    return res.send(req.userDetail);
  }
  res.send("User not found");
}

//disabled
export function passport_facebook_auth(req, res, next) {
  return passport.authenticate(
    "facebook",
    {
      state: req.query.facebookAuthFor,
    },

    (err, user, info) => {
      let returnUrl = `${process.env.CLIENT_URL}${req.query.googleAuthFor}`;
      if (err) return res.redirect(`${returnUrl}?error=${err}` || "/");
      if (!user)
        return res.redirect(
          `${returnUrl}?error=${"invalid credentials"}` || "/"
        );
      let userToken = Jwt.sign(user, process.env.GET_USER_SECRET_KEY, {
        expiresIn: "60s",
      });
      req.login(userToken, (err) => {
        if (err)
          return res.redirect(`${returnUrl}?error=${err.message}` || "/");
        return res.redirect(process.env.CLIENT_URL);
      });
    }
  )(req, res, next);
}
