const mongoose=require('mongoose');
const { isEmail }=require('validator');
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'Please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail, 'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true, 'Please enter a password'],
        minlength:[6, 'Password must be at least 6 characters long']
    },
});
// create a model based on schema
const User=mongoose.model('user',userSchema);//user over here is the name of the collection in the database
module.exports=User;