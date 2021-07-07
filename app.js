//jshint esversion:6
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const { urlencoded } = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()

app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true})

userSchema = new mongoose.Schema({
    email : String,
    password : String
})

//level 2:
const secret = "Thisisthelittlesecret."; //can be any string
userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]}); //this should be done before making the mongoose model. Now this encrypts both email and password but we just need to encrypt the password so.. 


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
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
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

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},function(err,foundUser){ //level 1
        if(err)
            console.log(err)
        else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets")
                }
            }
        }
    })
})

app.listen(3000,function(){
    console.log("Server started successfully at port 3000")
})