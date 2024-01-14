import { sequelize } from "./db.js";
import { User } from "./userTables.js";
import { DataTypes, where } from "sequelize";
// Define Conversation model
export const Conversation = sequelize.define(
  "Conversation",
  {
    ConversationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    // Other conversation-related fields
  },
  { timestamps: false }
);

// Define Participant model
export const Participant = sequelize.define("Participant", {
  ParticipantID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  LastMessage: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  Seen: {
    type: DataTypes.BOOLEAN,
    defaultValue: null,
  },
  UnseenMessageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// Define Message model
export const Message = sequelize.define(
  "Message",
  {
    MessageID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn("now"),
    },
  },
  { timestamps: false }
);

// Set up associations
User.hasMany(Message, { foreignKey: "SenderID" });
Conversation.hasMany(Message, { foreignKey: "ConversationID" });
User.belongsToMany(Conversation, {
  through: Participant,
  foreignKey: "UserID",
  as: "participants",
});
Conversation.belongsToMany(User, {
  through: Participant,
  foreignKey: "ConversationID",
  as: "user",
});

// hookes

Message.addHook("afterCreate", async function (message, option) {
  try {
    let { ConversationID, content } = message;
    if (!ConversationID) return;
    let updateLastMessage = await Participant.update(
      { LastMessage: content },
      {
        where: { ConversationID: ConversationID },
      }
    );
  } catch (e) {
    throw e;
  }
});
