import {
  acceptFriendRequest,
  deleteFriendRequest,
  followUser,
  friendRequestStatus,
  getAllFreindRequest,
  getFreindRequestCount,
  sendFriendRequest,
  unFollowUser,
  unSendFriendRequest,
} from "../model/follow_model.js";

export let usefollowUser = async (req, res) => {
  try {
    let followingReq = req;
    let creatingFollower = await followUser(followingReq);
    res.status(200).json("followed successfully");
  } catch (err) {
    res.status(401).json({ error: err });
  }
};

export let useunFollowUser = async (req, res) => {
  try {
    let followingReq = req;
    let unFollowingUser = await unFollowUser(followingReq);
    console.log(unFollowingUser);

    res.status(200).json(`Successfully unfollowed`);
  } catch (err) {
    res.status(401).json({ error: err });
  }
};

export let useSendFriendRequest = async (req, res) => {
  try {
    let requestData = req;
    let sendingRequest = await sendFriendRequest(requestData);
    res.json(sendingRequest);
  } catch (e) {
    console.log(e);

    res.status(403).send("Invalid request received");
  }
};

export let useUnSendFriendRequest = async (req, res) => {
  try {
    let requestData = req;
    let sendingRequest = await unSendFriendRequest(requestData);
    res.json(sendingRequest);
  } catch (e) {
    console.log(e);

    res.status(403).send("Invalid request received");
  }
};

export let useAcceptFriendRequest = async (req, res) => {
  try {
    let requestData = req;
    let acceptRequest = await acceptFriendRequest(requestData);
    res.json(acceptRequest);
  } catch (e) {
    console.log(e);
    res.status(403).send("Invalid request received");
  }
};

export let useDeleteFriendRequest = async (req, res) => {
  try {
    let requestData = req;
    console.log(requestData.body);
    let deleteRequest = await deleteFriendRequest(requestData);
    res.json(deleteRequest);
  } catch (e) {
    console.log(e);
    res.status(403).send("Invalid request received");
  }
};

export let useFriendRequestStatus = async (req, res) => {
  try {
    let requestData = req;
    let requestStatus = await friendRequestStatus(requestData);
    res.json(requestStatus);
  } catch (e) {
    res.status(403).send("Invalid request received");
  }
};

export let useGetAllFreindRequest = async (req, res) => {
  try {
    let requestData = req;
    let allFreindRequests = await getAllFreindRequest(requestData);
    res.json(allFreindRequests);
  } catch (e) {
    console.log(e);
    res.status(403).send("Invalid request received");
  }
};


export let useGetFreindRequestCount  = async (req, res) => {
  try {
    let requestData = req;
    let count = await getFreindRequestCount(requestData);
    res.json(count);
  } catch (e) {
    console.log(e);
    res.status(403).send("Invalid request received");
  }
};