import passport from "passport";

export function passport_local_auth(req, res, next) {
  return passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).send({ error: err });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    let userToken = Jwt.sign(user, process.env.GET_USER_SECRET_KEY, {
      expiresIn: "30s",
    });
    req.login(userToken, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      req.body.formType = "login";
      return res.redirect(process.env.CLIENT_URL);
    });
  })(req, res, next);
}
