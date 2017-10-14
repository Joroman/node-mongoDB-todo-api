const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo}     = require('./../server/models/todo');
const {User}     = require('./../server/models/user');

var id = "59df450883c1d80fd254e260";


 if(!ObjectID.isValid(id)){
    console.log("The objectID is not valid ");

}

User.findById(id).then((user)=>{
    if(!user) return console.log("User id not found");
    console.log(user);
}).catch((err)=>console.log('Error', err.message));

/** 
    Todo.findById(id).then((todo)=>{
        if(!todo) return console.log('ID not find');
        console.log("Todo Id",todo);
    }).catch((err)=>console.log("Error: ", err.message));

*/


/** 
Todo.find({
    _id:id
}).then((todos)=>{
    console.log("Todos", todos);
});

Todo.findOne({
    _id:id
}).then((todo)=>{
    console.log('Todo',todo);
});
*/

