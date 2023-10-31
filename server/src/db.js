const mongoose=require("mongoose")
const { DB_URL } = require("./config/secret")

const connectedDB=async()=>{
    try {
        await mongoose.connect(DB_URL)
        console.log("DB is connected successfully.")
    } catch (error) {
        console.log("DB is connected failed.",error.message)
    }
}
 
module.exports=connectedDB;