import Link from "next/link";
import {signOutUser} from "../utils/firebase";

export default function Nav() {

  const checkUrl = (url) => {
    if (window.location.href === url) window.location.reload(false);
  }
  return (
    <div className="flex md:space-x-5 space-x-3">
      <Link onClick={() => checkUrl("http://localhost:3000")} href="/" className="ml-5 nav">Home</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/login")} href="/login" className="nav">Sign In</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/questions")} href="/questions" className="nav">Study Topics</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/builder")} href="/builder" className="nav">Create/Edit Topic</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/quiz")} href="/quiz" className="nav">Take a Quiz</Link>
      <button onClick={signOutUser} className="nav">sign out</button>
    </div>
  )
}