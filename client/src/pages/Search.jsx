import { useEffect, useState } from "react"
import{useNavigate} from "react-router-dom"
import Card from "./Card"


const Search = () => {

const [filterData,setFilterData]=useState({
  searchTerm:"",
  offer:false,
  parking:false,
  type:'all',
  furnished:false
  
})

const [getData,setGetData]=useState()

const navigate=useNavigate()

const handleChange=(e)=>{

if(e.target.id==='all' || e.target.id==="rent" || e.target.id==="sell"){
setFilterData({...filterData,type:e.target.id})
}

if(e.target.id==='offer' || e.target.id==='parking' || e.target.id === "furnished"){
setFilterData({...filterData,[e.target.id]:e.target.checked})
}

if(e.target.id==="searchTerm"){
  setFilterData({...filterData,searchTerm:e.target.value})
}


}

const handleSubmit=(e)=>{
e.preventDefault()

const urlParams= new URLSearchParams()

urlParams.set('searchTerm',filterData.searchTerm)
urlParams.set('type',filterData.type)
urlParams.set('offer',filterData.offer)
urlParams.set('parking',filterData.parking)
urlParams.set('furnished',filterData.furnished)

const searchQuery=urlParams.toString()
navigate(`/search?${searchQuery}`)

}

useEffect(()=>{

  const urlParams=new URLSearchParams(location.search)
  const searchFormUrl=urlParams.get("searchTerm")
  const typeFormUrl=urlParams.get("type")
  const offerFormUrl=urlParams.get("offer")
  const parkingFormUrl=urlParams.get("parking")
  const furnishedFormUrl=urlParams.get("furnished")

if(
  searchFormUrl ||
  typeFormUrl ||
  offerFormUrl ||
  parkingFormUrl ||
  furnishedFormUrl 
){
  setFilterData({
    searchTerm:searchFormUrl || "",
    type:typeFormUrl || 'all',
    offer:offerFormUrl==="true"?true:false,
    parking:parkingFormUrl==="true"?true:false,
    furnished:furnishedFormUrl==="true"?true:false,

  })
}

const fetchData=async()=>{
const searchQuery=urlParams.toString()
  const res=await fetch(`http://localhost:3000/api/listing/get-listing?${searchQuery}`)
  const data=await res.json()
  setGetData(data.listings)
}

fetchData()

},[location.search])



  return (
    <main className="flex max-md:flex-col justify-between items-start">
      <form onSubmit={handleSubmit} className=" p-5 lg:min-w-max  md:h-screen">
        <div className="flex items-center">
          <label className="font-semibold">Search:</label>
          <input onChange={handleChange} value={filterData.searchTerm} className="p-3 rounded-lg mx-2 outline-slate-300 w-full" type="text" placeholder="Search..." id="searchTerm" />
        </div>
        <div className="flex gap-4 my-10 flex-wrap">
        <p className="font-semibold">Type:</p>
        <div className="flex">
          <input onChange={handleChange} checked={filterData.type==='all'} className="w-5 mx-1" type="checkbox" name="all" id="all" />
          <span>Sell & Rent</span>
        </div>
        <div className="flex">
          <input onChange={handleChange} checked={filterData.type==='rent'}  className="w-5 mx-1" type="checkbox" name="rent" id="rent" />
          <span>Rent</span>
        </div>
        <div className="flex">
          <input onChange={handleChange} checked={filterData.type==='sell'}  className="w-5 mx-1" type="checkbox" name="sell" id="sell" />
          <span>Sell</span>
        </div>
        <div className="flex">
          <input onChange={handleChange} checked={filterData.offer} className="w-5 mx-1" type="checkbox" name="offer" id="offer" />
          <span>Offer</span>
        </div>
        </div>
          
        <div className="flex gap-2 my-10">
        <p className="font-semibold">Amenities:</p>
        <div className="flex">
          <input onChange={handleChange} checked={filterData.furnished} className="w-5 mx-1" type="checkbox" name="furnished" id="furnished" />
          <span>Furnished</span>
        </div>
        <div className="flex">
          <input onChange={handleChange} checked={filterData.parking} className="w-5 mx-1" type="checkbox" name="parking" id="parking" />
          <span>Parking</span>
        </div>
        </div>

        <button type="submit" className="p-3 uppercase font-semibold bg-slate-800 text-white rounded-md my-4 w-full hover:opacity-90 disabled:bg-slate-700">search</button>
      </form>
      
      <section className="p-3 mt-5 flex-1 max-md:border-t-2 lg:border-l-2">
        <h2 className="text-3xl border-b-2 p-2 font-semibold">Listing results:</h2>
        {getData && getData.length === 0 && <h5 className=" text-center font-semibold text-xl my-20">No listing found!</h5>}

       <div className="p-3 grid grid-cols-1  lg:grid-cols-3 gap-4">
       {getData && getData.map((data,index)=>{
        return <Card key={index} data={data}/>
       })}
        </div>
      </section>
    </main>
  )
}

export default Search
