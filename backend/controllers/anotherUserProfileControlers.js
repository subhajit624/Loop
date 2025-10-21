import { User } from "../models/userModels.js";

export const anotherUserProfile = async (req, res) => {
  try {
    const { anotherUserId } = req.params;

    const anotherUser = await User.findById(anotherUserId).select("-password"); // exclude password for safety

    if (!anotherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user: anotherUser,
    });
  } catch (error) {
    console.log("Error occurred in anotherUserProfile controller:", error);
    res.status(500).json({ message: "Internal server error in anotherUserProfile" });
  }
};
