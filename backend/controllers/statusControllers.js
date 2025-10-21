import {Status} from "../models/statusModels.js";
import cloudinary from '../config/cloudinaryConfig.js';
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



export const createImageStatus = async(req, res) => {
    try {
        const file = req.file;
        const { text } = req.body;
        const userId = req.user._id;
        if(!file){
            return res.status(400).json({ message: "No file uploaded" });
        }
        const result = await uploadFromBuffer(file.buffer, "status/images", "image");
        const newStatus = await Status.create({
            user: userId,
            text,
            media: { url: result.secure_url, type: "image" },
        });
        res.status(201).json({ message: "New Status image Created Successfully", status: newStatus });
    } catch (error) {
        console.log("Error in createImageStatus controller:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export const createVideoStatus = async(req , res) => {
    try {
        const file = req.file;
        const { text } = req.body;
        const userId = req.user._id;
        if(!file){
            return res.status(400).json({ message: "No file uploaded" });
        }
        const result = await uploadFromBuffer(file.buffer, "status/videos", "video");
        const newStatus = await Status.create({
            user: userId,
            text,
            media: { url: result.secure_url, type: "video" },
        });
        res.status(201).json({ message: "New Status video Created Successfully", status: newStatus });
    } catch (error) {
        console.log("Error in createVideoStatus controller:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export const getAllStatus = async(req, res) => {
    try {
        const statuses = await Status.find({}).populate("user", "username avatar").sort({ createdAt: -1 });
        res.status(200).json({message: "fetched All status Successfully", statuses });
    } catch (error) {
        console.log("Error in getAllStatus controller:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export const getStatus = async(req, res) => {
    try {
        const { statusId } = req.params;
        const status = await Status.findById(statusId).populate("user", "username avatar");
        if(!status){
            return res.status(404).json({ message: "Status not found" });
        }
        res.status(200).json({ status });
    } catch (error) {
        console.log("Error in getStatus controller:", error);
        res.status(500).json({message: "Something went wrong" });
    }
}


