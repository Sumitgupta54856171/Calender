const mongoose = require('mongoose')



const adjustment_schema = mongoose.Schema({
organization_id :{
    type:mongoose.Schema.Types.ObjectId,
    ref:'organization',
    required:true,
    
},
credit_amount:{
  type:Number,
  required:true,
  default:0
},
session_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"session",
    required:true
},
invoic_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'invoice',
    required:true
},
type:{
    type:String,
    enum: ['debit','credit'],
    required:true
},
description:{
    type:String,
    required:true,
    trim:true
}

},{timestamps:true})

module.exports= mongoose.model('adjustment',adjustment_schema)