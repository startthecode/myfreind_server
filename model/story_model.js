import { FollowList } from "../database/followTable.js";
import { HightlightedStory, Story } from "../database/postTable.js";
import { literal, Op } from "sequelize";
import { User } from "../database/userTables.js";

export const createStory = async (postReq) => {
  try {
    const dataToBeAdded = {
      StoryContentURL: postReq.file.path,
      UserID: postReq.userDetail.UserID,
      ...(postReq.body.hightlight_title && {
        HightlightTitle: postReq.body.hightlight_title,
      }),
    };

    const newStory = await Story.create(dataToBeAdded);

    if (newStory.dataValues.StoryID && dataToBeAdded.HightlightTitle) {
      const hightLighted = await HightlightedStory.create({
        ...dataToBeAdded,
        StoryID: newStory.dataValues.StoryID,
      });

      return { hightLighted, newStory };
    }

    return newStory;
  } catch (error) {
    console.error("Error creating story:", error);
    throw error; // or handle the error in a more appropriate way
  }
};

export let GetStoryHighlights = async (requestData) => {
  try {
    let userID = requestData?.params?.userid;
    let findStoryHightlights = await Story.findAll({
      include: {
        model: HightlightedStory,
        where: {
          UserID: userID,
        },
        attributes: ["HightlightTitle"],
      },
      attributes: ["StoryID", "StoryContentURL", "UserID", "createdAt"],
    });
    const groupedByTitle = findStoryHightlights.reduce((result, item) => {
      const title = item.HightlightedStory.HightlightTitle;
      // Create an array for the title if it doesn't exist
      result[title] = result[title] || [];
      result[title].push(item);

      return result;
    }, {});

    // Access the arrays using the HightlightTitle as keys
    const highlight1Array = groupedByTitle || [];

    return groupedByTitle;
  } catch (error) {
    return error; // or handle the error in a more appropriate way
  }
};

export let getActiveTemporaryStory = async (requestData) => {
  try {
    let userid = requestData.query.userid;
    let activeTemporaryStory = await Story.findAll({
      where: literal(
        `TIMESTAMPDIFF(HOUR, createdAt, NOW()) < 24 AND UserId = ${userid}`
      ),
    });
    return activeTemporaryStory;
  } catch (error) {
    throw error; //
  }
};

export const storyFromFollowedUser = async (postReq) => {
  try {
    let userid = postReq.userDetail.UserID;

    const userIDs = await FollowList.findAll({
      where: { [Op.or]: { FollowerID: userid, FollowingID: userid } },
      attributes: ["FollowingID"],
      raw: true,
    });
    const FollowingID = userIDs.reduce(
      (acc, item) => acc.concat(item.FollowingID),
      [userid]
    );

    const getStorys = await Story.findAll({
      where: {
        UserID: { [Op.in]: FollowingID },
        createdAt: {
          [Op.and]: [literal("TIMESTAMPDIFF(HOUR, createdAt, NOW()) < 24")],
        },
      },
      order: [["createdAt", "DESC"]],
      attributes: ["StoryContentURL", "createdAt", "UserID", "StoryID"],
    });

    let newArray = getStorys.reduce((acc, item) => {
      const title = `userID_${item.UserID}`;

      acc[title] = acc[title] || [];
      acc[title].push(item);
      return acc;
    }, {});



    return newArray;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
