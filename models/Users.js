const mongoose=require('mongoose');
const { isEmail }=require('validator');
const bcrypt=require('bcrypt');
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

// //fire a function after doc saved to db
// userSchema.post('save', function (doc){
//     console.log('new user was created & saved', doc);
//     next();
// });

// //fire a function before doc saved to db
// userSchema.pre('save', function (){
//     console.log('user about to be creadted & saved', this);
//     next();
// });

// fire a function after doc saved to db
userSchema.post('save', function (doc) {
    console.log('new user was created & saved', doc);
});

// fire a function before doc saved to db
userSchema.pre('save', async function () {
    const salt= await bcrypt.genSalt();
    // console.log('user about to be created & saved', this);
    this.password=await bcrypt.hash(this.password, salt);
    // next();
});

// create a model based on schema
const User=mongoose.model('user',userSchema);//user over here is the name of the collection in the database
module.exports=User;