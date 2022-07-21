import mongoose  from "mongoose";

let connectDB  = async ()=>{
   await mongoose.connect('mongodb://localhost:27017/NikBlog')
    .then(() => { // if all is ok we will be here
       console.log("Connected to NikBlog DB.");
    })
    .catch(err => { // if error we will be here
        console.error('App starting error:', err.stack);
    });
}

export default connectDB