import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { User, userProfile } from "./userTables.js";

export let Post = sequelize.define("Post", {
  PostID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  PostCaption: {
    type: DataTypes.STRING(120),
    allowNull: true,
  },
  PostContentURL: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  PostType: {
    type: DataTypes.ENUM,
    values: ["reel", "image", "video"],
  },
  Status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "Active",
  },
});

export let Story = sequelize.define("Story", {
  StoryID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  StoryContentURL: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "Active",
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.fn("NOW"),
  },
});

export let HightlightedStory = sequelize.define("HightlightedStory", {
  HightlightID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  HightlightTitle: {
    type: DataTypes.STRING(120),
    allowNull: true,
  },

  Status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "Active",
  },
});

User.hasMany(Post, {
  foreignKey: "UserID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "post",
});
Post.belongsTo(User, { foreignKey: "UserID", as: "User" });

// Define hooks for 'posts'
Post.addHook("afterCreate", async (post, options) => {
  // Update 'userprofiles' after a new post is created
  await userProfile.update(
    {
      TotalPosts: await Post.count({
        where: { UserID: post.UserID },
      }),
    },
    {
      where: { UserID: post.UserID },
    }
  );
});

Post.addHook("beforeBulkDestroy", async (post, options) => {
  console.log(post.where.UserID);
  try {
    const userPostCount = await Post.count({
      where: { UserID: post.where.UserID },
    });

    // Subtract 1 only if there are posts left after the current one is destroyed
    const updatedPostCount = Math.max(userPostCount - 1, 0);

    await userProfile.update(
      {
        TotalPosts: updatedPostCount,
      },
      {
        where: { UserID: post.where.UserID },
      }
    );
  } catch (e) {
    console.log(e);
  }
});

User.hasMany(Story, {
  foreignKey: "UserID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Story.belongsTo(User, { foreignKey: "UserID",as:'storyUploader' });

User.hasMany(HightlightedStory, {
  foreignKey: "UserID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
HightlightedStory.belongsTo(User, { foreignKey: "UserID" });

Story.hasOne(HightlightedStory, {
  foreignKey: "StoryID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
HightlightedStory.belongsTo(Story, { foreignKey: "StoryID" });
