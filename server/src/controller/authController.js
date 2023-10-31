const UserModel = require("../model/userModel");
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const { JWT_KEY } = require("../config/secret");
const salt = bcrypt.genSaltSync(10);


const signUp=async(req,res,next)=>{
try {
 
    const {username,email,password}=req.body;
    
    if(!username|| !email ||!password){
        return res.status(400).json({success:false,message:"Fill all field."})
    }
     
    const userExist=await UserModel.findOne({email:email})

    if(userExist){
        return res.status(400).json({success:false,message:"User already registered."})
    }

    const newUser=await UserModel({username,email,password:bcrypt.hashSync(password, salt)})

    await newUser.save()
    
   return res.status(201).json({success:true,message:"User registration successful",payload:newUser})

} catch (error) {
   next(error)
   console.log(error.message)
}
}

const signIn=async(req,res,next)=>{

    try {
        const {email,password}=req.body;

        if(!email||!password){
            return res.status(400).json({success:false,message:"Fill the filed."})
        }

        const validUser=await UserModel.findOne({email:email})

        if(!validUser){
            return res.status(400).json({success:false,message:"User not register. Please signup first."})
        }
        
        const passOk=bcrypt.compareSync(password,validUser.password)

        if(passOk){

          const token=jwt.sign({id:validUser._id},JWT_KEY)
          res.cookie("accessToken",token).json({success:true,message:"Logged in successful.",validUser})  

        }else{
            return res.status(400).json({success:false,message:"Password wrong."})
        }

    } catch (error) {
        next(error)
        console.log(error.message)
    }
}

const google=async(req,res,next)=>{
try {
    const validUser=await UserModel.findOne({email:req.body.email})

    if(validUser){
        const token=jwt.sign({id:validUser._id},JWT_KEY)
        res.cookie("accessToken",token).json({success:true,message:"Login successful.",validUser})
    }else{
        const generatePassword=Math.random().toString(36).slice(-8);
        const hashedPassword=bcrypt.hashSync(generatePassword,salt)

        const newUser=await UserModel({
            username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-8),
            email:req.body.email,
            password:hashedPassword,
            avatar:req.body.photo
        })
        await newUser.save()
        const token=jwt.sign({id:newUser._id},JWT_KEY)
        res.cookie("accessToken",token).json("User login successful.",newUser)
    }


} catch (error) {
    console.log("Google auth error",error.message)
    next(error)
}
}

const signOut=(req,res,next)=>{
res.clearCookie("accessToken").status(200).json({success:true,message:"Sign out successful."})        
}

const userUpdate=async(req,res,next)=>{
    try {

    const id=req.params.id;

    if(id!==req.userId){
        return res.status(400).json({success:false,message:"Invalid ID."})
    }

    if(req.body.password){
        req.body.password=bcrypt.hashSync(req.body.password,salt)
    }
    
    const updatedUser=await UserModel.findByIdAndUpdate({_id:id},{
        $set:{
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        avatar:req.body.avatar
        }
    },{new:true})
  

    res.status(202).json({success:true,message:"User update successfully.",updatedUser})
        
    } catch (error) {
        console.log(error.message)
    }
}

const deleteUser=async(req,res,next)=>{
try {
    const id=req.params.id;
    
    if(id!==req.userId){
        return res.status(404).json({success:false,message:"Invalid Id."})
    }
    
    await UserModel.findByIdAndDelete({_id:id})
    res.clearCookie("accessToken")
    res.status(200).json({success:true,message:"Account has been deleted."})

} catch (error) {
    console.log(error.message)
}
}

const getUser=async(req,res,next)=>{
try {
   
const user=await UserModel.findById(req.params.id)

if(!user){
    return res.status(400).json({success:false,message:"User not find"})
}

res.status(200).json({success:true,message:"Got user",user})

} catch (error) {
    console.log(error.message)
    next(error.message)
}
}

module.exports={getUser,signUp,signIn,google,signOut,userUpdate,deleteUser}