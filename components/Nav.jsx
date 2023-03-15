import Link from "next/link";

export default function Nav() {

  return (
    <div className="flex space-x-5">
      <Link href="/" className="ml-5 pt-3 text-lg font-bold hover:underline cursor-pointer">Home</Link>
      <Link href="/questions" className="pt-3 text-lg hover:underline  font-bold cursor-pointer">Study Topics</Link>
      <Link href="/builder" className="pt-3 text-lg hover:underline  font-bold cursor-pointer">Create / Edit Topic</Link>
    </div>
  )
}