const jwt=require("jsonwebtoken");
const { JWT_KEY } = require("../config/secret");

const isLoggedIn=(req,res,next)=>{
    try{

    const token=req.cookies.accessToken;

    if(!token){
    return res.status(401).json({success:false,message:"Token not found"})
    }

    const decoded=jwt.verify(token,JWT_KEY)
     
    if(!decoded){
     return res.status(400).json({success:false,message:"Token not verified."})
    }
    
    req.userId=decoded.id;

    next()
    
    } catch (error) {
        console.log(error.message)
    }
}

module.exports=isLoggedIn;