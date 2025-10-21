import { Comment } from "../models/commentModels.js";
import { Post } from "../models/postModels.js";
import { Notification } from "../models/notificationModels.js";


export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;
    if(!text){
      return res.status(200).json({ message: "Write something to comment" });
    }
    const newComment = await Comment.create({
      post: postId,
      author: userId,
      text,
    });
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
    const post = await Post.findById(postId);
    if(post && post.author.toString() !== userId.toString()){
      await Notification.create({
        sender: userId,
        receiver: post.author,
        type: "comment",
      });
    }
    return res.status(201).json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    console.log("Error occurred in createComment Controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getAllcomments = async (req, res) =>{
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId }).populate('author', ' username avatar').sort({ createdAt: -1 });
        if(comments.length === 0){
          return res.status(200).json({ message: "No comments done yet" });
        }
        return res.status(200).json({ message: "Comments fetched successfully", comments });
    } catch (error) {
        console.log("Error occurred in getAllComments Controller", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export const deleteComment = async (req, res) =>{
    try {
        const { commentId } = req.params;
        const userId = req.user._id;
        const comment = await Comment.findById(commentId);
        const post = await Post.findById(comment.post);
        if(!comment){
          return res.status(404).json({ message: "Comment not found" });
        }
        if(!post){
          return res.status(404).json({ message: "Post not found" });
        }
        if(comment.author.toString() !== userId.toString() && post.author.toString() !== userId.toString()){
          return res.status(200).json({ message: "You can't delete this comment" });
        }
        await Comment.findByIdAndDelete(commentId);
        await Post.findByIdAndUpdate(post._id, { $pull: { comments: commentId } });
        return res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error) {
        console.log("Error occurred in deleteComment Controller", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}