require('dotenv').config(); //yo top ma rakhne      
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
require("./db/conn");
const Register = require("./models/register");

app.use(express.json());

const port = process.env.PORT || 8000

const static_path = path.join(__dirname,"../public");

const template_path = path.join(__dirname, "../templates/views");

const partial_path = path.join(__dirname, "./partials");

console.log(__dirname);

app.use(express.static(static_path));

// console.log(process.env.SECRET_KEY);

app.set("view engine", "hbs")
// app.set("views", template_path);
hbs.registerPartials(partial_path);

app.get("/", async(req, res)=>{
    res.render("index");
    // res.send("hello from the server");
});

//create a new users in our db
app.post("/register", async(req, res)=>{
    try{
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(password === confirmpassword){
        //     const registerEmployee = new Register(req.body);
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
                
            });

            console.log("success part"+ registerEmployee);

            const token = await registerEmployee.generateAuthToken();
            console.log("The token part"+ token);

            const registered = await registerEmployee.save();
            res.status(201).send(registered);
        }
        else{
            res.send("password are not matching");
        }
    }
    catch(err){
        res.status(400).send(err);
        console.log("the error part page");
    }
});

//login check
app.post("/login", async(req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email: email});
        //useremail.password -> it shows password of useremail

        const isMatch = await bcrypt.compare(password, useremail.password);   //password mean what user enter
        //useremail.password mean data bhitra ko password   isMatch return true or false

        const token = await useremail.generateAuthToken();
        //register ma registeremployee cha login ma chaina so line 76 ma hami saga tesko sato useremail cha so
        console.log("the token part" + token);

        console.log(isMatch);

        if(isMatch){
            res.status(200).send("Login success!!");
        }
        else{
            res.status(400).send("credentials does not match");
        }


        // if(useremail.password === password){
        //     res.status(201).send("login success");
        // }
        // else{
        //     res.send("password does not match");
        // }

        // res.send(useremail.password);
        // console.log(useremail);
    }
    catch(err){
        res.status(400).send("Invalid email");
    }
});


// const bcrypt = require("bcryptjs");

// const securePassword = async(password)=>{
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);
// }

// securePassword("bikash");

app.listen(port, ()=>{
    console.log(`app is runnin in port ${port}`);
});