import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    orderId : {
        type: String, 
        required: [true, "provide orderId"],
        unique:  true
    },
    productId:{
        type: String, 
        default: ""
    },

    product_details:{
        _id: String, 
       name: String, 
       Image: Array
    },

    paymentId: {
        type:String, 
        default:""
    },
    payment_status:{
        type: String, 
        default: ""
    },
    delivery_address:{
        type: mongoose.Schema.Types. ObjectId,
        ref:"Address"
    },
    subTotalAmt:{
        type: Number,
        default:0

    },
    totalAmt:{
        type: Number,
        default: 0

    },
    invoice_redeipt: {
        type: String, 
        default: ""

    }



},{timestamps: true})



export const Order = mongoose.model("Order", orderSchema)