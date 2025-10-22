import { User } from "../models/userModels.js";
import { Notification } from "../models/notificationModels.js";

export const follow = async (req, res) => {
  try {
    const { anotherUserId } = req.params;
    const loggedUserId = req.user._id;
    if (anotherUserId === loggedUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
    const anotherUser = await User.findById(anotherUserId);
    const loggedUser = await User.findById(loggedUserId);
    if(!anotherUser || !loggedUser){
      return res.status(404).json({ message: "User not found" });
    }
    const isAlreadyFollowing = loggedUser.following.includes(anotherUserId);
    if(isAlreadyFollowing){
      await User.findByIdAndUpdate(loggedUserId, { $pull: { following: anotherUserId } });
      await User.findByIdAndUpdate(anotherUserId, { $pull: { followers: loggedUserId } });
      await Notification.findOneAndDelete({
        sender: loggedUserId,
        receiver: anotherUserId,
        type: "follow",
      });
      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(loggedUserId, { $push: { following: anotherUserId } });
      await User.findByIdAndUpdate(anotherUserId, { $push: { followers: loggedUserId } });
      await Notification.create({
        sender: loggedUserId,
        receiver: anotherUserId,
        type: "follow",
      });
      return res.status(200).json({ message: "Followed successfully" });
    }
  } catch (error) {
    console.log("Error occurred in follow Controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
