

export const aiResponse = async(req, res) => {
    try {
        res.json({me: "hey"})
    } catch (error) {
        console.log("error occur in aiResponse controllers");
        res.status(500).json({ message: "Internal server error" });
    }
}