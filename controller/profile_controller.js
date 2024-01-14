import { async } from "regenerator-runtime";
import {
  chngeAccountPrivacy,
  getAccountPrivacy,
  getOthersProfile,
  getUserIntro,
  getUserOverview,
  getUserProfile,
  searchUsers,
  updateUserProfile,
} from "../model/profile_model.js";

export async function useUpdateUserProfile(req, res) {
  try {
    let request_data = req;
    let update_profile = await updateUserProfile(request_data);
    if (update_profile.includes(0))
      return res.status(204).send("Nothing to update");
    res.status(200).send("Details updated successfully");
  } catch (e) {
    res.status(403).send("Invalid profile request received");
  }
}

export let useUserIntroData = async (req, res) => {
  try {
    let requestData = req;
    let userIntro = await getUserIntro(requestData);
    res.json(userIntro);
  } catch (e) {
    res.status(403).send("Invalid profile request received");
  }
};

export let useGetUserProfile = async (req, res) => {
  try {
    let requestData = req;
    let userProfile = await getUserProfile(requestData);
    res.json(userProfile);
  } catch (e) {
    res.status(403).send("Invalid profile request received");
  }
};

export let useGetUserOverview = async (req, res) => {
  try {
    let requestData = req;
    let userOverview = await getUserOverview(requestData);
    res.json(userOverview);
  } catch (e) {
    res.status(403).json(e);
  }
};

export let useChngeAccountPrivacy = async (req, res) => {
  try {
    console.log(req.body);
    let requestData = req;
    let changeprivacy = await chngeAccountPrivacy(requestData);
    res.json(changeprivacy);
  } catch (e) {
    res.status(403).json(e);
  }
};

export let useGetAccountPrivacy = async (req, res) => {
  try {
    let requestData = req;
    let getPrivacyStatus = await getAccountPrivacy(requestData);
    res.json(getPrivacyStatus);
  } catch (e) {
    res.status(403).json(e);
  }
};

// Friends profile or others profile

export let useGetOthersProfile = async (req, res) => {
  try {
    let requestData = req;
    let othersProfile = await getOthersProfile(requestData);
    res.json(othersProfile);
  } catch (e) {
    res.status(403).send("Invalid profile request received");
  }
};


// search for users
export let useSearchUsers = async (req, res) => {
  try {
    let requestData = req;
    let searchedUsers = await searchUsers(requestData);
    res.json(searchedUsers);
  } catch (e) {
    res.status(403).send("Invalid profile request received");
  }
};

