import { DataTypes, where } from "sequelize";
import { sequelize } from "./db.js";
import { Post } from "./postTable.js";
import { User, userProfile } from "./userTables.js";

export let PostStats = sequelize.define("PostStats", {
  StatsID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  PostID: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: Post,
      key: "PostID",
    },
  },
  TotalLikes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  TotalComments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  TotalShares: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export let PostLikes = sequelize.define(
  "PostLikes",
  {
    LikingUser: {
      type: DataTypes.INTEGER,
      unique: "uniqueIndex",
      references: {
        model: User,
        key: "UserID",
      },
    },
    LikedPost: {
      type: DataTypes.INTEGER,
      unique: "uniqueIndex",
      references: {
        model: Post,
        key: "PostID",
      },
    },
  },
  { timestamps: false, primaryKey: true }
);

PostLikes.addHook("afterBulkDestroy", async (options) => {
  const unLikedPost = options.where.LikedPost;

  try {
    const totalLikes = await PostLikes.count({
      where: { LikedPost: unLikedPost },
    });

    await PostStats.update(
      { TotalLikes: totalLikes },
      {
        where: {
          PostID: unLikedPost,
        },
      }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
});

PostLikes.addHook("afterCreate", async (postLikes) => {
  const likedPostId = postLikes.LikedPost;

  try {
    const [postStats, created] = await PostStats.findOrCreate({
      where: { PostID: likedPostId },
      defaults: {
        TotalLikes: await PostLikes.count({
          where: { LikedPost: likedPostId },
        }),
      },
    });

    if (!created) {
      // If the PostStats already existed, you may want to update it here
      await postStats.update({
        TotalLikes: await PostLikes.count({
          where: { LikedPost: likedPostId },
        }),
      });
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
});

// Post.addHook("afterCreate", async (post) => {
//   await PostStats.create({
//     PostID: post.PostID,
//   });
// });
Post.hasOne(PostStats, { foreignKey: "PostID", as: "postStats" });
PostStats.belongsTo(Post, { foreignKey: "PostID", as: "postID" });

PostStats.hasMany(PostLikes, {
  foreignKey: "LikingUser",
  as: "PostStatsCONlikingUser",
});
PostStats.hasMany(PostLikes, {
  foreignKey: "LikedPost",
  as: "PostStatsCONLikedPost",
});
Post.hasMany(PostLikes, { foreignKey: "LikedPost", as: "postLikes" });
User.hasMany(PostLikes, { foreignKey: "LikingUser", as: "PostLikesUser" });
PostLikes.belongsTo(User, { foreignKey: "LikingUser", as: "userID" });
PostLikes.belongsTo(userProfile, {
  foreignKey: "LikingUser",
  as: "userprofileCon",
});
PostLikes.belongsTo(Post, { foreignKey: "LikedPost", as: "postID" });
