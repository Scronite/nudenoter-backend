const mongoose = require('mongoose')
const mongoURI = "mongodb+srv://Ishan:ishan@cluster0.k3kxz.mongodb.net/nudebook?authSource=admin&replicaSet=atlas-1231tw-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Mongo Is alive");
    })
}

module.exports = connectToMongo