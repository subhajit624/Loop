import jwt from "jsonwebtoken";
import {User} from "../models/userModels.js"

const protectedRoutes = async (req, res, next) => {
  try {
		const token = req.cookies.token;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user; // Attach the user to the request object

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}

export default protectedRoutes;