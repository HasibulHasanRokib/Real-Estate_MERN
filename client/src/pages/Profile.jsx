import { useEffect } from "react"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { app } from "../firebase"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { UPDATE_USER_REQUEST,UPDATE_USER_SUCCESS,UPDATE_USER_FAILED, DELETE_USER_FAILED, DELETE_USER_REQUEST, DELETE_USER_SUCCESS, SIGNOUT_USER_FAILED, SIGNOUT_USER_REQUEST, SIGNOUT_USER_SUCCESS } from "../service/userSlice"
import { Link } from "react-router-dom"

 const Profile = () => {


  const fileRef=useRef(null)
  const [file,setFile]=useState(undefined)
  const [fileParse,setFileParse]=useState(0)
  const [fileErr,setFileErr]=useState(false)
  const [formData,setFormData]=useState({})
  const[message,setMessage]=useState(false)
  const [listingShow,setListingShow]=useState([])
  const [listingShowError,setListingShowError]=useState()
 

  const{currentUser,isLoading,error}=useSelector((state)=>state.user)
  const dispatch=useDispatch()

  // console.log(currentUser._id)

useEffect(()=>{
    if(file){
      handleFileUpload(file)
    }
  },[file])

const handleFileUpload=(file)=>{
    const storage=getStorage(app)
    const fileName=new Date().getTime()+file.name;
    const storageRef=ref(storage,fileName)
    const uploadTask=uploadBytesResumable(storageRef,file);

    uploadTask.on("state-changed",(snapshor)=>{
      const proccess=(snapshor.bytesTransferred/snapshor.totalBytes)*100;
      setFileParse(Math.round(proccess))
    },
    (error)=>{
    setFileErr(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURl)=>setFormData({...formData,avatar:downloadURl}))
    }
    )

  }

const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }


 const handleUpdateSubmit=async(e)=>{
  e.preventDefault()
  try {
    dispatch(UPDATE_USER_REQUEST())
   const res=await fetch(`http://localhost:3000/api/auth/update/${currentUser._id}`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    credentials:"include",
    body:JSON.stringify(formData)
   })
   const data=await res.json();
  //  console.log(data.updatedUser)
   if(data.success===false){
    dispatch(UPDATE_USER_FAILED(data.message))
   }else{
   dispatch(UPDATE_USER_SUCCESS(data.updatedUser))
   setMessage(true)
   }
  } catch (error) {
    dispatch(UPDATE_USER_FAILED(error.message))
  }
 }

 const handleDelete=async()=>{
  try {
    dispatch(DELETE_USER_REQUEST())
    const res=await fetch(`http://localhost:3000/api/auth/delete/${currentUser._id}`,{
      method:"DELETE",
      credentials:"include"
    })
    const data=await res.json()
    if(data.success===false){
      dispatch(DELETE_USER_FAILED(data.message))
    }
    dispatch(DELETE_USER_SUCCESS(data))
    
  } catch (error) {
    dispatch(DELETE_USER_FAILED(error.message))
  }
 }

 const HandleSignOut=async()=>{
  try {
   dispatch(SIGNOUT_USER_REQUEST())
   const res=await fetch(`http://localhost:3000/api/auth/sign-out`,{
   method:"GET",
   credentials:"include" 
  })
  const data=await res.json();
  if(data.success===false){
    dispatch(SIGNOUT_USER_FAILED(data.message))
  }
  dispatch(SIGNOUT_USER_SUCCESS(data))
  } catch (error) {
    dispatch(SIGNOUT_USER_FAILED(error.message))
  }
 }

 const handleListingShow=async()=>{
 try {
  const res=await fetch(`http://localhost:3000/api/listing/show-listing/${currentUser._id}`,{
    method:"GET",
    headers:{"Content-Type":"application/json"},
    credentials:"include"
  })
  const data=await res.json()
  console.log(data.listing)
  if(data.success===true){
    setListingShow(data.listing)
  }else{
  setListingShowError(data.message)
  }
 } catch (error) {
  console.log(error.message)
 }
 }

 const handleListingDelete=async(id)=>{
  const res=await fetch(`http://localhost:3000/api/listing/listing-delete/${id}`,{
    method:"DELETE",
    credentials:"include"
  })
  const data=await res.json();
  console.log(data)
  if(data.success===true){
    setListingShow((prev)=>prev.filter((list)=>list._id !== id))
  }else{
    console.log(data.message)
  }
 }

    return (
      <>
      <section className="max-w-xl mx-auto p-3">
        <h1 className="text-3xl font-semibold text-center my-3">Profile</h1>
        <form className="flex flex-col gap-4" onSubmit={handleUpdateSubmit}>
            <input type="file" onChange={(e)=>setFile(e.target.files[0])} ref={fileRef} hidden accept="image/*"/>
            <img onClick={()=>fileRef.current.click()} className="rounded-full w-24 h-24 object-cover self-center my-2 cursor-pointer shadow-md" src={formData.avatar||currentUser.avatar} alt="" />
            <p className="text-center text-sm">
              {fileErr?(<span className="text-red-700">Upload failed.</span>):fileParse>0 && fileParse<100 ?(<span>{`Uploading ${fileParse}%`}</span>):fileParse===100?(<span className="text-green-600">Upload successfully.</span>):''}
            </p>
            <input className="p-3 w-full border-2 rounded-xl outline-slate-300 capitalize" type="text" id="username" placeholder="Username"  defaultValue={currentUser.username} onChange={handleChange}/>
            <input disabled className="p-3 w-full border-2 rounded-xl outline-slate-300" type="email" id="email" placeholder="Email" defaultValue={currentUser.email}  onChange={handleChange}/>
            <input className="p-3 w-full border-2 rounded-xl outline-slate-300" type="password" id="password" placeholder="Password" />

            <button disabled={isLoading} className="uppercase font-semibold bg-green-700 p-3 w-full text-white rounded-xl hover:opacity-90">{isLoading ?"Loading...":"Update"}</button>
             <Link className="uppercase font-semibold bg-blue-700 p-3 rounded-xl text-center text-white text-semibold hover:opacity-90" to={"/create-listing"}>Create Listing</Link>
        </form>
        <div className="flex justify-between mt-5 px-3">
          <button onClick={handleDelete}  className="text-red-600">Delete account</button>
          <button onClick={HandleSignOut}  className="text-red-600">Sign out</button>
        </div>

        <div className="mt-5">
        {message && <h5 className="text-green-700 text-center">Update successfully</h5>}
        {error ? error :''}
        <button onClick={handleListingShow} className="font-semibold text-green-700 w-full mt-5">Show Listing</button>      
        </div>
      </section>

      <section className="max-w-xl mx-auto">       
      {listingShow && listingShow.length > 0 &&
      <div className="p-3">
      <h2 className="font-bold text-2xl uppercase my-7 text-center">Your listing</h2>
              
        {listingShow.map((list)=>{
        return <div className="flex justify-between items-center gap-4 border p-3 rounded-lg my-4" key={list._id}>
        <Link to={`/listing/${list._id}`}>
          <img className="h-16 w-18 object-contain rounded-lg" src={list.imageUrls[0]} alt="listing-cover-image" />
        </Link>
        <Link className="font-semibold flex-1 hover:underline" to={`/listing/${list._id}`}>
        <p>{list.name}</p>
        </Link>

        <div className="flex flex-col">
          <button type="button" onClick={()=>handleListingDelete(list._id)} className="font-semibold uppercase text-red-700 hover:opacity-70">Delete</button>
          <Link to={`/update-listing/${list._id}`}>
          <button className="font-semibold uppercase text-sky-700 hover:opacity-70">Edit</button>
          </Link>
        </div>
        </div>
        })
        }
      </div>      
      }
      </section>
 
      </>
    )
  }
  
  export default Profile
  