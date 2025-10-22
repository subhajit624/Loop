import cloudinary from "../config/cloudinaryConfig.js";
import { Post } from "../models/postModels.js";
import { User } from "../models/userModels.js";
import streamifier from "streamifier";

// Upload helper for memory buffer
const uploadFromBuffer = (buffer, folder, resourceType) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};


export const createPostImages = async (req, res) => {
  try {
    const files = req.files; 
    const { caption } = req.body;
    const authorId = req.user._id;

    if(!files || files.length === 0){
      return res.status(400).json({ message: "No files uploaded" });
    }
    const mediaArray = [];

    for(const file of files){
      const result = await uploadFromBuffer(file.buffer, "posts/images", "image");
      mediaArray.push({ url: result.secure_url, type: "image" });
    }

    const newPost = await Post.create({
      author: authorId,
      caption,
      media: mediaArray,
      message: "Image Posted Successfully",
    });

    res.status(201).json({ message: "New Image Post Uploaded Successfully", post: newPost });
  } catch (err) {
    console.log("error occur in createPostImages controller", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};



export const createPostVideo = async (req, res) => {
  try {
    const file = req.file; // single video
    const { caption } = req.body;
    const authorId = req.user._id;
    if(!file){
      return res.status(400).json({ message: "No file uploaded" });
    }
    const result = await uploadFromBuffer(file.buffer, "posts/videos", "video");
    const newPost = await Post.create({
      author: authorId,
      caption,
      media: [{ url: result.secure_url, type: "video" }],
    });
    res.status(201).json({ message: "New Reels Uploaded Successfully", post: newPost });
  } catch (err) {
    console.log("error occur in createPostVideo controller", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};



export const getPostImages = async (req, res) => {
  try {
      const { postId } = req.params;
      const post = await Post.findOne({_id: postId, "media.type": "image" });
      if(!post){
        return res.status(404).json({ message: "Post not found or no image available" });
      }
      res.status(200).json({
        message: "Images fetched successfully",
        post
      })
  } catch (error) {
    console.log("error occur in getPostImages controller", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}



export const getPostVideo = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({_id: postId, "media.type": "video" });
    if(!post){
      return res.status(404).json({ message: "Post not found or no video available" });
    }
    res.status(200).json({
      message: "Post with video fetched successfully",
      post
    });
  } catch (error) {
    console.log("Error occur in getPostVideo controller", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};



export const getAllPostsOfLoggedInUser = async (req, res) => {
  try {
    const authorId = req.user._id;  
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 5; 
    const skip = (page - 1) * limit;              

    const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalPosts = await Post.countDocuments({ author: authorId });
    if(!posts || posts.length === 0){
      return res.status(404).json({ message: "You haven't posted yet" });
    }
    res.status(200).json({
      message: "Posts fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts
    });
  } catch (error) {
    console.log("error occur in getAllPostsOfLoggedInUser controller", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};



export const getAllPostsOfAnotherUser = async (req, res) => {
  try {
    const AnotherUserId = req.params.id;  
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 5; 
    const skip = (page - 1) * limit;              

    const posts = await Post.find({ author: AnotherUserId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalPosts = await Post.countDocuments({ author: AnotherUserId });
    if(!posts || posts.length === 0){
      return res.status(404).json({ message: "He haven't posted yet" });
    }
    res.status(200).json({
      message: "Posts fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts
    });
  } catch (error) {
    console.log("error occur in getAllPostsOfAnotherUser controller", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};



export const getAllVideosOfRandomUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments({ "media.type": "video" });
    if(totalPosts === 0){
      return res.status(404).json({ message: "No videos found yet" });
    }
    let posts = await Post.aggregate([
      { $match: { "media.type": "video" } }, 
      { $sample: { size: totalPosts } }     
    ]);

    posts = await User.populate(posts, {
      path: "author",
      select: "_id username avatar",
    });

    const paginatedPosts = posts.slice(skip, skip + limit);
    res.status(200).json({
      message: "Videos fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts: paginatedPosts
    });
  } catch (error) {
    console.log("Error in getAllVideosOfRandomUsers controller:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};



export const getAllPostOfRandomUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments({});
    if (totalPosts === 0) {
      return res.status(404).json({ message: "No posts found yet" });
    }
    let posts = await Post.aggregate([{ $sample: { size: totalPosts } }]);

    posts = await User.populate(posts, {
      path: "author",
      select: "_id username avatar",
    });

    const paginatedPosts = posts.slice(skip, skip + limit);

    res.status(200).json({
      message: "Posts fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts: paginatedPosts,
    });
  } catch (error) {
    console.log("Error in getAllPostOfRandomUsers controller:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const authorId = req.user._id;
    const post = await Post.findOneAndDelete({ _id: postId, author: authorId });
    if(!post){
      return res.status(404).json({ message: "You can't delete others post" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost controller:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
