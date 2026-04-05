const mongoose = require("mongoose");

const organizationSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true

    },


},{timestamps:true})

module.exports= mongoose.model("organizations",organizationSchema)