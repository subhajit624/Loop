import { Post } from "../models/postModels.js";
import { User } from "../models/userModels.js";
import { Notification } from "../models/notificationModels.js";

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if(!post){
      return res.status(404).json({ message: "Post not found" });
    }
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
      await Notification.findOneAndDelete({
        sender: userId,
        receiver: post.author,
        type: "like",
      });
    } else {
      post.likes.push(userId);
      if (userId.toString() !== post.author.toString()) {
        await Notification.create({
          sender: userId,
          receiver: post.author,
          type: "like",
        });
      }
    }
    await post.save();
    return res.status(200).json({ message: isLiked ? "Post unliked" : "Post liked", likes: post.likes });
  } catch (error) {
    console.log("Error in likePost Controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllLikedUsers = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if(!post){
      return res.status(404).json({ message: "Post not found" });
    }
    if(post.likes.length === 0){
      return res.status(200).json({ message: "No one has liked this post yet." });
    }
    const likedUsersDetails = await User.find({ _id: { $in: post.likes } }).select("username avatar fullname");
    return res.status(200).json({
      message: "Users who liked this post fetched successfully",
      likedUsersDetails
    });
  } catch (error) {
    console.log("Error occurred in getAllLikeUsers Controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
