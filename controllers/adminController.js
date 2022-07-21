import userModel from "../models/userModel.js"
import blogModel from "../models/blogModel.js"
class adminController {
  static adminDashboard = async (req, res) => {
    await res.render("admin/dashboard")
  }


  static adminUsers = async (req, res) => {
    let users = await userModel.find()

    await res.render("admin/users", { users: users })
  }



  static adminUserInfo = async (req, res) => {
    let userID = req.params.id
    let user = await userModel.findById(userID).select('-password')

    let blogID = user.blogs
    let blogs = []
    for (var i = 0; i < blogID.length; i++) {
      let blog = await blogModel.findById(blogID[i])
      blogs.push(blog)
    }
    await res.render("admin/user-info", { user: user, blogs: blogs })
  }


  static adminBlogs = async (req, res) => {
    let notPostedBlogs = await blogModel.find()
    let postedBlogs = await blogModel.find({ postedOrNot: true })

    await res.render("admin/blogs", { postedBlogs: postedBlogs, blogs: notPostedBlogs })
  }


  static adminBlogInfo = async (req, res) => {
    let id = req.params.id

    let blog = await blogModel.findById(id)

    await res.render("admin/blog-info", { blog: blog })
  }

  static adminBlogPost = async (req, res) => {
    let id = req.params.id
    let query = {'_id' : req.params.id}
    try {
      blogModel.findOneAndUpdate(query,  {postedOrNot: true}, function(err, doc) {
        if (err) return console.log(err);
        return console.log('Succesfully saved.');
    });


      res.redirect("/admin/blogs")

    } catch (error) {
      console.log(error)
    }
  }
}

export default adminController