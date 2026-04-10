import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    address_line:{
        type: String,
        default:""

    },
    city:{
        type:String, 
        default:""
    },
    state:{
        type: String,
        default: ""
    },
    pincode:{
        type: String
        
    },
    country:{
        type:String,

    },
    mobile:{
        type: String,
        default:null
    },
    status: {
        type: Boolean, 
        default: true
    }

},{timestamps:true})

export const Address = mongoose.model ( "Address", addressSchema)