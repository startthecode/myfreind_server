import { sequelize } from "../database/db.js";
import { FollowList } from "../database/followTable.js";
import { FriendRequest, User, userProfile } from "../database/userTables.js";

export let followUser = async (followingReq) => {
  try {
    // FolllwingId - The user is sending request to follow a person with followingID
    let { followingid: FollowingID } = followingReq.body;
    // followerId - The user who is sending request to follow a person
    let FollowerID = followingReq.userDetail.UserID;

    if (FollowerID === FollowingID) throw "You can't follow yourself";

    let newFollower = await FollowList.create({ FollowingID, FollowerID });
    return newFollower;
  } catch (err) {
    throw err;
  }
};

export let unFollowUser = async (followingReq) => {
  try {
    // FolllwingId - The user is sending request to follow a person with followingID
    let { followingid: FollowingID } = followingReq.body;
    console.log(FollowingID);
    // followerId - The user who is sending request to follow a person
    let FollowerID = followingReq.userDetail.UserID;
    if (FollowerID === FollowingID) throw "You can't unfollow yourself";
    let unfollowedUser = await FollowList.destroy({
      where: { FollowingID: FollowingID, FollowerID: FollowerID },
    });
    if (unfollowedUser === 0) throw "NO User Exists";
    return unfollowedUser;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export let sendFriendRequest = async (requestData) => {
  try {
    let ReceiverID = requestData.body.requestReceiver;
    let SenderID = requestData.userDetail.UserID;

    if (!ReceiverID || ReceiverID === SenderID)
      throw "Invalid freind request received";

    let sendRequest = FriendRequest.create({
      SenderID: SenderID,
      ReceiverID: ReceiverID,
    });

    return sendRequest;
  } catch (e) {
    throw e;
  }
};

export let unSendFriendRequest = async (requestData) => {
  try {
    let ReceiverID = requestData.body.requestReceiver;
    let SenderID = requestData.userDetail.UserID;

    if (!ReceiverID || ReceiverID === SenderID)
      throw "Invalid unfreind request received";

    let sendRequest = FriendRequest.destroy({
      where: {
        SenderID: SenderID,
        ReceiverID: ReceiverID,
      },
    });

    return sendRequest;
  } catch (e) {
    throw e;
  }
};

export let acceptFriendRequest = async (requestData) => {
  try {
    let SenderID = requestData.body.requestSender;
    let ReceiverID = requestData.userDetail.UserID;

    if (!SenderID || ReceiverID === SenderID)
      throw "Invalid unfreind request received";

    let sendRequest = await FriendRequest.destroy({
      where: {
        SenderID: SenderID,
        ReceiverID: ReceiverID,
      },
    });

    if (sendRequest !== 0) {
      let acceptRequest = await FollowList.create({
        FollowerID: SenderID,
        FollowingID: ReceiverID,
      });
      return acceptRequest;
    }
    console.log(sendRequest);
    return new Error(
      "unable accept the freind request kindly refresh the page or retry after some time"
    );
  } catch (e) {
    throw e;
  }
};

export let deleteFriendRequest = async (requestData) => {
  console.log(requestData);
  try {
    let SenderID = requestData.body.requestSender;
    let ReceiverID = requestData.userDetail.UserID;
    if (!SenderID || ReceiverID === SenderID)
      throw "Invalid unfreind request received";

    let deletedRequest = await FriendRequest.destroy({
      where: {
        SenderID: SenderID,
        ReceiverID: ReceiverID,
      },
    });

    return deletedRequest;
  } catch (e) {
    throw e;
  }
};

export let friendRequestStatus = async (requestData) => {
  try {
    let ReceiverID = requestData.params.requestReceiver;
    let SenderID = requestData.userDetail.UserID;
    console.log(ReceiverID, "================ =================");

    if (!ReceiverID || ReceiverID === SenderID)
      throw "Invalid freind request received";

    let requestStatus = FriendRequest.findOne({
      where: { SenderID: SenderID, ReceiverID: ReceiverID },
    });

    return requestStatus;
  } catch (e) {
    throw e;
  }
};

export let getAllFreindRequest = async (requestData) => {
  try {
    let userID = requestData.userDetail.UserID;

    let allRequests = FriendRequest.findAll({
      include: {
        model: User,
        as: "requestSenders",
        attributes: ["Username", "UserID"],
        include: {
          model: userProfile,
          as: "userProfile",
          attributes: ["UserDp"],
        },
      },
      attributes: [],
      where: { ReceiverID: userID },
    });

    return allRequests;
  } catch (e) {
    throw e;
  }
};

export let getFreindRequestCount = async (requestData) => {
  try {
    let userID = requestData.userDetail.UserID;
    let count = FriendRequest.count({
      where: { ReceiverID: userID },
    });
    console.log(count);
    return count;
  } catch (e) {
    throw e;
  }
};
