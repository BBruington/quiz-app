import Link from "next/link";
import {signOutUser, getCurrentUser} from "../lib/firebase";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
//import { setCookie, getCookie } from "cookies-next";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Nav() {

  const router = useRouter()
  const [users, setUsers] = useState(null);  
  const [userEmail, setUserEmail] = useState(null);   

  useEffect(()=>{
    const handleGetUser = async () => {
      const currentUser = await getCurrentUser();
      if(currentUser !== null) {
        // if(!getCookie("userCookie")) {
        //   setCookie("userCookie", currentUser.email)
        // }
        
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
    <div className="flex justify-center items-center md:space-x-5 space-x-3">
      <Link onClick={() => checkUrl("http://localhost:3000")} href="/" className="ml-5 nav">Home</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/questions")} href="/questions" className="nav">Study Topic</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/builder")} href="/builder" className="nav">Edit Topic</Link>
      <Link onClick={() => checkUrl("http://localhost:3000/notes")} href="/notes" className="nav">Notebook</Link>
      {!users && (
        <Link onClick={() => checkUrl("http://localhost:3000/login")} href="/login" className="nav">Sign In</Link>
      )}
      {users && (
        <Sheet>
        <SheetTrigger className="nav">Welcome {userEmail}</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription className="flex flex-col space-y-2 items-start">
              <button className="hover:underline" onClick={signOut}>
                Sign Out
              </button>
              <Link onClick={() => checkUrl("http://localhost:3000/post/builder")} href="/post/builder"
              className="text-green-600 hover:underline">
                Create a Post
              </Link>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      )}
    </div>
  )
}