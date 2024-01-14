import Express from "express";
import {
  useGetAllConversations,
  useGetConversationDTL,
  useGetPersonalChats,
  useGetUnseenConversationsCount,
  useSendMessage,
} from "../controller/chat_controller.js";

let routes = Express.Router();
export let chatRoutes = routes
  .get("/all", useGetAllConversations)
  .get("/unseen-count", useGetUnseenConversationsCount)
  .get("/conversation-dtl/:userid", useGetConversationDTL)
  .post("/sendMessage", useSendMessage)
  .get("/personal/:convo_id", useGetPersonalChats);
