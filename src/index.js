const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')
require('./db/mongoose')
const app = express()



const port = process.env.PORT
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


// load server
app.listen(port, () => {
    console.log('server is on')
})
const jwt = require('jsonwebtoken')
// const myjwt = async () => {
//   const token = jwt.sign({_id:'abc123'},'thisismyjwttoken',{ expiresIn:'7 days'})
//   console.warn(token)
//   const data = jwt.verify(token,'thisismyjwttoken')
//   console.warn(data)
// }
// myjwt()


// const myfunc = async () => {
//     const pass = 'abhishah123'
//     const crpass = await bcrypt.hash(pass, 8)
//     console.log(pass)
//     console.warn(crpass)
// }
// myfunc()
// const main = async () =>{
//     // const task = await Task.findById('62132047e7b91b720ff1fb78')
//     // await task.populate('owner')
//     // console.log(task.owner.name)
//     const user = await User.findById('6213200fe7b91b720ff1fb6c')
//     // await user.populate('task')
//     // console.log(user.task)
// }
// main()
//  express middleware
// app.use((req,res,next)=>{
//     if(req.method === 'GET'){
//         res.send('this is from middleware to authentication')
//     }else{
//         next()
//     }
    
// })
// app.use((req,res,next)=>{
//     res.status(503).send('site is in maintenance')
// })