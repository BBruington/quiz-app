import { useRouter } from "next/router"

export default function Nav() {

  const router = useRouter();

  const toHomeHandler = () => {
    router.push('/')
  }

  return (
    <div className="flex">
      <div onClick={toHomeHandler} className="pl-5 pt-3 text-lg font-bold cursor-pointer">Home</div>
    </div>
  )
}