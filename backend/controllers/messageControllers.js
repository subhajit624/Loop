import cloudinary from '../config/cloudinaryConfig.js';
import streamifier from "streamifier";
import { Message } from '../models/messageModels.js';
import { Conversation } from '../models/conversationModels.js';

// Helper to upload image buffer to Cloudinary
const uploadFromBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};


export const sendMessage = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const file = req.file;
    const { text } = req.body;
    const senderId = req.user._id;
    if(!file && !text){
      return res.status(200).json({ message: "Nothing to send" });
    }
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if(!conversation){
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }
    let media = null;
    if (file) {
      const result = await uploadFromBuffer(file.buffer, 'messages');
      media = {
        url: result.secure_url,
        type: 'image',
      };
    }
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text: text || "",
      media,
    });
    conversation.messages.push(newMessage._id);
    await conversation.save();
    res.status(200).json({
      message: "Message sent successfully",
      success: true,
      messageData: newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
