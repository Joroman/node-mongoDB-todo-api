const {MongoClient, ObjectID} = require ('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp',(err, db)=>{
    if(err)
    return console.log("Unable to connect MongoDb server", err);

    /**db.collection('Todos').deleteMany({text : "Walk the dog"})
    .then((result)=>{
        console.log(`Delete result : ${result}`);
        console.log('Deleted documents ', result.deletedCount);
    });*/

  /**  db.collection('Todos').findOneAndDelete({text:"Walk the dog"}).then((doc)=>{
        console.log(`The deleted documents`, docs);
    });*/

    db.collection('Users').findOneAndDelete({_id:new ObjectID("59db85341939210ff64ee18b")})
        .then((result)=>{
            console.log("Find One and DeleteOne", result);
        });
    
    db.collection('Users').deleteMany({name:"Andrew"}).then((count)=>{
        console.log("Number documents delete", count.result.n);
    });

    db.close();
});