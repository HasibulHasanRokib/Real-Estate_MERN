
const Spinner = () => {
  return (
    <main className="flex h-screen justify-center items-center gap-3">
    <div className=" animate-ping w-6 h-6 rounded-full bg-gray-300"></div>
    <div className=" animate-ping w-6 h-6  rounded-full bg-sky-500"></div>
    <div className=" animate-ping w-6 h-6  rounded-full bg-slate-700"></div>
   </main>
  )
}

export default Spinner
