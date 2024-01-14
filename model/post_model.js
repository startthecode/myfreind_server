import { literal, Sequelize, Op } from "sequelize";
import { PostLikes, PostStats } from "../database/postLikeTable.js";
import { Post } from "../database/postTable.js";
import { User, userProfile } from "../database/userTables.js";
import { CommentReplys, PostComment } from "../database/postCommentTable.js";
import { FollowList } from "../database/followTable.js";

export let createPost = async (postReq) => {
  try {
    //

    let dataToBeAdded = {
      PostCaption: postReq.body.postcaption,
      PostContentURL: postReq.file.path,
      PostType: postReq.body.folder_type,
      UserID: postReq.userDetail.UserID,
    };
    let newPost = await Post.create(dataToBeAdded);
    return newPost;
  } catch (error) {
    throw error;
  }
};

export let deletePost = async (postReq) => {
  try {
    let postid = postReq.params.postid;
    let UserID = postReq.userDetail.UserID;
    let postID = await Post.destroy({
      where: { PostID: postid, UserID: UserID },
    });
    return postID;
  } catch (error) {
    throw error;
  }
};

export let updatePost = async (postReq) => {
  try {
    let postid = postReq.params.postid;
    let dataToBeAdded = {
      PostCaption: postReq.body.postcaption,
      ...(postReq?.file?.path && { PostContentURL: postReq?.file?.path }),
    };
    let updatedPost = await Post.update(dataToBeAdded, {
      where: { PostID: postid },
    });
    return updatedPost;
  } catch (error) {
    throw error;
  }
};

export const getAllPosts = async (postReq) => {
  try {
    let userid = postReq.params.userid;

    if (!userid || userid === "undefined") return new Error("Invalid request");

    const getPosts = await Post.findAll({
      where: {
        UserID: userid,
      },
      attributes: [
        "PostID",
        "PostCaption",
        "PostContentURL",
        "createdAt",
        "UserID",
        "PostType",
      ],
      include: [
        {
          model: PostStats,
          attributes: ["TotalLikes", "TotalComments", "TotalShares"],
          as: "postStats",
        },
        {
          model: PostLikes,
          as: "postLikes",
          limit: 3,
          attributes: ["LikingUser", "LikedPost"],
          where: {
            [Op.or]: [
              { LikingUser: postReq.userDetail.UserID },
              { LikingUser: { [Op.not]: null } },
            ],
          },
          include: {
            model: userProfile,
            attributes: ["UserDP", "FullName"],
            as: "userprofileCon",
          },
        },
        {
          model: User,
          attributes: ["UserName"],
          as: "User",
          include: {
            model: userProfile,
            attributes: ["UserDP"],
            as: "userProfile",
          },
        },
      ],
    });

    return getPosts;
  } catch (error) {
    throw error;
  }
};

export const getSinglePost = async (postReq) => {
  try {
    let postid = postReq.params.postid;

    const getPost = await Post.findOne({
      where: { PostID: postid },
    });

    return getPost;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export let getPostComments = async (requestData) => {
  try {
    let postID = requestData.query.postID;
    let getallComments = await PostComment.findAll({
      attributes: [
        "Comment",
        "CommentID",
        "createdAt",
        [
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM \`CommentReplys\` 
            WHERE \`CommentReplys\`.\`CommentID\` = \`PostComment\`.\`CommentID\`
          )`),
          "totalReplies",
        ],
      ],
      include: [
        {
          model: User,
          as: "Commenter",
          attributes: ["UserID", "UserName"],
          include: {
            model: userProfile,
            as: "userProfile",
            attributes: ["UserDP"],
          },
        },
      ],
      where: { PostID: postID },
      order: [["createdAt", "DESC"]],
    });
    return getallComments;
  } catch (err) {
    throw err;
  }
};

export let getPostCommentReplys = async (requestData) => {
  try {
    let commentId = requestData.query.commentid;
    let getAllReplys = await CommentReplys.findAll({
      attributes: [
        "Reply",
        "Replier",
        "CommentID",
        "createdAt",
        "ReplyCommentID",
        "ReplyCommentID",
      ],
      include: [
        {
          model: User,
          as: "replier",
          attributes: ["UserID", "UserName"],
          include: {
            model: userProfile,
            as: "userProfile",
            attributes: ["UserDP"],
          },
        },

        {
          model: User,
          as: "replyto",
          attributes: ["UserName"],
        },
      ],
      where: { CommentID: commentId },
    });
    return getAllReplys;
  } catch (err) {
    throw err;
  }
};

export const postFromFollowedUser = async (postReq) => {
  try {
    let userid = postReq.userDetail.UserID;

    if (!userid || userid === "undefined") return new Error("Invalid request");

    const userIDs = await FollowList.findAll({
      where: { [Op.or]: { FollowerID: userid, FollowingID: userid } },
      attributes: ["FollowingID"],
      raw: true,
    });
    const FollowingID = userIDs.reduce(
      (acc, item) => acc.concat(item.FollowingID),
      []
    );

    const getPosts = await Post.findAll({
      where: {
        UserID: { [Op.in]: FollowingID },
      },
      order: [["createdAt", "DESC"]],
      attributes: [
        "PostID",
        "PostCaption",
        "PostContentURL",
        "createdAt",
        "UserID",
        "PostType",
      ],
      include: [
        {
          model: PostStats,
          attributes: ["TotalLikes", "TotalComments", "TotalShares"],
          as: "postStats",
        },
        {
          model: PostLikes,
          as: "postLikes",
          limit: 3,
          attributes: ["LikingUser", "LikedPost"],
          where: {
            [Op.or]: [
              { LikingUser: postReq.userDetail.UserID },
              { LikingUser: { [Op.not]: null } },
            ],
          },
          include: {
            model: userProfile,
            attributes: ["UserDP", "FullName"],
            as: "userprofileCon",
          },
        },
        {
          model: User,
          attributes: ["UserName"],
          as: "User",
          include: {
            model: userProfile,
            attributes: ["UserDP"],
            as: "userProfile",
          },
        },
      ],
    });

    return getPosts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// postActions

export let likeThePost = async (postReq) => {
  try {
    let userId = postReq.userDetail.UserID;
    let postID = postReq.body.postid;

    let likingThePost = await PostLikes.create({
      LikingUser: userId,
      LikedPost: postID,
    });
    return likingThePost;
  } catch (error) {
    throw error;
  }
};

export let unLikedPost = async (postReq) => {
  try {
    let userId = postReq.userDetail.UserID;
    let postID = postReq.body.postid;

    let unlikingThePost = await PostLikes.destroy({
      where: {
        LikingUser: userId,
        LikedPost: postID,
      },
    });
    return unlikingThePost;
  } catch (error) {
    throw error;
  }
};

export let addComment = async (requestData) => {
  try {
    let Comment = requestData.body.comment;
    let PostID = requestData.body.postid;
    let CommenterID = requestData.userDetail.UserID;
    let addingComment = await PostComment.create({
      Comment,
      PostID,
      CommenterID,
    });
    return addingComment;
  } catch (error) {
    throw error;
  }
};

export let deleteComment = async (requestData) => {
  try {
    let CommentID = requestData.body.commentid;
    let CommenterID = requestData.userDetail.UserID;
    let PostID = requestData.body.postid;
    let deletingComment = await PostComment.destroy({
      where: {
        CommenterID,
        CommentID,
        PostID,
      },
    });
    return deletingComment;
  } catch (error) {
    throw error;
  }
};

export let addCommentreply = async (requestData) => {
  try {
    let Reply = requestData.body.comment;
    let ReplyTo = requestData.body.replyto;
    let CommentID = requestData.body.commentid;
    let Replier = requestData.userDetail.UserID;
    let addingComment = await CommentReplys.create({
      Reply,
      CommentID,
      Replier,
      ReplyTo,
    });
    return addingComment;
  } catch (error) {
    throw error;
  }
};
