const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp',(err, db)=>{
    if(err)
    return console.log('Unable to connect to MongoDB Server',err);

    /**db.collection('Todos').find({}).toArray((err, docs)=>{
        if (err)
        return console.log('Unable to find the documents', err);
        console.log(docs);
    });**/

  /**  db.collection('Todos').find({
        _id:new ObjectID("59dc9b605668f83c6abcd17f")
    }).toArray().then((docs)=>{
        console.log('TODOS');
        console.log(JSON.stringify(docs,undefined,2));
       
    },(err)=>{
        console.log('Unable to fetch Todos', err);
    });

    db.collection('Todos').find().count().then(
        (count)=>{
            console.log(count);
            db.close();
        },(err)=>{
            console.log(err);
        } 
    );
    */
    db.collection('Users').find({name:"Andrew"}).toArray().then(
        (docs)=>{
            console.log(`Andrew name ${JSON.stringify(docs,undefined,2 )}`);
        },
        (err)=>{
            console.log('Unable to find Andrew docs', err);
        });
        db.collection('Users').find({name:"Andrew"}).count().then(
            (count)=>{
                console.log(count);
                db.close();
            },(err)=>{
                console.log(err);
            }
        );
   
});