import Link from "next/link";

export default function Questions() {

  return (
    <div className="grid grid-cols-3 gap-4 mt-10 ml-10">
      <Link className="flex text-center bg-gray-200 hover:bg-gray-300 p-5 rounded-sm" href={"Questions/react"}>React Interview Questions</Link>
    </div>
  )
}