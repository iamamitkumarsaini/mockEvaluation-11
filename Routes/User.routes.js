const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Model/User.model");
require("dotenv").config();
const saltRounds = 4;

const userRoutes = express.Router();

userRoutes.post("/signup", async(req,res) => {
    const {email,password} = req.body;

    const userEmail = await UserModel.findOne({email});

   if(userEmail){
        res.send({"Message":"This Email is already registered"})
        
    }
    
    else{

        try {
            bcrypt.hash(password,saltRounds, async(err,myPassword) => {
                const user = new UserModel({email,password:myPassword})
                await user.save();
                res.send({"Message":"Signup Successfully"})
            })
        } 
        
        catch (err) {
            console.log(err);
            res.send({"Message":"Signup failed, try again"})
        }
    }
})

userRoutes.post("/login", async(req,res) => {

    try {
        const {email,password} = req.body;
        const byEmail = await UserModel.find({email});

        if(byEmail.length>0){
            const myPassword = byEmail[0].password;
            bcrypt.compare(password, myPassword, (err,result) => {
                if(result){
                    const token = jwt.sign({"message":"AmitSaini"},process.env.secret_key, {expiresIn:"1d"})
                    res.send({token, "Message":"Login Successful"});
                }
                else{
                    res.send({"Message":"Invalid Credentials"})
                    
                }
            })
        }

        else{
            res.send({"Message": "User not found"})
        }

    } 
    
    catch (err) {
        console.log(err)
        res.send({"Message":"Login failed, Please try again later"});
    }
})

module.exports = { userRoutes }
