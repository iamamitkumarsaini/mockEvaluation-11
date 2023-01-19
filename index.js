const express = require("express");
const { connection } = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const { userRoutes } = require("./Routes/User.routes");
const { authentication } = require("./Middleware/Authenticate.middleware");


const app = express();
app.use(cors({
    origin:"*"
}))


app.use(express.json());

app.get("/", (req,res) => {
    res.send({"Message":"welcome to Homepage"})
})


app.use("/", userRoutes);

// app.use(authentication)




app.listen(process.env.port, async() => {
    try {
        await connection;
        console.log("Connection to DB Success");
    } 
    
    catch (err) {
        console.log("Connection to DB Failed");
        console.log(err);
    }

    console.log(`running on port ${process.env.port}`)
});