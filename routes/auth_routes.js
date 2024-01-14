import Express from "express";
import {
  getUser,
  passport_facebook_auth,
  passport_facebook_callback,
  passport_google_auth,
  passport_google_callback,
  passport_local_auth,
} from "../controller/auth_controller.js";

let routes = Express.Router();

// signin
export let signin_routes = routes
  .post("/", passport_local_auth)
  .get("/google", passport_google_auth);
// .get("/facebook", passport_facebook_auth);

// sign up
export let sign_up_Routes = routes
  .post("/", passport_local_auth)
  .get("/google", passport_google_auth);
// .get("/facebook", passport_facebook_auth);

//user status update
export let login_status_Routes = routes.get("", getUser);

// logout
export let signout_routes = routes.get("/", (req, res) => {
  req.logout((err) => {
    if (err) res.send(err);
    return res.send("Logout successful");
  });
});

// auth callbacks
export let auth_callback_Routes = routes.get(
  "/google",
  passport_google_callback
);
// .get("/facebook", passport_facebook_callback);
