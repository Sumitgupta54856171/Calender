const  mongoose = require("mongoose")


const mongoconnect= async()=>{
    mongoose
    .connect('mongodb://localhost:27017/my_database')
    .then(()=>console.log("mongodb connected"))
    .catch((error)=>{console.log(`mongodb server created the error this is error ${error}`)})
}


module.exports={mongoconnect}
