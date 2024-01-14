import { FollowList } from "../database/followTable.js";
import { FriendRequest, User, userProfile } from "../database/userTables.js";

import { Op } from "sequelize";

export async function updateUserProfile(requestData) {
  try {
    let DOB = requestData?.body?.dob;
    let Bio = requestData?.body?.bio;
    let FullName = requestData?.body?.fullname;
    let LinksList = requestData?.body?.linklist;
    let Gender = requestData?.body?.gender;
    let UserDP = requestData?.file?.path;
    let UserID = requestData.userDetail.UserID;

    let dataTobeUpdated = {
      ...(DOB && { DOB }),
      ...(Bio && { Bio }),
      ...(UserDP && { UserDP }),
      ...(FullName && { FullName }),
      ...(LinksList && { LinksList }),
      ...(Gender && { Gender }),
    };

    let updateingUser = await userProfile.update(dataTobeUpdated, {
      where: { UserID: UserID },
    });
    let data = updateingUser;
    return data;
  } catch (e) {
    throw e;
  }
}

export let getUserIntro = async (requestData) => {
  try {
    let userID = requestData.userDetail.UserID;

    if (!userID) throw "User ID does not exist";
    let userIntro = await userProfile.findAll({
      attributes: ["FullName", "UserDP"],
      where: { UserID: userID },
    });
    return userIntro;
  } catch (e) {
    throw e;
  }
};

export let getUserProfile = async (requestData) => {
  try {
    let userID = requestData.userDetail.UserID;

    if (!userID) throw "User ID does not exist";
    let userProfileData = await userProfile.findAll({
      where: { UserID: userID },
    });

    return userProfileData;
  } catch (e) {
    throw e;
  }
};

export let getUserOverview = async (requestData) => {
  try {
    let userID = requestData?.query?.userid;
    if (!userID) throw "User ID does not exist";
    let userOverview = await User.findAll({
      include: {
        model: userProfile,
        attributes: ["FullName", "UserDP"],
        as: "userProfile",
        where: { UserID: userID },
      },
      attributes: ["UserName", "Email"],
    });
    return userOverview;
  } catch (err) {
    throw err;
  }
};

export let chngeAccountPrivacy = async (requestData) => {
  try {
    let userID = requestData?.userDetail?.UserID;
    let privacyStatus = requestData?.body?.privacyStatus;

    let chngPrivacy = await User.update(
      {
        AccountPrivacy: privacyStatus,
      },
      { where: { UserID: userID } }
    );

    return chngPrivacy;
  } catch (err) {
    throw err;
  }
};

export let getAccountPrivacy = async (requestData) => {
  try {
    let userID = requestData?.userDetail?.UserID;
    let getPrivacyStatus = await User.findOne({
      attributes: ["AccountPrivacy"],
      where: { UserID: userID },
    });

    return getPrivacyStatus;
  } catch (err) {
    throw err;
  }
};

// Friends profile or others profile

export let getOthersProfile = async (requestData) => {
  try {
    let userName = requestData.params.username;
    if (!userName) throw "User ID does not exist";

    let { AccountPrivacy } = await User.findOne({
      // attributes: ["UserID", "UserName", "AccountPrivacy"],
      where:{UserName:userName},
      attributes: ["AccountPrivacy"],
    });

    // let {SenderID} = FriendRequest.findOne({
    //   where: { UserID: userName },
    // })

    let { Following: isUsersFriend } =
      (await User.findOne({
        // attributes: ["UserID", "UserName", "AccountPrivacy"],
        attributes: [],
        include: {
          model: FollowList,
          as: "Following",
          where: { FollowerID: requestData.userDetail.UserID },
        },
        where: { UserName: userName },
      })) ?? {};

    let userProfileData = await User.findOne({
      // attributes: ["UserID", "UserName", "AccountPrivacy"],
      attributes: ["UserID", "UserName", "AccountPrivacy"],
      include: {
        model: userProfile,
        attributes: [
          "FullName",
          "LinksList",
          "Bio",
          "UserDP",
          "TotalFollowers",
          "TotalFollowing",
          "TotalPosts",
        ],
        as: "userProfile",
      },
      where: { UserName: userName },
    });

    let isRequestingME = async () => {
      if (userProfileData?.dataValues?.UserID) {
        let { SenderID } =
          (await FriendRequest.findOne({
            where: {
              SenderID: userProfileData?.dataValues?.UserID,
              ReceiverID: requestData.userDetail.UserID,
            },
          })) ?? {};

        if (SenderID) return true;
      }
      return false;
    };
    console.log(AccountPrivacy);
    let additionalPerameters = {
      isAccessible: isUsersFriend ? true : AccountPrivacy ? false : true,
      isUsersFriend: isUsersFriend ? true : false,
      isRequestingME: await isRequestingME(),
    };

    return {
      ...userProfileData?.dataValues,
      ...additionalPerameters,
    };
  } catch (e) {
    throw e;
  }
};

// search for users

export let searchUsers = async (requestData) => {
  try {
    let username = requestData.params.username;
    if (!username) return "no user Found";
    const users = await User.findAll({
      include: {
        model: userProfile,
        as: "userProfile",
        attributes: [
          "UserDp",
          "FullName",
          "TotalFollowers",
          "TotalFollowing",
          "TotalPosts",
        ],
      },
      attributes: ["UserID", "UserName", "AccountPrivacy"],
      where: {
        UserName: { [Op.startsWith]: username },
      },
    });

    return users;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
