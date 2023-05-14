import Link from "next/link";

export default function LinkToSignIn() {

  return (
    <>
    <div className="flex justify-center">Please sign in to study.</div>
    <Link onClick={() => checkUrl("http://localhost:3000/login")} href="/login" className="flex justify-center nav">Sign In</Link>
    </>
  )
}