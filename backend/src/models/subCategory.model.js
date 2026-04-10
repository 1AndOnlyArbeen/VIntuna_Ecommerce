import mongoose from "mongoose";


const subCategorySchema = new mongoose.Schema({
    type:{
        name: String, 
        default : ""
    },
    image :{
        type : String , 
        default: ""

    },
    categoory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"

    },
},{timestamps:true})

 export const SubCategory = mongoose.model("SubCategory", subCategorySchema)