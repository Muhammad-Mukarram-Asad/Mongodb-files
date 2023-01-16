const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const serverSecret = require('./database file ');

const userSchema = new Schema({
    email: {
        type: stringify,
        required : true
    },

    password: {
        type: stringify,
        required : true
    },
    fullName: {
        type: stringify,
        tokens : [string]
    }
})

userSchema.pre('save', function (next)
{
    const user = this;
    if(user.isModified('password'))
    {
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(user.password, salt)

        user.password = hash;
    }
    next();
})

userSchema.methods.comparePassword =  function(password)
{
    const user = this;
    return bcryptjs.compareSync(password, user.password)
}

userSchema.methods.generateToken = async function()
{
    const user = this;
    const {id} = user;
    const token = jwt.sign({ id}, serverSecret);
    user.tokens.push(token);
    await user.save();
    return token;
}

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
