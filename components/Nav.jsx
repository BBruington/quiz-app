import Link from "next/link";
import {signOutUser, getCurrentUser} from "../lib/firebase";
import { sanityClient, urlFor } from "../lib/sanity";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function Nav({userInfo}) {
  console.log(userInfo)

  const router = useRouter()
  const [users, setUsers] = useState(null);  
  const [usersInfo, setUsersInfo] = useState(null);  
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
        <SheetTrigger className="nav flex justify-center items-center">Welcome {userEmail}
          <Avatar className="md:ml-5 ml-3">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
            <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

            </SheetTitle>
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

export const getServerSideProps = async () => {
  const userQuery = `*[_type == "author" && email == "bibruington@gmail.com"]{
    _id,
    slug,
    image,
  }`
    const userInfo = await sanityClient.fetch(userQuery, {
      slug: "beny-boy",
    });

  return {
    props: {
      userInfo,
    },
    revalidate: 60,
  }
}