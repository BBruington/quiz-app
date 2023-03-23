

export default function TestCard() {

  return (
    <>
      <div className="flex w-10/12">
        <div className="flex items-center justify-center w-full bg-gray-200 h-80 my-20">This is where the question would be asked?</div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-around my-5">
        <button className="h-28 w-4/6 md:w-5/12 bg-gray-200">answer 1</button>
        <button className="h-28 w-4/6 md:w-5/12 bg-gray-200 my-10">answer 2</button>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-around my-5">
        <button className="h-28 w-4/6 md:w-5/12 bg-gray-200">answer 1</button>
        <button className="h-28 w-4/6 md:w-5/12 bg-gray-200 my-10">answer 2</button>
      </div>
    </>
  )
}