const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require ('lodash');

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

var User = mongoose.model('User',UserSchema);



module.exports ={User};