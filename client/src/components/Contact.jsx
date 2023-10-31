import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Contact = ({listing}) => {

 const [landlord,setLandLoad]=useState()
 const [message,setMessage]=useState()

 const getUser=async()=>{
    try {
      const res=await fetch(`http://localhost:3000/api/auth/user/${listing.userRef}`)  
      const data=await res.json()
      setLandLoad(data.user)
    } catch (error) {
        console.log(error.message)
    }
 }

 useEffect(()=>{
 getUser()
 },[listing.userRef])


  return (
    <>
    {landlord &&(
        <>
        <h4 className="capitalize my-5">
        #Contact <span className="font-bold mx-1">{landlord.username}</span> for 
        <span className="font-bold mx-1">{listing.name}</span>
        </h4>

        <textarea onChange={(e)=>setMessage(e.target.value)} value={message} className="px-3 py-2 w-full rounded-lg outline-slate-300" name="message" id="message" rows="3" placeholder="Enter your message..." required></textarea>
        <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className="block bg-slate-700 text-white uppercase w-full text-center p-3 rounded-lg mt-3 ">message</Link>
        </>
    )}
    </>
  )
}

export default Contact
