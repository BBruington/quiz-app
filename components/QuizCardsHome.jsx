import Link from "next/link"

export default function QuizCardsHome() {


  return (
    <div className="grid grid-cols-3 gap-4 mt-10">
      <Link className="flex text-center bg-gray-200 hover:bg-gray-300 p-5 rounded-sm" href={"questions/react"}>React Interview Questions</Link>
    </div>
  )
}