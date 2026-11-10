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
// userSchema.post('save', function (doc){// after save i want this function to 
                                          // be called and it will take the document that was just saved as an argument, this function 
                                          // will fire when ever we save a new user to the database and it will log the document that 
                                          // was just saved to the console, this is useful for debugging purposes and to see what data 
                                          // is being saved to the database.
//     console.log('new user was created & saved', doc);
//     next();
// });

// //fire a function before doc saved to db
// userSchema.pre('save', function (){
//     console.log('user about to be creadted & saved', this);// this belongs to the local instance of the user before we save it to the database,
                                                    //  this is useful for debugging purposes and to see what data is being saved to the database.
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

userSchema.statics.login= async function(email, password){
    const user= await this.findOne({ email});
if(user){
    const auth = await bcrypt.compare(password, user.password);// when we call the login method from the User model, we pass in the
    // email and password that the user entered in the login form. The method then searches for a user with that email in the database 
    // using the findOne method. If a user is found, it compares the password entered by the user with the hashed password stored in the 
    // database using bcrypt's compare method. If the passwords match, it returns the user object. If not, it throws an error indicating 
    // that the password is incorrect.
    if(auth){
        return user;
    }
    throw Error('incorrect password');
}
throw Error('incorrect email');
}
// create a model based on schema
const User=mongoose.model('user',userSchema);//user over here is the name of the collection in the database
module.exports=User;