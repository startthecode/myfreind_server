import { auth } from "../middleware/auth.js";
import {
  auth_callback_Routes,
  login_status_Routes,
  sign_up_Routes,
  signin_routes,
  signout_routes,
  // signout_routes,
} from "./auth_routes.js";
import { chatRoutes } from "./chat_routes.js";
import { followRoutes } from "./follow_routes.js";
import { post_routes } from "./post_routes.js";
import { profileRoutes } from "./profile_routes.js";
import { story_routes } from "./story_routes.js";

export let allRoutes = (server) => {
  // auth routes start
  server.use("/signin", signin_routes);
  server.use("/signup", sign_up_Routes);
  server.use("/callback", auth_callback_Routes);
  server.use("/logout", signout_routes);
  server.use("/isAuthenticated/", auth, login_status_Routes);
  // auth routes end

  // Prfile Routes
  server.use("/profile", auth, profileRoutes);

  // post_routes
  server.use("/post", auth, post_routes);

  //story routes
  server.use("/story", auth, story_routes);

  // follow routes
  server.use("/follow-action", auth, followRoutes);

  // chat routes
  server.use("/chat", auth, chatRoutes);
};
