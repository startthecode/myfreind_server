import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  if (req.isAuthenticated()) {
    let token = req.user;
    let decoded = jwt.verify(
      token,
      process.env.GET_USER_SECRET_KEY,
      (err, value) => {
        if (err) return false;
        return value;
      }
    );
    if (!decoded) {
      req.logout((err) => {
        if (err) res.send(err);
        req.session.destroy();
      });
      return res.status(401).send("session expired log in again");
    }
    delete decoded.exp;
    delete decoded.iat;
    delete decoded.Password;
    req.userDetail = decoded;

    next();
  } else {
    res.status(401).send("user not found");
  }
}
