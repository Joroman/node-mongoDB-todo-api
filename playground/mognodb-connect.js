//const MongoClient = require('mongodb').MongoClient;

//using DE-STRUCTURING ES6 capabilities. This creates a varaible MongoClient 
//setting up equal to the MongoClient property of require('mongodb') which is exaclty what I did here
//this code is identicall that the code above 
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp',(err, db)=>{
    if (err) 
    throw err;
    console.log('Connected to MongoDB Server');
   /** db.collection('Todos').insert({
        text:'Something to do',
        completed:false
    },(err, result)=>{
        if(err)
            return console.log('Unable to insert todo',err);
        
            console.log(JSON.stringify(result.ops, undefined, 2));
    });*/

  /**  db.collection('Users').insertOne({
        name:'Isa Maraña',
        age: 34,
        location:'Hospitalet de Llobregat'
    },(err, result)=>{
        if(err)
        return console.log('Unable to insert the document to the collection',err);

        console.log(JSON.stringify(result.ops,undefined,2));
        console.log(result.ops[0]._id.getTimestamp());
    })*/
    db.close();
});