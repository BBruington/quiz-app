import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
// if(!getCookie("userCookie")) {
  //   setCookie("userCookie", currentUser.email)
  // }

const handleItWorks = () => {
  console.log("it works")
}

export default function Test() {


  return (
    <div className="w-full">
      <Sheet>
        <SheetTrigger>Welcome Bibruington</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you sure absolutely sure?</SheetTitle>
            <SheetDescription>
              <button onClick={handleItWorks}>
                Sign Out
              </button>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

    </div>
  )
}