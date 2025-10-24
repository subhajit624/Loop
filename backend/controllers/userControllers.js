import cloudinary from '../config/cloudinaryConfig.js';
import streamifier from "streamifier";
import { User } from '../models/userModels.js';

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


export const changeAvatar = async(req, res) => {
    try {
        const file = req.file;
        const userId = req.user._id;
        if(!file){
            return  res.status(400).json({message: "No file uploaded"});
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const result =  await uploadFromBuffer(file.buffer, 'avatars', 'image');
        user.avatar = result.secure_url;
        await user.save();
        res.status(200).json({message: "Avatar changed successfully", user});
    } catch (error) {
        console.log("Error in changeAvatar controller:", error);
        res.status(500).json({message: "Something went wrong" });
    }
}


export const changeBio = async(req , res) => {
    try {
        const { bio } = req.body;
        const userId = req.user._id;
        if(!bio){
            return  res.status(200).json({message: "write something to change bio"});
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        user.bio = bio;
        await user.save();
        res.status(200).json({message: "Bio changed successfully", user});
    } catch (error) {
        console.log("Error in changeBio controller:", error);
        res.status(500).json({message: "Something went wrong" });
    }
}


export const getAllLoggedInUsers = async(req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({message: "fetched all user successfully", users });
    } catch (error) {
        console.log("Error in getAllLoggedInUsers controller:", error);
        res.status(500).json({message: "Something went wrong" });
    }
}