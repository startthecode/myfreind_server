import Express from "express";
import { multerUpload } from "../multer/multer.js";
import {
  useCreateStory,
  useGetStoryHighlights,
  useStoryFromFollowedUser,
  useTemporaryStory,
} from "../controller/story_controller.js";

let routes = Express.Router();

export let story_routes = routes
  .post("/create", multerUpload.single("newpost"), useCreateStory)
  .get("/storyhighlight/all/:userid", useGetStoryHighlights)
  .get("/user/temporary", useTemporaryStory)
  .get("/from-followed-user", useStoryFromFollowedUser);

  
//
