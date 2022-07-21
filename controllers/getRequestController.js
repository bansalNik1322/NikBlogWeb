import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import blogModel from "../models/blogModel.js"
class getRequestController {
  static getHomePage = async (req, res) => {
    // Getting All Blogs -- 
    const token = req.cookies.JWT
    if (token) {
      // verifiy token -- 
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)

      let user = await userModel.findById(userID).select('-password')
      if (user) {
        res.render("index/index", { loginOrLogout: "logout" })
      } else {
        console.log("Invalid token");
        res.render("index/index", { loginOrLogout: "login" })
      }

    } else {
      res.render("index/index", { loginOrLogout: "login" })
    }

  }

  static getUserBlog = async (req, res) => {
    const token = req.cookies.JWT
    if (token) {
      // verifiy token -- 
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
      let user = await userModel.findById(userID).select('-password')


      let blogID = user.blogs
      let blogs = []
      for (var i = 0; i < blogID.length; i++) {
        let blog = await blogModel.findById(blogID[i])
        blogs.push(blog)
      }

      console.log(blogs)
      if (user) {
        res.render("posts/userBlog", { loginOrLogout: "logout", blogs: blogs })
      } else {
        console.log("Invalid token");
        res.render("posts/userBlog", { loginOrLogout: "login", blogs: blogs })
      }

    } else {
      res.render("posts/userBlog", { loginOrLogout: "login", blogs: blogs })
    }
  }

  static getCategories = async (req, res) => {

    let blogs = await blogModel.find({ postedOrNot: true })

    const token = req.cookies.JWT
    if (token) {
      // verifiy token -- 
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
      let user = await userModel.findById(userID).select('-password')
      if (user) {
        res.render("posts/categories", { loginOrLogout: "logout", blogs: blogs })
      } else {
        console.log("Invalid token");
        res.render("posts/categories", { loginOrLogout: "login", blogs: blogs })
      }

    } else {
      res.render("posts/categories", { loginOrLogout: "login", blogs: blogs })
    }
  }

  static getCreateBlog = async (req, res) => {
    res.render("posts/createBlog", { errors: {} })
  }


  static getFUllBlog = async (req, res) => {
    const token = req.cookies.JWT
    let id = req.params.id
    let routePath = req.params.routePath
    let blog = await blogModel.findOne({ _id: id })


    if (token) {
      // verifiy token -- 
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
      let user = await userModel.findById(userID).select('-password')
      if (user) {

        res.render("posts/get-full-blog", { loginOrLogout: "logout", blog: blog, routePath: routePath, })

    
      } else {
        console.log("Invalid token");
        res.render("posts/get-full-blog", { loginOrLogout: "login", blog: blog, routePath: routePath })
      }

    } 
  }

  static getComments = async (req, res) => {
    const token = req.cookies.JWT
    if (token) {
      // verifiy token -- 
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
      let user = await userModel.findById(userID).select('-password')
      if (user) {
        res.render("posts/comment", { loginOrLogout: "logout" })
      } else {
        console.log("Invalid token");
        res.render("posts/comment", { loginOrLogout: "login" })
      }

    } else {
      res.render("posts/comment", { loginOrLogout: "login" })
    }
  }

  // Admin Routes -- 


}


export default getRequestController