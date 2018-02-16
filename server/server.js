const {ObjectID} = require('mongodb');

var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
    //console.log(req.body);
});


app.get('/todos', (req,res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});


app.get('/todos/:id', (req,res) => {
    var id = req.params.id;

    //valid id using isValid
    if (!ObjectID.isValid(id)) {
        //console.log('ID not valid');
        return res.status(404).send();
    }


    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});

    }, (e) => {
        res.status(400).send();
    });


});


app.listen(3000, () => {
   console.log('Started on port 3000');
});


// var newTodo = new Todo({
//     text: 'Cook dinner'
// });
//
// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
// }, (e) => {
//     console.log('Unable to save todo')
// });


// var otherTodo = new Todo({
//     text: 'Something'
// });


// var otherTodo = new Todo({
//     text: 'Feed the cat',
//     completed: true,
//     completedAt: 123
// });

// otherTodo.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Unable to save', e);
// })


//
// var user = new User({
//     email: 'asd@gmail.com'
// });
//
// user.save().then((doc) => {
//    console.log('User saved', doc);
// }, (e) => {
//     console.log('Unable to save user', e)
// });

module.exports = {app};