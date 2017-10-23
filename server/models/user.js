const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require ('lodash');
const bcrypt = require('bcryptjs');

/**
 * validate:{
            validator:(value)=>{
                return validator.isEmail(value);
            },
            message:'{VALUE} is not a valid emial'
        }
 */
var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not a valid email'
        }
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            require:true
        },
        token:{
            type:String,
            require:true
        }
    }]
});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
}

//Instance method CREATE INTO METHODS OBJECT generateAuthToken
//Instance method get called with the individual document
UserSchema.methods.generateAuthToken = function(){
    //Individual document user
    var user=this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(), access},'abc123').toString();

    user.tokens.push({access, token});

    return user.save().then(()=>{
        return token
    });
}

UserSchema.methods.removeToken= function(token){
    var user= this;

    return user.update({
        $pull:{
            tokens:{
                token:token
            }
        }
    });
}


//DEFINE MODEL METHODS INTO STATICS OBJECT
UserSchema.statics.findByToken = function(token){
    //model to call model methods
    var User = this;
    var decoded="";

    try{
       decoded= jwt.verify(token,'abc123');
    } catch(e){
        //shortcut
        return Promise.reject();
    }

    //retunr the promise 
    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}


//Define model method to find the user by credentials
UserSchema.statics.findByCredentials = function(email, password){
    var User= this;
    
    return User.findOne({email:email}).then((user)=>{
        if(!user) return Promise.reject();

        return new Promise((resolve, reject)=>{
            bcrypt.compare(password, user.password,(err, result)=>{
                if(err) reject();
                
                if(result){
                    resolve (user);
                }else{
                    reject();
                }
            });
        }); 
    });
}



//this run code before given event and the event.
//I specify on the first argument of the pre function in my case 'save' so before save the doc to the DB
//use regular function because I have to acces to the this binding
UserSchema.pre('save',function (next){
    var user=this;
    
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err, hash)=>{
                //I have to overwrite the user.password plaint text to the hashed password.
                user.password=hash;
                next();
            });
        });
    }else{
        next();
    }
});

var User = mongoose.model('User',UserSchema);
module.exports ={User};