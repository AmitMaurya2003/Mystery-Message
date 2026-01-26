'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import AutoPlay from 'embla-carousel-autoplay'
import messages from "@/src/messages.json"
import { Mail } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button" 
import Link from "next/link"

const Home = () => {

  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
  <>
    <main className="grow flex flex-col items-center justify-center px-4 sm:px-8 md:px-24 py-16
      bg-linear-to-r from-slate-950 via-indigo-950 to-purple-950 text-white">
 
      <section className="text-center mb-10 max-w-3xl">
        <h1
          className="
            text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight
            bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400
            bg-clip-text text-transparent
          "
        >
          Dive into the World of Anonymous Conversations
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-300">
          After logging in, Mystery Message creates a unique link for you. Share it anywhere and receive anonymous messages privately in your dashboard.
        </p>
      </section>

      <section className="text-center mb-10">
      {
      !session && (
          <Link href="/sign-in">
            <Button className="scale-200 pl-5 pr-5 text-2xl bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 text-black cursor-pointer">Login</Button>
          </Link>
      )} 
      </section>
 
      <Carousel
        plugins={[AutoPlay({ delay: 2500 })]}
        className="w-full max-w-md"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-2">
                <Card
                  className="
                    bg-white
                    shadow-xl rounded-2xl
                    border border-gray-200
                  "
                > 
                  <CardHeader
                    className="
                      text-center font-bold text-lg
                      text-indigo-600 pb-2
                    "
                  >
                    {message.title}
                  </CardHeader>
 
                  <CardContent className="px-5 pt-3 pb-2">
                    <div className="flex items-start gap-3 bg-gray-100 rounded-lg p-3">
                      <Mail className="w-5 h-5 text-indigo-500 mt-0.5" />
                      <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </CardContent>
 
                  <CardContent className="px-5 pt-1 pb-4">
                    <p className="text-xs sm:text-sm text-gray-500 text-center">
                      {message.received}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
 
        <CarouselPrevious
          className="bg-white/10 hover:bg-white/20 border border-white/20
          text-white backdrop-blur-md transition"
        />
        <CarouselNext
          className="bg-white/10 hover:bg-white/20 border border-white/20
          text-white backdrop-blur-md transition"
        />
      </Carousel>
    </main>
 
    <footer className="text-center py-4 text-sm text-gray-400 bg-slate-950">
      © 2023 True Feedback. All rights reserved.
    </footer>
  </>
)
}

export default Home
