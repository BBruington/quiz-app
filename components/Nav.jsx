import Link from "next/link";

export default function Nav() {

  return (
    <div className="flex">
      <Link href="/" className="pl-5 pt-3 text-lg font-bold hover:underline cursor-pointer">Home</Link>
      <Link href="/Questions" className="pl-5 pt-3 text-lg hover:underline  font-bold cursor-pointer">Note Card Topics</Link>
    </div>
  )
}