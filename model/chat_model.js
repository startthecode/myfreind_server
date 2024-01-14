import { Conversation, Message, Participant } from "../database/chatTable.js";
import { sequelize } from "../database/db.js";
import { User, userProfile } from "../database/userTables.js";
import { DataTypes, Op, where } from "sequelize";

export let getAllConversations = async (requestData) => {
  try {
    const userId = requestData.userDetail.UserID;
    const users = await User.findByPk(userId, {
      attributes: [],
      include: {
        model: Conversation,
        as: "participants",
        through: {
          model: Participant,
          attributes: [
            "ParticipantID",
            "LastMessage",
            "UnseenMessageCount",
            "Seen",
            "updatedAt",
          ],
        },
        include: {
          model: User,
          as: "user",
          where: { UserID: { [Op.not]: userId } },
          attributes: ["UserID", "UserName"],
          through: {
            model: Participant,
            attributes: [],
          },
          include: {
            model: userProfile,
            as: "userProfile",
            attributes: ["UserDP", "FullName"],
          },
        },
      },
    });

    return users;
  } catch (error) {
    throw error;
  }
};

export let sendMessage = async (requestData) => {
  try {
    let conversationid = requestData.body?.conversationid;
    let receiverid = requestData.body?.receiver;
    let senderid = requestData.userDetail.UserID;
    let message = requestData.body?.message;
    let UnseenMessageCount = requestData.body?.UnseenMessageCount;

    if (!message || !senderid) throw "invalid Value";

    async function newConversationID() {
      console.log("called");

      if (!conversationid) {
        console.log("called");
        let { ConversationID } = await Conversation.create();
        await Participant.bulkCreate([
          {
            ConversationID: ConversationID,
            UserID: receiverid,
          },
          {
            ConversationID: ConversationID,
            UserID: senderid,
          },
        ]);

        return ConversationID;
      }
    }

    let {
      content,
      ConversationID: conversationID,
      SenderID,
      created_at,
      MessageID,
    } = await Message.create({
      content: message,
      SenderID: senderid,
      ConversationID: conversationid || (await newConversationID()),
    });

    if (UnseenMessageCount) {
      await Participant.update(
        {
          UnseenMessageCount: sequelize.literal("UnseenMessageCount + 1"),
        },
        { where: { UserID: receiverid, ConversationID: conversationID } }
      );

      await Participant.update(
        {
          Seen: false,
        },
        { where: { UserID: senderid, ConversationID: conversationID } }
      );
    }

    return { content, conversationID, SenderID, created_at, MessageID };
  } catch (error) {
    throw error;
  }
};

export let getPersonalChats = async (requestData) => {
  try {
    const conversationID = requestData.params.convo_id;

    let chats = await Message.findAll({
      order: [["created_at", "ASC"]],
      where: {
        ConversationID: conversationID,
      },
    });
    return chats;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export let getConversationDTL = async (requestData) => {
  try {
    let user1 = requestData.userDetail.UserID;
    let user2 = requestData.params.userid;

    const participants = await Participant.findOne({
      where: {
        [Op.or]: [
          {
            UserID: user1,
            ConversationID: {
              [Op.in]: sequelize.literal(
                `(SELECT ConversationID FROM Participants WHERE UserID = ${user2})`
              ),
            },
          },
          {
            UserID: user2,
            ConversationID: {
              [Op.in]: sequelize.literal(
                `(SELECT ConversationID FROM Participants WHERE UserID = ${user1})`
              ),
            },
          },
        ],
      },
      attributes: ["ConversationID"],
    });
    let { ConversationID } = participants;
    console.log(ConversationID);
    if (ConversationID) {
      await Participant.update(
        {
          UnseenMessageCount: 0,
          Seen: true,
        },
        {
          where: {
            UserID: { [Op.not]: user1 },
            ConversationID: ConversationID,
          },
        }
      );
      await Participant.update(
        {
          UnseenMessageCount: 0,
        },
        {
          where: {
            UserID: user1,
            ConversationID: ConversationID,
          },
        }
      );
    }
    return participants;
  } catch (error) {
    throw error;
  }
};

export let getUnseenConversationsCount = async (requestData) => {
  try {
    const userId = requestData.userDetail.UserID;
    let count = await Participant.count({
      where: {
        UserID: userId,
        UnseenMessageCount: { [Op.not]: 0 },
      },
    });
    return count;
  } catch (error) {
    throw error;
  }
};
