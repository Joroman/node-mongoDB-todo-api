
//here make all process environment configuration
var env = process.env.NODE_ENV || 'development';
//manage local configuration system
if(env==='development' || env==='test'){
    var config= require('./config.json');
    var envConfig = config[env];
    //creating env local variable for JWT_SECRET
    Object.keys(envConfig).forEach((key)=>{
        process.env[key]=envConfig[key];
    });
}

