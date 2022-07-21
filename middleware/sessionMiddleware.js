import session from "express-session"
import MongoStore from "connect-mongodb-session";
let monStore = MongoStore(session);

const store = new monStore({
    uri: "mongodb://localhost:27017/NikBlog",
    collection: "mysessions",
  });
  
export default session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  });
  