import Express from "express";
import {
  useCreatePost,
  useGetAllPost,
  useLikePost,
  useUnLikePost,
  useAddComment,
  usedeleteComment,
  useGetPostComments,
  useAddCommentReply,
  useGetPostCommentsReplies,
  useDeletePost,
  useSinglePost,
  useUpdatePost,
  usePostFromFollowedUser,
} from "../controller/post_controller.js";
import { multerUpload } from "../multer/multer.js";

let routes = Express.Router();

export let post_routes = routes
  .post("/create", multerUpload.single("newpost"), useCreatePost)
  .delete("/delete/:postid", useDeletePost)
  .get("/all/post-from-followed-user", usePostFromFollowedUser)
  .get("/all/:userid", useGetAllPost)
  .get("/comments", useGetPostComments)
  .get("/:postid", useSinglePost)
  .put("/update/:postid", multerUpload.single("newpost"), useUpdatePost)
  .post("/postaction/like", useLikePost)
  .post("/postaction/unlike", useUnLikePost)
  .post("/postaction/addcomment", useAddComment)
  .delete("/postaction/deletecomment", usedeleteComment)
  .post("/postaction/comment/reply", useAddCommentReply)
  .get("/comment/replies", useGetPostCommentsReplies);
//
