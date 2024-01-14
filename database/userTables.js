import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./db.js";

export const User = sequelize.define("users", {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserName: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
  },
  Email: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
  },
  Password: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  AccountPrivacy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  UserType: {
    type: DataTypes.STRING(45),
  },
  AccountStatus: {
    type: DataTypes.STRING(45),
  },
});

export const userProfile = sequelize.define(`userprofiles`, {
  userProfileID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  FullName: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  Gender: {
    type: DataTypes.STRING(45),
  },
  DOB: {
    type: DataTypes.STRING(45),
  },
  LinksList: {
    type: DataTypes.STRING(45),
  },
  Bio: {
    type: DataTypes.STRING(100),
  },
  UserDP: {
    type: DataTypes.STRING(150),
  },
  TotalFollowers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  TotalFollowing: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  TotalPosts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export const FriendRequest = sequelize.define("FriendRequest", {
  RequestID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SenderID: {
    type: DataTypes.INTEGER,
    unique: "uniqueKey",
    references: { model: User, key: "UserID" },
  },

  ReceiverID: {
    type: DataTypes.INTEGER,
    unique: "uniqueKey",
    references: { model: User, key: "UserID" },
  },
});

User.hasMany(FriendRequest, {
  foreignKey: {
    name: "SenderID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  as: "senderID",
});

User.hasMany(FriendRequest, {
  foreignKey: {
    name: "ReceiverID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  as: "receiver",
});

FriendRequest.belongsTo(User, {
  foreignKey: "ReceiverID",
  as: "requestReceivers",
});
FriendRequest.belongsTo(User, {
  foreignKey: "SenderID",
  as: "requestSenders",
});

User.hasOne(userProfile, {
  foreignKey: {
    name: "UserID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  as: "userProfile",
});

userProfile.belongsTo(User, {
  foreignKey: "UserID",
  as: "User",
});
