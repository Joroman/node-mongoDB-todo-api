//Mongoose configuration code
var mongoose = require('mongoose');

//mLabMongoDB
//MONGODB_URI: mongodb://heroku_c7jdt7mw:fu8a834ikrd8f1vjdk8jrvt4o1@ds121345.mlab.com:21345/heroku_c7jdt7mw

mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

mongoose.Promise = global.Promise;

module.exports = {mongoose};