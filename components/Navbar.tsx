"use client" 
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "@/components/ui/button" 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import { Menu } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

   return (
    <nav className="p-4 shadow-md bg-gray-800 text-white">
      <div className="container mx-auto flex items-center justify-between"> 
        <Link href="#" className="text-xl font-bold">
          Mystery Message
        </Link> 
        {session && (
          <span className="hidden min-[500px]:block flex-1 text-center font-medium">
            Welcome, {user?.username || user?.email}
          </span>
        )} 
        {session ? (
          <> 
            <div className="pr-5 hidden md:block">
              <Link href="/dashboard">
              <Button className="cursor-pointer">
                Dashboard
              </Button>
              </Link>
            </div> 
            <div className="hidden md:block">
              <Button onClick={() => signOut({callbackUrl: '/'})} className="cursor-pointer">
                Logout
              </Button>
            </div> 
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    className="bg-black text-white hover:bg-black/90"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end"> 
                  <DropdownMenuItem
                    disabled
                    className="block min-[500px]:hidden"
                  >
                    Welcome, {user?.username || user?.email}
                  </DropdownMenuItem>

                  <Link href="/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    Dashboard
                  </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => signOut({callbackUrl: '/'})} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="cursor-pointer">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  ) 
}

export default Navbar
