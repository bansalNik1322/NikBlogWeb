import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"

var checkUserAuth = async (req, res, next) => {
    const token = req.cookies.JWT
    if (token) {
        try {
            // verifiy token -- 
            const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)

            // Get User from Token
            let user = await userModel.findById(userID).select('-password')
            if (user) {
                next()
            } else {
                console.log("Invalid token");
                res.redirect("/user/login")
            }
        }
        catch (error) {
            console.log(error);
        }
    } else {
        console.log("No token");
        res.redirect("/user/login")
    }
}


export default checkUserAuth