mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    postTitle: {
        typeof: String,
        require: true
    },
    postDescription: {
        typeof: String,
        require: true
    },
    Date: {
        typeof: Date,
        default: new Date().toLocaleString()
    },
    auther: {
        typeof: String,
        require: true
    },
    catagory: {
        typeof: String,
        require: true
    },
    img: {
        data: Buffer,
        contentType: String
    }
});

//Image is a model which has a schema imageSchema

const Post = new mongoose.model('Post', postSchema);
export default Post