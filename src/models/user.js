const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('password can not contain password word')
            }
        }
    },
    email: {
        type: String,
        trim: true,
        unique:true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email')
            }
        }

    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('age must be grater then 0')
            }
        }
    },
    tokens: [{
        token:{
            type:String,
            required:true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps:true
})
// user task relationship
userSchema.virtual('task',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})
// for hiding password and token data
userSchema.methods.toJSON =  function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
// for jwt token genration
userSchema.methods.getjwttoken = async function (){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// for log in
userSchema.statics.findByCredentials = async (email, password) => {
    // console.log('run thay chhee')
    const user = await User.findOne({ email:email })
    // console.log(email,password)
    if (!user) {
        throw new Error('Unable to find user')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('unable to login')
    }
    return user
}

// for deleting task when user is remooved
userSchema.pre('remove', async function (next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

// hash the password
userSchema.pre('save', async function (next) {
    const user = this
    // console.warn('before saving')
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
const User = mongoose.model('User', userSchema)
module.exports = User