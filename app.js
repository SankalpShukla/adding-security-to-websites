//jshint esversion:6
require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const { urlencoded } = require("body-parser")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt") //level 4
const saltRounds = 10 //level 4

const app = express()

app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true})

userSchema = new mongoose.Schema({
    email : String,
    password : String
})

const User = new mongoose.model("User",userSchema)

app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",function(req,res){
    
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const newUser = new User({
            email:req.body.username,
            password: hash //level 4
        })
        newUser.save(function(err){
            if(!err){
                res.render("secrets")
            }
            else{
                console.log(err)
            }
        })
    })
})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},function(err,foundUser){ //level 1
        if(err)
            console.log(err)
        else{
            if(foundUser){
                bcrypt.compare(password,foundUser.password,function(err,result){
                    if(result){
                        res.render("secrets")
                    }
                })
            }//level 4

        }
    })
})

app.listen(3000,function(){
    console.log("Server started successfully at port 3000")
})