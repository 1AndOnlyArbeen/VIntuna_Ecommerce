import mongoose from "mongoose"


const  cartProductSchema = new mongoose.Schema ({

    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prodcut"
    },

    quantity:{
        type: Number,
        default: 1
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }


},{timestamps:true})

export const CartProduct = mongoose.model("CartProduct", cartProductSchema)