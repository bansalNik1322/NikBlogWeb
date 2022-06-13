// importing npm modules --
import express from 'express'
import bodyParser from "body-parser"
import ejs from "ejs"



// importing user-created module
import router from "./routes/route.js"

// Initializing app 
const app = express()
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// Making Request

app.use("/", router)

// listening on port
app.listen(3000, ()=>{
    console.log(`Server is running at http://localhost:3000/`);
})