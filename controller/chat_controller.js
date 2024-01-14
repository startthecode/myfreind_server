import {
  getAllConversations,
  getConversationDTL,
  getPersonalChats,
  getUnseenConversationsCount,
  sendMessage,
} from "../model/chat_model.js";

export let useGetAllConversations = async (req, res) => {
  try {
    let postData = req;
    let data = await getAllConversations(postData);
    res.json(data);
  } catch (err) {
    res.json(err);
  }
};

export let useSendMessage = async (req, res) => {
  try {
    let postData = req;
    let sendingMessage = await sendMessage(postData);
    res.json(sendingMessage);
  } catch (err) {
    res.json(err);
  }
};

export let useGetPersonalChats = async (req, res) => {
  try {
    let postData = req;
    let sendingMessage = await getPersonalChats(postData);
    res.json(sendingMessage);
  } catch (err) {
    res.json(err);
  }
};

export let useGetConversationDTL = async (req, res) => {
  try {
    let postData = req;
    let convoDTL = await getConversationDTL(postData);
    res.json(convoDTL);
  } catch (err) {
    res.json(err);
  }
};

export let useGetUnseenConversationsCount = async (req, res) => {
  try {
    let postData = req;
    let data = await getUnseenConversationsCount(postData);
    res.json(data);
  } catch (err) {
    res.json(err);
  }
};
