var {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp',(err, db)=>{
    if(err)
    return console.log("Unable to connect MongoDb server", err);

  /**  db.collection('Todos')
        .findOneAndUpdate({
            _id: new ObjectID("59dde083f89f63b6bb5ee7da")
        },{
            $set:{
                completed:true
            }
        },{
            returnOriginal: false
        }).then((doc)=>{
                console.log(doc);
        });*/
    db.collection('Users').findOneAndUpdate({
        _id:new ObjectID("59db7e18a8aab80f11e83cd9")
    },{
        $set:{name:"Josep Roman"}
    },{returnNewDocument:true}
    ).then((doc)=>{
        console.log("Update Doc:", doc);
    });

    db.collection('Users').findOneAndUpdate({
        _id:new ObjectID("59db7e18a8aab80f11e83cd9")
    },{
        $inc:{
            age:1
        }
    }).then((doc)=>{
        console.log("DOC incre: ", doc);
    });
    db.close();
});