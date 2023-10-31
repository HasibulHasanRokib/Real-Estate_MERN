import { Link } from "react-router-dom"
import {FaLocationDot} from "react-icons/fa6"

const Card = ({data}) => {

  return (
    <>
    <Link to={`/listing/${data._id}`}>
     <div className=" rounded-md shadow-md hover:shadow-lg transition-shadow overflow-hidden bg-white w-full md:w-[20rem]">
        <img className="w-full h-[320px] sm:h-[220px] object-cover hover:scale-105 transition-scale duration-300" src={data.imageUrls[0]} alt="" />
         <article className="p-3">
          <p className="font-semibold text-lg truncate">{data.name}</p>
          <div className="flex items-center gap-1">
          <FaLocationDot className="text-green-700"/>
          <p className=" opacity-90 text-xs my-1">{data.address}</p>
          </div>
          <p className="text-xs my-2 line-clamp-2">{data.description}</p>
          <p className=" opacity-80 font-semibold mt-5">${data.regularPrice} / month</p>
          <ul className="flex gap-3 my-1">
            <li className="text-xs font-bold">{data.bedrooms} Beds</li>
            <li className="text-xs font-bold">{data.bathrooms} Baths</li>
          </ul>
         </article>
        </div> 
        </Link>
    </>
  )
}

export default Card
