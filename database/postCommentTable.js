import { sequelize } from "./db.js";
import { DataTypes, Sequelize } from "sequelize";
import { User } from "./userTables.js";
import { Post } from "./postTable.js";
import { PostStats } from "./postLikeTable.js";

export let PostComment = sequelize.define(
  "PostComment",
  {
    CommentID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },

    Comment: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    CommenterID: {
      type: DataTypes.INTEGER,

      unique: false,
      references: {
        model: User,
        key: "UserID",
      },
    },
    LikesOnComment: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    PostID: {
      type: DataTypes.INTEGER,

      unique: false,
      references: {
        model: Post,
        key: "PostID",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  },
  { timestamps: false }
);

export let CommentReplys = sequelize.define(
  "CommentReplys",
  {
    ReplyCommentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    Reply: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    Replier: {
      type: DataTypes.INTEGER,

      references: {
        model: User,
        key: "UserID",
      },
    },

    ReplyTo: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "UserID",
      },
    },

    CommentID: {
      type: DataTypes.INTEGER,
      references: {
        model: PostComment,
        key: "CommentID",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  },
  { timestamps: false }
);

PostComment.belongsTo(User, { foreignKey: "CommenterID", as: "Commenter" });
PostComment.belongsTo(Post, {
  foreignKey: "PostID",
  as: "commentedPost",
  onDelete: "CASCADE",
});
PostComment.hasMany(CommentReplys, {
  foreignKey: "CommentID",
  as: "commenteReplys",
  onDelete: "CASCADE",
});

CommentReplys.belongsTo(User, { foreignKey: "Replier", as: "replier" });
CommentReplys.belongsTo(User, { foreignKey: "ReplyTo", as: "replyto" });

CommentReplys.belongsTo(PostComment, {
  foreignKey: "CommentID",
  as: "comment",
  onDelete: "CASCADE",
});

PostComment.addHook("afterCreate", async (newComment) => {
  console.log();
  let postID = newComment.PostID;
  let totalCommentOnpost = console.log(postID);
  try {
    let [stats, created] = await PostStats.findOrCreate({
      where: { PostID: postID },
      defaults: {
        TotalComments: await PostComment.count({
          where: { PostID: postID },
        }),
      },
    });
    if (!created) {
      await stats.update({
        TotalComments: await PostComment.count({
          where: { PostID: postID },
        }),
      });
    }
  } catch (err) {
    throw err;
  }
});
PostComment.addHook("beforeBulkDestroy", async (options) => {
  const commentID = options.where.CommentID;

  try {
    await CommentReplys.destroy({ where: { CommentID: commentID } });
  } catch (err) {
    throw err;
  }
});

PostComment.addHook("afterBulkDestroy", async (options) => {
  const postID = options.where.PostID;
  console.log(postID);
  try {
    await PostStats.update(
      {
        TotalComments: await PostComment.count({ where: { PostID: postID } }),
      },
      { where: { PostID: postID } }
    );
  } catch (err) {
    console.log(postID, "errrrrrr");

    throw err;
  }
});
