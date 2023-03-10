import Link from "next/link";

export default function Nav() {

  return (
    <div className="flex">
      <Link href="/" className="pl-5 pt-3 text-lg font-bold hover:underline cursor-pointer">Home</Link>
      <Link href="/questions" className="pl-5 pt-3 text-lg hover:underline  font-bold cursor-pointer">Note Card Topics</Link>
      <Link href="/builder" className="pl-5 pt-3 text-lg hover:underline  font-bold cursor-pointer">Note Card Builder</Link>
    </div>
  )
}