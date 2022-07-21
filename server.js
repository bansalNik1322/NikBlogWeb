/**
 * Importing Modules -- 
 */
import dotenv from "dotenv"
import express from "express"
import http from "http"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongodb-session";
let monStore = MongoStore(session);
let app = express()

const store = new monStore({
    uri: "mongodb://localhost:27017/NikBlog",
    collection: "mysessions",
});

app.use(session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    store: store,
}))


dotenv.config()
/**
 * Setting Up app and predefined middleware -- 
 */
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("public"));

/**
 * Importing Routes -- 
 */

import userRoute from "./routes/userRoutes.js"
import adminRoute from "./routes/adminRoute.js"
app.use("/admin", adminRoute)
app.use("/user", userRoute)

/**
 * Connecting DB --
 */
import connectDB from "./config/connection.js"
connectDB()


/**
 * Setting Up Server
 */

var server = http.createServer(app);
let port = 3000
server.listen(port, ()=>{
    console.log("Server running");
});