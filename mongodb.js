// CRUD operation
const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectId
const { MongoClient, ObjectID } = require('mongodb')

 const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        console.warn('unable to connect')
    }
    const db = client.db(databaseName)

    db.collection('tasks').deleteOne({
        discription: 'this is task3'
    }).then((r) => {
        console.log(r)
    }).catch((e) => {
        console.log(e)
    })

    // db.collection('tasks').updateMany({
    //     status:false
    // },{
    //     $set:{
    //         status:true
    //     }
    // }).then((r)=>{
    //     console.log(r)
    // }).catch((e)=>{
    //     console.log(e)
    // })


    // db.collection('users').updateOne({
    //     _id: new ObjectID('620c93b684554eecf13a80ec')
    // },{
    //     $set:{
    //         name:'joker'
    //     }
    // }).then((r)=>{
    //     console.log(r)
    // }).catch((e)=>{
    //     console.log(e)
    // })



    // db.collection('users').findOne({ name: 'abhi' }, (error, user) => {
    //     if (error) {
    //         return console.log('unable')
    //     }
    //     console.log(user)
    // })
    // db.collection('tasks').find({ status: false }).toArray((error, task) => {
    //     console.log(task)
    // })


})
