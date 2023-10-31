import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import Oauth from "../components/Oauth"

  const SignUp = () => {

  const [formData,setFormData]=useState()
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState()

  const navigate=useNavigate()

  const handleChange=(e)=>{
   setFormData({...formData,[e.target.id]:e.target.value})
  }

  const handleSignIn=async(e)=>{
    e.preventDefault()
 
    try {
      setLoading(true)
      const res=await fetch("http://localhost:3000/api/auth/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(formData)
      })

      const data=await res.json()

      if(data.success===true){
        setLoading(false)
        setError(null)
        navigate("/sign-in")     
      }else{
        setLoading(false)
        setError (data.message)
      }

    } catch (error) {
     console.log(error.message)
    }
  }



    return (
      <div className="max-w-xl mx-auto p-3">

       <h1 className="text-3xl font-semibold text-center my-7 text-slate-700">Sign Up</h1>
      
      <form className="flex flex-col gap-6 mt-10 " onSubmit={handleSignIn}>
        <input onChange={handleChange} className="p-3 rounded-lg w-full outline-slate-300 border-2" type="text" id="username"  placeholder="Username" />
        <input onChange={handleChange} className="p-3 rounded-lg w-full outline-slate-300 border-2" type="email" id="email"  placeholder="Email" />
        <input onChange={handleChange} className="p-3 rounded-lg w-full outline-slate-300 border-2" type="password" id="password" placeholder="Password" />
        <button disabled={loading} className="font-semibold bg-slate-600 disabled:bg-slate-500 text-white p-3 uppercase rounded-lg w-full hover:bg-slate-500 ease-linear" type="submit">{loading?"Loading...":"sign up"}</button>
        <Oauth/>
      </form>
      
      <div className="flex gap-2 mt-5">
      <p className="text-slate-600">Have an account ?</p>
      <Link className="text-blue-500 font-semibold" to={"/sign-in"}>Sign In</Link>
      </div>
      <h4 className="font-semibold text-red-500 text-center mt-10">{error && <p>{error}</p>}</h4>
      </div>
    )
  }
  
  export default SignUp
  