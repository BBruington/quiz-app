
export default function CardBuilder() {

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col mt-10 w-4/6 items-center">
        <span className="text-sm my-2">Insert your question:</span>
        <textarea className="flex mb-4 p-2 w-full h-30vh border border-black" type="text"></textarea>
      </div>
      <div className="flex flex-col mt-10 w-4/6 items-center">
        <span className="text-sm my-2">Insert your answer:</span>
        <textarea className="flex mb-4 p-2 w-full h-96 border border-black" type="text"></textarea>
      </div>
    </div>
  )
}