//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDb server');

    /*db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5a83bb161ed63f0fddf19f92')
    }, {

        $set: {
            completed: true
        }

    },{
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });*/


    db.collection('Users').findOneAndUpdate({
        name: 'lahiru'
    }, {

        $set: {
            name: "Lahiru"
        },
        $inc: {
            age: 10
        }

    },{
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });



    db.close();

});