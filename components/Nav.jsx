import Link from "next/link";

export default function Nav() {

  const checkUrl = (url) => {
    if (window.location.href === url) window.location.reload(false);
  }
  return (
    <div className="flex space-x-5">
      <Link onClick={() => checkUrl("http://localhost:3000")} href="/" className="ml-5 pt-3 text-lg font-bold hover:underline cursor-pointer">Home</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/login")} href="/login" className="ml-5 pt-3 text-lg font-bold hover:underline cursor-pointer">Sign In</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/questions")} href="/questions" className="pt-3 text-lg hover:underline  font-bold cursor-pointer">Study Topics</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/builder")} href="/builder" className="pt-3 text-lg hover:underline  font-bold cursor-pointer">Create / Edit Topic</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/quiz")} href="/quiz" className="pt-3 text-lg hover:underline  font-bold cursor-pointer">Take a Quiz</Link>
    </div>
  )
}