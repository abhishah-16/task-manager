const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect(process.env.MONGODB_CONNECT, {
    useNewUrlParser: true,
    // useCreateIndex: true
})


// const mytask = new Task({
//     discription: 'to complete course javascript',
//     status: true
// })
// mytask.save().then(()=>{
//     console.log(mytask)
// }).catch((e)=>{
//     console.log(e)
// })



// const me = new User({
//     name:' jems  ',
//     lastname:' sha ',
//     password:'jemssha123',
//     email:'jemssha@GMAIL.COM',
//     age:21
// })
// me.save().then(()=>{
//     console.log(me)
// }).catch((e)=>{
//     console.log(e)
// })