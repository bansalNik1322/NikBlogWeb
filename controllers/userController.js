import userModel from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../config/emailConfig.js"
let otp = Math.trunc(Math.random() * 1000000)

class userController {
    static getLogin = async (req, res) => {
        await res.render("user/login", { errors: {} })
    }

    static getRegister = async (req, res) => {
        await res.render("user/register", { errors: {} })
    }


    static forgotPassword = async (req, res) => {
        res.render("user/forgotpassword", { errors: {} })
    }
  
    static resetPassword = async (req, res) => {
        res.render("user/resetpassword", { errors: {}, userId: req.params.id, userToken: req.params.token })
    }

    static userVerification = (req, res) => {
        res.render("user/emailVerification", { errors: {} })
    }
    static registerUser = async (req, res) => {
        const { name, userName, confirmPassword, email, gender, phoneNumber, password } = req.body

        //    Check if the email is already registered or not -- 
        // const user = userModel.find({ email: email })
        let errors = {}
        if (name) {
            if (!(name.match(/^[a-zA-Z ]{2,30}$/))) {
                errors['nameError'] = "Please enter a name between 2 to 30 chars. No special Chars."
            }
        }
        else {
            errors['nameError'] = "Please enter a your Name."
        }

        if (!gender) {
            errors['genderError'] = "Please select your gender"
        }

        if (email) {
            if (!(email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))) {
                errors['emailError'] = "Please enter a Valid Email."
            }
        }
        else {
            errors['emailError'] = "Please enter a  Email."
        }

        if (userName) {
            if (!(userName.match(/^[a-z0-9_\.]+$/))) {
                errors['userNameError'] = "Please enter a Valid userName."
            }
        }
        else {
            errors['userNameError'] = "Please enter a userName."
        }


        if (phoneNumber) {
            if (!(phoneNumber.match(/^(\([0-9]{3}\)\s*|[0-9]{3}\-)[0-9]{3}-[0-9]{4}$/))) {
                errors['phoneError'] = "Please enter a Valid Phone Number."
            }
        }
        else {
            errors['phoneError'] = "Please enter a  Phone Number."
        }


        if (password) {
            if (!(password.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/))) {
                errors['passwordError'] = "Please enter a valid password.."
            }
        }
        else {
            errors['passwordError'] = "Please enter a password.."
        }

        if (confirmPassword) {
            if (!(password === confirmPassword)) {
                errors['confirmPasswordError'] = "Your password and confirm password doesn't match."
            }
        } else {
            errors['confirmPasswordError'] = "Please enter a confirm password.."
        }
        console.log(errors);
        console.log(req.body);

        let errorsLen = Object.keys(errors).length
        console.log(errorsLen)
        if (errorsLen > 0) {
            res.render("user/register", { errors: errors })
        } else {
            let newUser = new userModel({
                name, userName, email, password, phoneNumber, gender
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) console.log(err);
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            // sending verification mail
                            console.log(user._id);
                            // req.session.userId = user._id
                            // let info = transporter.sendMail({
                            //     from: process.env.EMAIL_FROM,
                            //     to: email,
                            //     subject: "One Time Password Email Verification",
                            //     html: `<h1>Use this as your One Time password ${otp}. Valid for only 10 minutes.</h1>`
                            // })
                            res.redirect("/user/login")
                        })
                        .catch(err => res.render("user/register", { errors: errors }));
                });
            });
        }
    }


    static loginUser = (req, res) => {
        let { email, password } = req.body
        let errors = {}
        console.log(req.body)

        userModel.findOne({ email: email }).then(user => {
            if (!user) {
                errors['emailError'] = "Email is not registered. Please Sign Up."
                res.render("user/login", { errors: errors })
            } else {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        console.log(err);
                    };
                    if (isMatch) {
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                        user.token = token
                        user.save()
                        res.cookie("JWT", token, {
                            httpsonly: true
                        })
                        res.redirect("/user")
                    } else {
                        errors['passwordError'] = "Incorrect Password."
                        res.render("user/login", { errors: errors })
                    }
                });
            }
        })
    }

    // static forgotPassword = async (req, res) => {
    //     let email = req.body.email
    //     let errors = {}
    //     let user = await userModel.findOne({ email: email })
    //     if (user) {
    //         try {
    //             let userId = user._id
    //             const secret = user._id + process.env.JWT_SECRET_KEY
    //             const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '10m' })

    //             let emailString = `http://localhost:8000/api/user/changepassword/${userId}/${token}`
    //             // sendMail -- 
    //             let info = await transporter.sendMail({
    //                 from: process.env.EMAIL_FROM,
    //                 to: user.email,
    //                 subject: "Password Reset link",
    //                 html: `<a href=${emailString}>Click Here</a> to Reset Your Password})`
    //             })
    //             console.log(emailString)
    //         } catch (error) {
    //             console.log(error);
    //             errors.emailError = "Unable to send reset link."
    //         }
    //     } else {
    //         errors.emailError = "Can't find an account with this Email. Try Again.."
    //         res.render("forgotpassword", { errors: errors })
    //     }
    // }

    // static changePassword = async (req, res) => {
    //     let token = req.params.token
    //     let id = req.params.id
    //     let errors = {}

    //     let { password, confirmPassword } = req.body
    //     console.log(req.body);
    //     if (password) {
    //         if (!(password.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/))) {
    //             errors['passwordError'] = "Please enter a valid password.."
    //         }
    //     }
    //     else {
    //         errors['passwordError'] = "Please enter a password.."
    //     }

    //     if (confirmPassword) {
    //         if (!(password === confirmPassword)) {
    //             errors['confirmPasswordError'] = "Your password and confirm password doesn't match."
    //         }
    //     } else {
    //         errors['confirmPasswordError'] = "Please enter a confirm password.."
    //     }

    //     const user = await userModel.findById(id)
    //     const new_secret = user._id + process.env.JWT_SECRET_KEY
    //     let errorsLen = Object.keys(errors).length
    //     console.log(errorsLen)
    //     if (errorsLen > 0) {
    //         res.render("resetpassword", { errors: errors, userId: id, userToken: token })
    //     } else {
    //         try {
    //             jwt.verify(token, new_secret)
    //             const salt = await bcrypt.genSalt(10)
    //             const newHashPassword = await bcrypt.hash(password, salt)
    //             await userModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
    //             res.redirect("/user/login")
    //         } catch (error) {
    //             res.render("resetpassword", { errors: errors, userId: id, userToken: token })

    //             console.log("Try Again.");
    //         }
    //     }
    // }

    // static verifyUser = async (req, res) => {
    //     let userOtp = req.body.otp
    //     let errors = {}
    //     if (userOtp) {
    //         if (userOtp == otp) {
    //             res.redirect("/user/login")
    //             let userId = req.session.userId
    //             await userModel.findByIdAndUpdate(userId, { $set: { verify: true } })
    //         } else {
    //             errors.otpError = "Wrong OTP. Please try Again."
    //             res.render("emailVerification", { errors: errors })
    //         }
    //     }
    // }
    static logoutUser = (req, res) => {
        res.clearCookie('JWT')
        res.redirect("/user")
    }
}
export default userController
