import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import blogModel from "../models/blogModel.js"
import likeModel from "../models/likeModel.js"

class postRequestController {

    static blogPost = async (req, res) => {
        // Getting userName by the help of token -- 
        let token = req.cookies.JWT
        const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
        let user = await userModel.findById(userID).select('-password')
        let author = user.userName

        let { title, description, category } = req.body
        let errors = {}

        // if(title){
        //     if (!(title.match(/^[a-zA-Z ]{20,100}$/))) {
        //         errors['titleError'] = "Please enter a valid Title."
        //     }
        // }else{
        //     errors['titleError'] = "Please enter a Title."
        // }

        // if(description){
        //     if (description.length < 200) {
        //         errors['descriptionError'] = "Please write minimum 300 words."
        //     }
        // }else{
        //     errors['descriptionError'] = "Please write something."
        // }

        if (!category) {
            errors['categoryError'] = "Please select a category.."
        }
        let errorsLen = Object.keys(errors).length
        if (errorsLen > 0) {
            res.render("posts/createBlog", { errors: errors })
        } else {
            let newBlog = new blogModel({
                title, description, category, author, userID: userID
            })
            newBlog.save()
                .then(async (blog) => {
                    res.redirect("/user")
                    let user = await userModel.findByIdAndUpdate(userID, {
                        $push: {
                            blogs: blog._id
                        }
                    })
                })
        }
    }


    static likeBlogPost = async (req, res) => {
        let blogID = req.params.id
        let routePath = req.params.routePath
        let token = req.cookies.JWT
        const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
        let likeObj = {
            date: new Date(),
            userID: userID
        }

        let blog = await blogModel.findById(blogID)
        let likes = blog.likes
     
      try {
       for (let i = 0; i < likes.length; i++) {
        if (likes[i].userID == userID) {
            await blogModel.findByIdAndUpdate(blogID, {
                $pull: {
                    likes : likes[i]
                }
            })
            res.redirect(`/user/posts/${routePath}/get-full-blog/${blogID}`)
        } else {
            await blogModel.findByIdAndUpdate(blogID, {
                $push: {
                    likes : likeObj
                }
            })
            res.redirect(`/user/posts/${routePath}/get-full-blog/${blogID}`)
        }
        console.log(likes)
       }
      } catch (error) {
        
      }
    }


    static postComment = async (req, res)=>{
       let routePath = req.params.routePath
       let id = req.params.id
       let comment  = req.body.comment
       let token = req.cookies.JWT
       const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
       if(comment){
           let commentObj = {
            comment : comment,
            userID : userID,
            date : Date.now()
           }

           await blogModel.findByIdAndUpdate(id, {
            $push : {
                comments : commentObj
            }
           })
       }else{

       }
    }

}

export default postRequestController