import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { GET_USER_SUCCESSFUL } from "../service/userSlice"
import { useNavigate } from "react-router-dom"

const Oauth = () => {

     const navigate=useNavigate()
    const dispatch=useDispatch()

    const handleGoogleAuth=async()=>{
        try {
            const provider=new GoogleAuthProvider()
            const auth=getAuth(app)
            const result=await signInWithPopup(auth,provider)
            // console.log(result)
            
            const res=await fetch("http://localhost:3000/api/auth/google",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(
                    {
                        name:result.user.displayName,
                        email:result.user.email,
                        photo:result.user.photoURL
                    }),
                    credentials:"include"
            })
            const data=await res.json()
            // console.log(data.validUser)
             dispatch(GET_USER_SUCCESSFUL(data.validUser))
             navigate("/")
            
        } catch (error) {
            console.log("Account not connected",error.message)
        }
    }
  return (
    <div>
    <button type='button' onClick={handleGoogleAuth} className='font-semibold bg-red-700 text-white uppercase p-3 w-full rounded-xl'>Continue with google</button>
    </div>
  )
}

export default Oauth
