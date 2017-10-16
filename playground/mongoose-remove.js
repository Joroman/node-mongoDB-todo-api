const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//var id = "59e481c54e0358bd84cc6ba2";


/**
  Todo.remove({_id:id}).then((result)=>{
        console.log(result);
    });
 */   

 /**
  Todo.findOneAndRemove({id})
    .then((result)=>console.log(result));
  */   

    Todo.findByIdAndRemove("59e481c54e0358bd84cc6ba2")
    .then((result)=>console.log(`findByIDAndRemove ${result}`));


