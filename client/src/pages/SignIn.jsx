import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { GET_REQUEST_FAILED, GET_USER_REQUEST, GET_USER_SUCCESSFUL } from "../service/userSlice"
import Oauth from "../components/Oauth"

  const SignIn = () => {

  const [email,setEmail]=useState()
  const [password,setPassword]=useState()


  const navigate=useNavigate()

  const{isLoading,error}=useSelector((state)=>state.user)

  const dispatch=useDispatch()

  const handleSignUp=async(e)=>{
  e.preventDefault()
  try {
    dispatch(GET_USER_REQUEST())
    const res=await fetch("http://localhost:3000/api/auth/signin",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password}),
      credentials:"include"      
    })
    const data=await res.json();
    if(data.success===true){
      dispatch(GET_USER_SUCCESSFUL(data.validUser))
      navigate("/")
    }else{
     dispatch(GET_REQUEST_FAILED(data.message))

    }
  } catch (error) {
    console.log(error.message)
  }
  }

    return (
      <>
      <div className="max-w-xl mx-auto p-3">

      <h1 className="text-3xl font-semibold text-center my-7 text-slate-700">Sign In</h1>

      <form className="flex flex-col gap-6 mt-10 " onSubmit={handleSignUp}>
      <input onChange={(e)=>setEmail(e.target.value)} value={email} className="border-2 p-3 rounded-lg w-full outline-slate-300" type="email" id="email"  placeholder="Email" />
      <input onChange={(e)=>setPassword(e.target.value)} value={password} className="border-2 p-3 rounded-lg w-full outline-slate-300" type="password" id="password" placeholder="Password" />
      <button disabled={isLoading} className="bg-slate-600 disabled:bg-slate-500 text-white p-3 uppercase rounded-lg w-full font-semibold hover:bg-slate-500 ease-linear" type="submit">{isLoading?"Loading...":"sign in"}</button>
      <Oauth/>
      </form>

      <div className="flex gap-2 mt-5">
      <p className="text-slate-600">Don&apos;t have an account ?</p>
      <Link className="text-blue-500 font-semibold" to={"/sign-up"}>Sign Up</Link>
      </div>
       <h4 className="font-semibold text-red-500 text-center mt-10">{error && <p>{error}</p>}</h4>
      </div>
      </>
    )
  }
  
  export default SignIn
  