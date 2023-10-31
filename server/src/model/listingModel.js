const mongoose=require("mongoose")

const listingSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    regularPrice:{
        type:Number,
        required:true
    },
    discountPrice:{
        type:Number,
        required:true
    },
    bedrooms:{
        type:String,
        required:true
    },
    bathrooms:{
        type:String,
        required:false
    },
    furnished:{
        type:Boolean,
        required:true
    },
    parking:{
        type:Boolean,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    offer:{
        type:String,
        required:true
    },
    imageUrls:{
        type:Array,
        required:true
    },
    userRef:{
        type:String,
        required:true
    }



},{timestamps:true})

const listingModel=mongoose.model("listing",listingSchema)

module.exports=listingModel