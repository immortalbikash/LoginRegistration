const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//generating tokens
employeeSchema.methods.generateAuthToken = async function(){  //not using fatarrow fun becaus we have 2 play with this
    try{
        console.log(this._id);
        const token = jwt.sign({_id: this._id.toString()}, "mynameisbikashkatwalnodejsdeveloper");
        this.tokens = this.tokens.concat({token: token}); //firs token mathi tokens bhita ko token ho
        await this.save();  //token save gareko
        return token;
    }
    catch(err){
        response.status(400).send(err);
        console.log(err);
    }
}


//converting password into hash
employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10)

    }
    next();
})

//collection creation
const Register = new mongoose.model("Register", employeeSchema);
module.exports = Register;