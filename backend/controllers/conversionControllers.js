import { Conversation } from "../models/conversationModels.js";


export const getOrCreateConversation = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.params;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("participants", "username avatar").populate({
      path: "messages",
      options: { sort: { createdAt: 1 } }, 
      populate: { path: "sender receiver", select: "username avatar" },
    });
    if(!conversation){
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }
    res.status(200).json({success: true, conversation});
  } catch (error) {
    console.log("Error in getOrCreateConversation:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const getAllConversationsUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      participants: userId,
    }).populate("participants", "username avatar").populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 }, 
        populate: { path: "sender", select: "username avatar" },
      }).sort({ updatedAt: -1 });
    res.status(200).json({success: true, conversations});
  } catch (error) {
    console.log("Error in getConversations:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
