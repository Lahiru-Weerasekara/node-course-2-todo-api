const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


/*Todo.remove({}).then((result) => {
    console.log(result);
});*/

Todo.findOneAndRemove({
    _id: '5a865ef1302687221ce4065a'
}).then((todo) => {
    console.log('Todo', todo);
});


Todo.findByIdAndRemove('5a865ef1302687221ce4065a').then((todo) => {
    console.log(todo);
});


/*var uId = '5a84029eabed43c62381945e';

if (!ObjectID.isValid(uId)) {
    console.log('ID not valid');
}

User.findById(uId).then((user) => {
    if (!user) {
        return console.log('Unable to find user');
    }

    console.log(JSON.stringify(user, undefined, 2));

}, (e) => {
    console.log(e);
});*/
