import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { User } from "../models/userModels.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";


export const register = async(req, res) => {
    try {
        const {fullname, gmail, password} = req.body;
        if(!fullname || !gmail || !password){
            return res.status(400).json({message: "Please fill all the fields"});
        }
        const uniqueId = nanoid(4); 
        const username = `${fullname.toLowerCase().replace(/\s+/g, "")}_${uniqueId}`;
        const createdUser = await User.findOne({gmail});
        if(createdUser){
          return res.status(200).json({message: "you already have an account, please login"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullname,
            username,
            gmail,
            password: hashedPassword
        })
        generateTokenAndSetCookie(user._id, res);
        res.status(201).json({
          success: true,
          message: "Registered successfully",
          user
        });

    } catch (error) {
        console.log("error occur in register controller", error);
        res.status(500).json({ message: "Internal server error in register" });
    }
}


export const login = async(req, res) => {
    try {
        const {gmail, password} = req.body;
        if(!gmail || !password){
            return res.status(400).json({message: "Please fill all the fields"});
        }
        const existingUser = await User.findOne({gmail});
        if(!existingUser){
            return res.status(404).json({message: "You don't have an account, please register"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "password is incorrect"});
        }
        generateTokenAndSetCookie(existingUser._id, res);
        res.status(200).json({
          success: true,
          message: "Logged in successfully",
          user: existingUser
        });
    } catch (error) {
        console.log("error occur in login controller", error);
        res.status(500).json({ message: "Internal server error in login" });
    }
}


export const loginwithgoogle = async(req,res) => {
    try {
        const {fullname, gmail, avatar} = req.body;
        if(!fullname || !gmail || !avatar){
            return res.status(400).json({message: "Please fill all the fields"});
        }
        const existingUser = await User.findOne({gmail});
        if(existingUser){
            generateTokenAndSetCookie(existingUser._id, res);
            return res.status(200).json({
              success: true,
              message: "Logged in successfully",
              user: existingUser
            });
        }
        const uniqueId = nanoid(4); 
        const username = `${fullname.toLowerCase().replace(/\s+/g, "")}_${uniqueId}`;
        const user = await User.create({
            fullname,
            username,
            gmail,
            avatar
        })
        generateTokenAndSetCookie(user._id, res);
        res.status(201).json({
          success: true,
          message: "successfully loggedIn with google",
          user
        });
    } catch (error) {
        console.log("error occur in loginwithgoogle controller", error);
        res.status(500).json({ message: "Internal server error in loginwithgoogle" });
    }
}


export const logout = (req, res) => {
   try {
        res.cookie("token", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
   } catch (error) {
        console.log("error occur in logout controller", error);
        res.status(500).json({ message: "Internal server error in logout" });
   }
}



