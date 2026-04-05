const  mongoose = require("mongoose")


const mongoconnect= async()=>{
    mongoose
    .connect(process.env.mongodb_url||"mongodb://51.81.22.42:27017")
    .then(()=>console.log("mongodb connected"))
    .catch((error)=>{console.log(`mongodb server created the error this is error ${error}`)})
}


module.exports={mongoconnect}