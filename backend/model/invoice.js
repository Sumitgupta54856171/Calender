const mongoose = require('mongoose')
const { default: organization } = require('./organization')

const invoiceSchema = mongoose.Schema({
    organization_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"organization",
        required:true
    },
    billingPeriod_start:{
        type:Date,
        required:true
    },
    billingPeriod_end:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:['draft','issued','paid'],
        default:'issue'
    },
    total_amount:{
        type:Number,
        required:true,
        default:0
    }
},{timestamps:true})

module.exports =  mongoose.model('invoice',invoiceSchema)