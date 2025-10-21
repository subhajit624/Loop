import { Notification } from "../models/notificationModels.js";


export const getNotifications = async(req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ receiver: userId }).populate('sender', 'username avatar').sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    } catch (error) {
        console.log("Error in getNotifications controller:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}


export const notificationMarkAsRead = async(req, res) => {
    try {
        const userId = req.user._id;
        const { notificationId } = req.params;
        const notification = await Notification.findOne({ _id: notificationId, receiver: userId });
        if(!notification){
            return res.status(404).json({ error: "Notification not found" });
        }
        notification.read = true;
        await notification.save();
        res.status(200).json({ message: "Notification seen" });
    } catch (error) {
        console.log("Error in notificationMarkAsRead controller:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}