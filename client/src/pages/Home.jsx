import { useEffect, useState } from "react"
import {Link} from "react-router-dom"
import {Swiper,SwiperSlide} from "swiper/react"
import SwiperCore from "swiper"
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import Card from "./Card"


const Home = () => {

  const [offerListing,setOfferListing]=useState([])
  const [rentListing,setRentListing]=useState([])
  const [sellListing,setSellListing]=useState([])
  SwiperCore.use([Navigation])

  useEffect(()=>{
  const fetchingOffer=async()=>{
    try {
      const res=await fetch(`http://localhost:3000/api/listing/get-listing?offer=true&limit=4`)
      const data=await res.json()
      setOfferListing(data.listings)
      console.log(data.listings)
      fetchingRent()
    } catch (error) {
      console.log(error.message)
    }
  }
  fetchingOffer();

  const fetchingRent=async()=>{
    try {
      const res=await fetch(`http://localhost:3000/api/listing/get-listing?type=rent&limit=4`)
      const data=await res.json()
      setRentListing(data.listings)
      fetchingSell()
    } catch (error) {
      console.log(error.message)
    }
  }
  const fetchingSell=async()=>{
    try {
      const res=await fetch(`http://localhost:3000/api/listing/get-listing?type=sell&limit=4`)
      const data=await res.json()
      setSellListing(data.listings)
    } catch (error) {
      console.log(error.message)
    }
  }
  },[])



  return (
    <>
    <section className="flex flex-col gap-6 px-4 lg:px-24 py-24">
      <h1 className="text-3xl lg:text-6xl font-bold text-slate-700">Find your next <samp className="text-slate-500">perfect</samp><br/>
     place with ease</h1>
     <p className="text-sm  text-slate-500 max-w-md">Real Estate will help you find your home fast, easy and comfortable.
      Our expert support are always available.</p>

      <Link className="text-blue-800 font-bold hover:underline text-xs sm:text-sm" to={'/search'}><p>Let's start now...</p></Link>
    </section>
     
     <section>
     <Swiper navigation>
     {offerListing && offerListing.length >0 && offerListing.map((listing)=>{
      return<SwiperSlide key={listing._id}>
           <div className="h-[500px] w-full" style={{background:`url(${listing.imageUrls[0]}) center no-repeat`,backgroundSize:"cover"}}></div>
         </SwiperSlide>
     
     })}
     </Swiper>
     </section>

     <section>
      <div className=" max-w-5xl mx-auto p-3 my-10">
        <article className="my-3">
          <h2 className="font-semibold text-lg">Recent offers</h2>
          <Link className="text-blue-800 text-sm hover:underline" to={'/search?type=all&offer=true'}>Show more offers</Link>
        </article>
       <div className=" flex gap-4 flex-wrap">
       {offerListing && offerListing.map((listing,index)=>{
          return <Card key={index} data={listing}/>
        })}
       </div>
      </div>
      <div className=" max-w-5xl mx-auto p-3 my-10 ">
        <article className="my-3">
          <h2 className="font-semibold text-lg">Recent Rent</h2>
          <Link className="text-blue-800 text-sm hover:underline" to={'/search?type=rent'}>Show more offers</Link>
        </article>
       <div className=" flex gap-4 flex-wrap">
       {rentListing && rentListing.map((listing,index)=>{
          return <Card key={index} data={listing}/>
        })}
       </div>
      </div>
      <div className=" max-w-5xl mx-auto p-3 my-10 ">
        <article className="my-3">
          <h2 className="font-semibold text-lg">Recent Sell</h2>
          <Link className="text-blue-800 text-sm hover:underline" to={'/search?type=sell'}>Show more offers</Link>
        </article>
       <div className=" flex gap-4 flex-wrap">
       {sellListing && sellListing.map((listing,index)=>{
          return <Card key={index} data={listing}/>
        })}
       </div>
      </div>
     </section>
    </>
  )}

export default Home
