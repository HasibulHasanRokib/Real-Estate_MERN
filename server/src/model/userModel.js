const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true   

    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://ditchthattextbook.com/wp-content/uploads/2019/04/np_profile_2367782_797979-1024x1024.png"
    }
},{timestamps:true})

const UserModel=mongoose.model("users",userSchema)

module.exports=UserModel