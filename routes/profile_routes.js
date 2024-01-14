import Express from "express";
import {
  useChngeAccountPrivacy,
  useGetAccountPrivacy,
  useGetOthersProfile,
  useGetUserOverview,
  useGetUserProfile,
  useSearchUsers,
  useUpdateUserProfile,
  useUserIntroData,
} from "../controller/profile_controller.js";
import { multerUpload } from "../multer/multer.js";

let routes = Express.Router();

export let profileRoutes = routes
  .post("/update", multerUpload.single("userprofile"), useUpdateUserProfile)
  .put("/update/privacystatus", useChngeAccountPrivacy)
  .get("/privacystatus", useGetAccountPrivacy)
  .get("/intro", useUserIntroData)
  .get("/alldata", useGetUserProfile)
  .get("/useroverview", useGetUserOverview)
  .get("/search/:username", useSearchUsers)
  .get("/others/:username", useGetOthersProfile)
;
