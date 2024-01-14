import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { User, userProfile } from "./userTables.js";

export const FollowList = sequelize.define(
  "FollowList",
  {
    FollowerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "compositeIndex",
      references: {
        model: User,
        key: "UserID",
      },
    },
    FollowingID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "compositeIndex",
      references: {
        model: User,
        key: "UserID",
      },
    },
  },
  {
    primaryKey: true,
  }
);

// Define foreign key relationships
User.hasMany(FollowList, { foreignKey: "FollowerID", as: "Follower" });
User.hasMany(FollowList, { foreignKey: "FollowingID", as: "Following" });

FollowList.belongsTo(User, { foreignKey: "FollowerID", as: "Follower" });
FollowList.belongsTo(User, { foreignKey: "FollowingID", as: "Following" });

// Define hooks for 'followlists'
FollowList.addHook("afterCreate", async (followList, options) => {
  // Update 'userprofileuserProfiles' after a new followlist is created
  await userProfile.update(
    {
      TotalFollowers: await FollowList.count({
        where: { FollowingID: followList.FollowingID },
      }),
    },
    {
      where: { UserID: followList.FollowingID },
    }
  );

  await userProfile.update(
    {
      TotalFollowing: await FollowList.count({
        where: { FollowerID: followList.FollowerID },
      }),
    },
    {
      where: { UserID: followList.FollowerID },
    }
  );
});

FollowList.addHook("afterBulkDestroy", async (followList, options) => {
  // Update 'userprofileuserProfiles' before a followlist is deleted
  await userProfile.update(
    {
      TotalFollowers: await FollowList.count({
        where: { FollowingID: followList?.where?.FollowingID },
      }),
    },
    {
      where: { UserID: followList?.where?.FollowingID },
    }
  );

  await userProfile.update(
    {
      TotalFollowing: await FollowList.count({
        where: { FollowerID: followList?.where?.FollowerID },
      }),
    },
    {
      where: { UserID: followList?.where?.FollowerID },
    }
  );
});
