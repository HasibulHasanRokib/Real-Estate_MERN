import { useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase"
import { useSelector } from "react-redux"
import {  useNavigate } from "react-router-dom"



const CreateListing = () => {

const [files, setFiles] = useState([])

const [error,setError]=useState(false);

const [imageUploadError, setImageUploadError] = useState(false);

const [upLoading, setUpLoading] = useState(false);
const [loading, setLoading] = useState(false);

const {currentUser}=useSelector((state)=>state.user)

const navigate=useNavigate()

const [formData, setFormData] = useState({
name:"",
description:"",
address:"",
type:"rent",
imageUrls: [],
parking:false,
furnished:false,
offer:false,
bedrooms:1,
bathrooms:1,
regularPrice:50,
discountPrice:50});


 const handleImageUpload = () => {

        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            const promises = [];
            setUpLoading(true)
            for (let i = 0; i < files.length; i++) {
                promises.push(storage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
                setImageUploadError(false)
                setUpLoading(false)

            }).catch((err) => {
                setImageUploadError("Image upload failed ( 2 mb max per image)")
                console.log(err.message)
                setLoading(false)
            })

        } else {
            setImageUploadError("You can upload only 6 images per listing.")
            setUpLoading(false)
        }
    }

 const storage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`uploading ${progress}%`)
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL))
                }
            )
        })
    }

 const handleDelete = (index) => {
        setFormData({ ...formData, imageUrls: formData.imageUrls.filter((url, i) => i !== index) })
    }

 const handleChange=(e)=>{
   
    if(e.target.id==="sell" || e.target.id==="rent"){
        setFormData({
            ...formData,
            type:e.target.id
        })
    }
    
    if(e.target.id==="parking" || e.target.id==="furnished" || e.target.id==="offer"){
     setFormData({...formData,[e.target.id]:e.target.checked})
    }

    if(e.target.type==="number" || e.target.type==="text" || e.target.type==="textarea"){
     setFormData({...formData,[e.target.id]:e.target.value})
    }
   }

 const handleSubmit=async(e)=>{
    e.preventDefault()
    try {

      setLoading(true)

      if(formData.imageUrls.length < 1){
      return setError("You must be upload at least one image."),
      setLoading(false)

      }

      if(formData.regularPrice < formData.discountPrice){
        return setError("Discount price must be lower than regular price.")
      }
      const res=await fetch("http://localhost:3000/api/listing/create-listing",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...formData,userRef:currentUser._id}),
        credentials:"include"
      })

      const data= await res.json()
      console.log(data)
      if(data.success===true){
        setLoading(false)
        navigate(`/listing/${data.newListing._id}`)
      }else{
        setLoading(false)
        setError(data.message)
      }

    } catch (error) {
        console.log(error.message)
        setError("Create listing failed.")
        setLoading(false)

    }
 }

    return (
        <>
        <section className="p-3 max-w-4xl mx-auto">
        <h1 className="font-semibold text-3xl text-center my-4 uppercase">Create Listing</h1>

        <form onSubmit={handleSubmit} className="flex gap-4 mt-9 max-md:flex-col">
        <div>
        <div className="flex flex-col gap-4">
        <input onChange={handleChange} value={formData.name} className="p-3 rounded-xl outline-slate-100 w-full" type="text" placeholder="Name" id="name" required />
        <textarea onChange={handleChange} value={formData.description} className="p-3 rounded-xl outline-slate-100 w-full" type="text" placeholder="Description" id="description" required />
        <input onChange={handleChange} value={formData.address} className="p-3 rounded-xl outline-slate-100 w-full" type="text" placeholder="Address" id="address" required />
        </div>
        <div className="my-8 flex gap-3 flex-wrap">
        <div className="flex ">
            <input className="w-5" type="checkbox" onChange={handleChange} checked={formData.type==="sell"} name="sell" id="sell" />
            <span className="mx-2 text-gray-600">Sell</span>
        </div>
        <div className="flex ">
            <input className="w-5" type="checkbox" onChange={handleChange} checked={formData.type==="rent"} name="rent" id="rent" />
            <span className="mx-2 text-gray-600">Rent</span>
        </div>
        <div className="flex ">
            <input className="w-5" type="checkbox" onChange={handleChange} checked={formData.parking} name="parking" id="parking" />
            <span className="mx-2 text-gray-600">Parking spot</span>
        </div>
        <div className="flex ">
            <input className="w-5" type="checkbox" onChange={handleChange} checked={formData.furnished} name="furnished" id="furnished" />
            <span className="mx-2 text-gray-600">Furnished</span>
        </div>
        <div className="flex ">
            <input className="w-5" type="checkbox" onChange={handleChange} checked={formData.offer} name="offer" id="offer" />
            <span className="mx-2 text-gray-600">Offer</span>
        </div>
        </div>
        <div className="flex gap-6 flex-wrap">
        <div className="flex items-center">
            <input className=" outline-gray-300 p-3 rounded-lg mx-1 w-[4rem]" type="number" onChange={handleChange} value={formData.bedrooms} max={10} min={1} id="bedrooms" required />
            <p>Beds</p>
        </div>
         <div className="flex items-center">
            <input className="mx-1 outline-gray-300 p-3 rounded-lg w-[4rem]" type="number" onChange={handleChange} value={formData.bathrooms} max={10} min={1} id="bathrooms" required />
            <p>Baths</p>
        </div>
        <div className="flex items-center">
            <input className="mx-1 outline-gray-300 p-3 rounded-lg w-[8rem]" onChange={handleChange} value={formData.regularPrice} id="regularPrice" type="number" max={100000} min={50} required />
            <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($/Month)</span>
            </div>
        </div>
        {formData.offer && (
            <div className="flex items-center">
            <input className="mx-1 outline-gray-300 p-3 rounded-lg w-[8rem]" onChange={handleChange} value={formData.discountPrice} id="discountPrice" type="number" max={100000} min={0} required />
            <div className="flex flex-col items-center">
                 <p>Discount price</p>
                <span className="text-xs">($/Month)</span>
            </div>
        </div>
        )}
        </div>

        </div>
        <div className="max-md:my-8 p-3">
        <p className="font-semibold">Images:
            <span className="text-gray-500 font-normal"> The first image will be the cover (max 6)</span>
        </p>
        <div className="flex justify-between gap-3 items-center my-5">
            <input onChange={(e) => setFiles(e.target.files)} className="border p-3 rounded-xl" type="file" accept="image/*" multiple />
            <button disabled={upLoading} type="button" onClick={handleImageUpload} className="p-3 uppercase border-2 border-green-500 rounded-lg hover:bg-green-500 hover:text-white disabled:bg-white disabled:text-gray-800">{upLoading ? "Loading..." : "upload"}</button>
        </div>
        {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => {
                return <div key={url} className="border rounded-md px-4 flex justify-between items-center my-2">
                    <img className="w-20 h-20 object-contain rounded-lg" src={url} alt="listing image" />
                    <button type="button" onClick={() => handleDelete(index)} className="uppercase text-red-600 ">Delete</button>
                </div>
            })
        }
        <h5 className="text-red-700 text-xs text-center my-5">{imageUploadError && imageUploadError}</h5>
        <button disabled={loading || upLoading} type="submit" className="p-3 bg-gray-700 text-white rounded-lg w-full uppercase hover:opacity-90 disabled:opacity-75">{loading ? "Creating...":"Create Listing"}</button>
        {error &&  <h5 className="my-3 text-red-500 text-sm text-center">{error}</h5>}
        </div>
        </form>

        </section>
        </>
    )
}

export default CreateListing
