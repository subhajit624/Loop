
export const loginUserdata = async(req, res) => {
    try {
         res.status(200).json({
            message: "User data retrieved successfully",
            success: true,
            user: req.user
        });
    } catch (error) {
        console.log("Error in loginUserdata:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}