import Express from "express";
import {
  useAcceptFriendRequest,
  useDeleteFriendRequest,
  useFriendRequestStatus,
  useGetAllFreindRequest,
  useGetFreindRequestCount,
  useSendFriendRequest,
  useUnSendFriendRequest,
  usefollowUser,
  useunFollowUser,
} from "../controller/follow_controller.js";

let routes = Express.Router();

export let followRoutes = routes
  .get("/requestStatus/:requestReceiver", useFriendRequestStatus)
  .get("/getallrequests", useGetAllFreindRequest)
  .get("/request-count", useGetFreindRequestCount)
  .post("/follow", usefollowUser)
  .post("/sendrequest", useSendFriendRequest)
  .post("/acceptrequest/", useAcceptFriendRequest)
  .delete("/unsendrequest", useUnSendFriendRequest)
  .delete("/deletetrequest", useDeleteFriendRequest)
  .delete("/unfollow", useunFollowUser);
