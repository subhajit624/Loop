import { Save } from "../models/saveModels.js";


export const savePost = async (req, res) => {
     try {
        const { postId } = req.params;
        const userId = req.user.id;
        const existingSave = await Save.findOne({ user: userId, post: postId });
        if(existingSave){
           await Save.findByIdAndDelete(existingSave._id);
           return res.status(200).json({ message: "Post unsaved successfully" });
        }
        await Save.create({ user: userId, post: postId });
        res.status(200).json({ message: "Post saved successfully" });
     } catch (error) {
        console.log("Error in savePost controller:", error);
        res.status(500).json({ error: "Something went wrong" });
     }
}


export const showAllSavedPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const savedPosts = await Save.find({ user: userId }).populate('post').sort({ createdAt: -1 });
        res.status(200).json({ savedPosts });
    } catch (error) {
        console.log("Error in showAllSavedPosts controller:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}