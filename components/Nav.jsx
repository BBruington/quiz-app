import Link from "next/link";
import {signOutUser, getCurrentUser} from "../utils/firebase";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

export default function Nav() {

  const router = useRouter()
  const [users, setUsers] = useState(null);  
  const [userEmail, setUserEmail] = useState(null);   

  useEffect(()=>{
    const handleGetUser = async () => {
      const currentUser = await getCurrentUser();
      if(currentUser !== null) {
        setUsers(currentUser)
        let emailEnd = currentUser.email.indexOf("@")
        setUserEmail(currentUser.email.substring(0, emailEnd))
      } else {setUsers(null)}
    }
    handleGetUser();
  },[router])

  const signOut = async () => {
    await signOutUser();
    setUsers(null);
  }

  const checkUrl = (url) => {
    if (window.location.href === url) window.location.reload(false);
  }
  return (
    <div className="flex md:space-x-5 space-x-3">
      <Link onClick={() => checkUrl("http://localhost:3000")} href="/" className="ml-5 nav">Home</Link>
      {users ? (
        <button onClick={signOut} className="nav">Sign Out</button>

      ) : (
        <Link onClick={() => checkUrl("http://localhost:3000/login")} href="/login" className="nav">Sign In</Link>

      )}
      <Link onClick={() => checkUrl("http://localhost:3000/questions")} href="/questions" className="nav">Study Topics</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/builder")} href="/builder" className="nav">Create/Edit Topic</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/quiz")} href="/quiz" className="nav">Take a Quiz</Link>
      {users && (
        <span className="nav">Welcome {userEmail}</span>
      )}
    </div>
  )
}