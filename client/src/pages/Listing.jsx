import { useEffect, useState } from "react"
import {useParams} from "react-router-dom"
import Spinner from "../components/Spinner"
import {FaLocationDot,FaBed,FaBath,FaSquareParking,FaChair} from "react-icons/fa6"

import {Swiper,SwiperSlide} from "swiper/react"
import SwiperCore from "swiper"
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import {useSelector} from 'react-redux'
import Contact from "../components/Contact"

const Listing = () => {

const[loading,setLoading]=useState(false)
const[error,setError]=useState(false)
const [listingData,setListingData]=useState()
const [show,setShow]=useState(false)
const {id}=useParams()
SwiperCore.use([Navigation])



const getData=async()=>{
  try {
    setLoading(true)
    const res=await fetch(`http://localhost:3000/api/listing/get/${id}`)
    const data=await res.json()
    // console.log(data.getListing)

    if(data.success===false){
      setLoading(false)
      setError(data.message)
    }

    setListingData(data.getListing)
    setError(false)
    setLoading(false)

  } catch (error) {
    setError(error.message)
    setLoading(false)
  }
}

useEffect(()=>{
getData();
},[])

const{currentUser}=useSelector((state)=>state.user)
// console.log(currentUser)


  return (
    <main>
     {loading && <Spinner/>}
     {error && <p>Something went wrong.</p>}
     {listingData && (
      <>
       <Swiper navigation>
        {listingData.imageUrls.map((url)=>{
          return <SwiperSlide key={url}>
            <div className="h-[450px] max-md:h-[300px] shadow-md" style={{background:`url(${url}) center no-repeat`,backgroundSize:"cover"}}></div>
          </SwiperSlide>
        })}
       </Swiper>
      </>
     )}

    {listingData && 
    <section className="p-3 max-w-3xl mx-auto mt-6">
    <h1 className="text-3xl max-md:text-xl font-semibold capitalize">{listingData.name}-$ {listingData.regularPrice} / month</h1>
    
    <div className="flex items-center my-5 text-sm font-semibold text-slate-500">
    <FaLocationDot className="text-green-700 inline-block"/>
    <p className="mx-3">{listingData.address}</p>
    </div>

    <div className="flex gap-4">
      <p className="my-3 px-16 bg-red-700 text-center font-semibold text-white rounded-md py-1">
        {listingData.type==="rent"?"For Rent":"For Sell"}
      </p>
      {listingData && listingData.offer ==='false' ?null:<p className="my-3 bg-green-700 text-center font-semibold text-white rounded-md py-1 px-16">${listingData.regularPrice-listingData.discountPrice} Discount</p>}
    </div>
    
    <p className="font-semibold">Description- <span className="font-normal text-slate-500 text-sm">{listingData.description}</span></p>
    
    <div className="py-3 flex gap-6 items-center max-md:flex-wrap">
      <p className=" flex items-center gap-2 font-bold text-green-900">
        <FaBed/>
        {listingData.bedrooms} Beds
      </p>
      <p className=" flex items-center gap-2 font-bold text-green-900">
        <FaBath/>
        {listingData.bathrooms} Baths
      </p>
      <p className=" flex items-center gap-2 font-bold text-green-900">
        <FaSquareParking/>
        {listingData.parking===true?"Parking spot":"No Parking"}
      </p>
      <p className=" flex items-center gap-2 font-bold text-green-900">
        <FaChair/>
        {listingData.furnished===true?"Furnished":"Not Furnished"}
      </p>
      
    </div>
    {currentUser && listingData.userRef !== currentUser._id && !show && (
      <button onClick={()=>setShow(true)} className="bg-gray-700 text-center text-white w-full rounded-md p-2 uppercase hover:opacity-90 font-semibold my-5">Contact landlord</button>
    )}

    {show && <Contact listing={listingData}/>}
    </section>
    }
    </main>
  )
}

export default Listing
