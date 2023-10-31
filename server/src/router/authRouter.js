const express=require("express");
const { signUp, signIn, google,getUser, signOut, userUpdate, deleteUser } = require("../controller/authController");
const isLoggedIn = require("../middleware/isLoggedIn");

const authRouter=express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.get("/sign-out",isLoggedIn,signOut)
authRouter.post("/google",google)
authRouter.delete("/delete/:id",isLoggedIn,deleteUser)  
authRouter.post("/update/:id",isLoggedIn,userUpdate)
authRouter.get("/user/:id",getUser)

module.exports=authRouter;