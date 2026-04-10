import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String
        
    },
    image:{
        type:Array,
        default:[]

    },
    category:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"

}],
subcategory:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"subcategory"

}],
unit:{
    type: String,
    default:""
},
stock:{
    type: Number,
    default:null

},
price:{
    type: Number,
    default:Null
},
disocunt:{
    type: Number,
    default:null

},

description :{
    type: String,
    default: ""
},
more_details:{
    type: Object,
    default:{}

},
publish:{
    type: Boolean,
    default:true
},



},{timestamps:true})


export const Product = mongoose.model("Product", productSchema)