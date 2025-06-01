const mongoose = require('mongoose')
const connectDataBase = () =>{
    mongoose.connect("mongodb://127.0.0.1:27017/CyberAzen")
    .then(()=>{
        console.log("MongoDB connected")
    })
}

module.exports = connectDataBase