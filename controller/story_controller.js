import { sequelize } from "../database/db.js";
import {
  GetStoryHighlights,
  createStory,
  getActiveTemporaryStory,
  storyFromFollowedUser,
} from "../model/story_model.js";

export let useCreateStory = async (req, res) => {
  try {
    let postData = req;
    let creatingPost = await createStory(postData);
    res.send(creatingPost);
  } catch (error) {
    res.status(404).json(error);
  }
};

export let useGetStoryHighlights = async (req, res) => {
  try {
    let requestData = req;
    let gettingStories = await GetStoryHighlights(requestData);
    res.send(gettingStories);
  } catch (error) {
    res.status(404).json(error);
  }
};

export let useTemporaryStory = async (req, res) => {
  try {
    let requestData = req;
    let TemporaryStory = await getActiveTemporaryStory(requestData);
    res.json(TemporaryStory);
  } catch (error) {
    res.status(404).json(error);
  }
};

export let useStoryFromFollowedUser = async (req, res) => {
  try {
    let requestData = req;
    let TemporaryStory = await storyFromFollowedUser(requestData);
    res.json(TemporaryStory);
  } catch (error) {
    res.status(404).json(error);
  }
};
