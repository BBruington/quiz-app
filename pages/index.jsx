import QuizCard from "@/components/QuizCard";
import questions from "@/topics/reactInterview.json"

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <QuizCard topic={questions}/>
    </div>
  )
}