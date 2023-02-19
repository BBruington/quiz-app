import Link from "next/link"

export default function QuizCardsHome() {


  return (
    <div className="grid grid-cols-3 gap-4">
      <Link className="flex items-center" href={"questions/react"}>React Interview Questions</Link>
    </div>
  )
}