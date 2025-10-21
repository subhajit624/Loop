import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    // res.cookie("token", token, {
    //     maxAge: 15 * 24 * 60 * 60 * 1000, 
    //     httpOnly: true,
    //     sameSite: 'none',
    //     secure: true,
    // });
        res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
});

};

export default generateTokenAndSetCookie;
