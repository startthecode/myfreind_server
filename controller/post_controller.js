import {
  addComment,
  addCommentreply,
  createPost,
  deleteComment,
  deletePost,
  getAllPosts,
  getPostCommentReplys,
  getPostComments,
  getSinglePost,
  likeThePost,
  postFromFollowedUser,
  unLikedPost,
  updatePost,
} from "../model/post_model.js";

export let useCreatePost = async (req, res) => {
  try {
    let postData = req;
    let creatingPost = await createPost(postData);
    res.send(creatingPost);
  } catch (error) {
    res.status(406).send(error);
  }
};

export let useDeletePost = async (req, res) => {
  try {
    let postData = req;
    let creatingPost = await deletePost(postData);
    res.json(creatingPost);
  } catch (error) {
    res.sendStatus(406).json(error);
  }
};

export let useUpdatePost = async (req, res) => {
  try {
    let postData = req;
    let creatingPost = await updatePost(postData);
    res.send(creatingPost);
  } catch (error) {
    res.status(406).send(error);
  }
};

export let useGetAllPost = async (req, res) => {
  try {
    let reqData = req;
    let getPosts = await getAllPosts(reqData);
    res.json(getPosts);
  } catch (error) {
    res.status(404).send(error);
  }
};

export let useSinglePost = async (req, res) => {
  try {
    let reqData = req;
    let getPost = await getSinglePost(reqData);
    res.json(getPost);
  } catch (error) {
    res.status(404).send(error);
  }
};

export let useGetPostComments = async (req, res) => {
  try {
    let reqData = req;
    let gettingComments = await getPostComments(reqData);
    res.status(200).json(gettingComments);
  } catch (error) {
    res.status(404).send(error);
  }
};

export let useGetPostCommentsReplies = async (req, res) => {
  try {
    let reqData = req;
    let gettingComments = await getPostCommentReplys(reqData);
    res.status(200).json(gettingComments);
  } catch (error) {
    res.status(404).send(error);
  }
};

export let usePostFromFollowedUser = async (req, res) => {
  try {
    let reqData = req;
    let getPosts = await postFromFollowedUser(reqData);
    res.json(getPosts);
  } catch (error) {
    res.status(404).send(error);
  }
};

//

// Post actions

export let useLikePost = async (req, res) => {
  try {
    let reqData = req;
    let likingThePost = await likeThePost(reqData);
    res.json(likingThePost);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

export let useUnLikePost = async (req, res) => {
  try {
    let reqData = req;
    let unlikingThePost = await unLikedPost(reqData);
    res.json(unlikingThePost);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

export let useAddComment = async (req, res) => {
  try {
    let reqData = req;
    let addingNewComment = await addComment(reqData);
    res.status(200).send(addingNewComment);
  } catch (error) {
    res.status(404).send(error);
  }
};

export let usedeleteComment = async (req, res) => {
  try {
    let reqData = req;
    let deletingComment = await deleteComment(reqData);
    res.status(200).json(deletingComment);
  } catch (error) {
    res.status(404).send(error);
  }
};

export let useAddCommentReply = async (req, res) => {
  try {
    let reqData = req;
    let addingNewComment = await addCommentreply(reqData);
    res.status(200).send(addingNewComment);
  } catch (error) {
    res.status(404).send(error);
  }
};
