const mongoose = require("mongoose")
const { default: organization } = require("./organization")


const sessionSchema = mongoose.Schema({
    organization_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"organization"
    },
    tutor_name:{
        type:String,
        
    },
    student_name:{
        type:String,
        required:true
    },
    session_date:{
        type:Date,
        required:true
    },

    start_time:{
        type:Date,
        required:true
    },
    end_time:{
        type:Date,
        required:true
    },
    billing_status:{
        type:String,
        enum:['billed','unbilled'],
        default:'unbilled'
    },
    invoice_id:{
        type:mongoose.Schema.Types.ObjectId,
        re:"invoice",
        default :null
    },
    session_cost:{
        type:Number,
        required:true,
        default:0
    },
    recurrence_pattern:{
        type:String,
        required:false
    }
    ,
    subject:{
        type:String,
        
    }


},{timestamps:true})

module.exports = mongoose.model('session',sessionSchema)