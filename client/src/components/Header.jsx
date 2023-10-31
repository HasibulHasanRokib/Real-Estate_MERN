import {Link,useNavigate} from "react-router-dom"
import {FaSearch} from "react-icons/fa"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"


const Header = () => {

  const navigate=useNavigate()

  const [searchValue,setSearchValue]=useState("")

  const{currentUser}=useSelector((state)=>state.user)

  const handleSearch=async(e)=>{
    e.preventDefault()
    const urlParams=new URLSearchParams(location.search)
    urlParams.set("searchTerm",searchValue)
    const searchQuery=urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(()=>{
  const urlParams=new URLSearchParams(location.search)
  const searchTermUrl=urlParams.get("searchTerm")
  if(searchTermUrl){
    setSearchValue(searchTermUrl)
  }
  },[location.search])
  
  return (
    <>
     <header className=" p-3 shadow-md bg-white">
        <div className="flex justify-between items-center max-w-6xl mx-auto">

            <Link to={"/"}>
            <h1 className="font-bold text-xl">
                <span className="text-slate-500">Real</span>
                <span className="text-slate-800">Estate</span>
            </h1>
            </Link>

            <form className="flex bg-slate-100 items-center px-4 py-2 rounded-md" onSubmit={handleSearch}>
              <input onChange={(e)=>setSearchValue(e.target.value)} value={searchValue}  className=" bg-transparent outline-none p-1 md:w-64 w-20" type="text" placeholder="Search..." />
              <button type="submit">
              <FaSearch className="text-slate-700"/>
              </button>
            </form>

            <ul className="flex gap-8 font-bold ">
              <li className="text-slate-600 hover:text-black max-md:hidden"><Link  to={"/"}>Home</Link></li>
              <li className="text-slate-600 hover:text-black max-md:hidden"><Link  to={"/about"}>About</Link></li>

              {currentUser?(
                <li>
                <Link to={"/profile"}>
                <img title={currentUser.username} className="w-8 object-cover h-8 rounded-full" src={currentUser.avatar} alt="Profile" />
                </Link>
                </li>
              ):(
              <li><Link className="text-slate-600 hover:text-black" to={"/sign-in"}>Sign In</Link></li>
              )}
            </ul>

                    
        </div>
     </header>

    
    </>
  )
}

export default Header
