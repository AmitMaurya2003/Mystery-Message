'use client'
import { Message } from "@/src/model/User"
import { acceptMessageSchema } from "@/src/schemas/acceptMessageSchema"
import { ApiResponse } from "@/src/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner" 
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "@/components/MessageCard"
import { User } from "next-auth" 

const page = () => {

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId))
  }

  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema) 
  })

  const {register, watch, setValue} = form;

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages') 
      setValue('acceptMessages', response.data.isAcceptingMessage ?? false)
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch message settings", { position: "top-right" })
    } 
    finally {
      setIsSwitchLoading(false)
    }
  }, [setValue, toast])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if(refresh){
        toast.success("Refreshed Messages. Showing latest messages", { position: "top-right" })  
      }
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch message settings", { position: "top-right" })
    }
    finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  },[setIsLoading, setMessages, toast])

  useEffect(() => {
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()

  }, [session, setValue, toast, fetchAcceptMessage, fetchMessages])

  //handle switch change
  const handleSwitchChange = async () => { 
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {acceptMessages: !acceptMessages})
      setValue('acceptMessages', !acceptMessages)
      toast.success(response.data.message, { position: "top-right" })
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error( axiosError.response?.data.message || "Failed to fetch message settings", { position: "top-right" })
    } 
  }

  if(!session || !session.user){
    return <div className="mt-5 flex justify-center">You are not login. Please login.</div>
  }

  const {username} = session?.user as User

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL has been copied to clipboard", { position: "top-right" })
  }  

  return (
    <div className="mx-auto my-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
 
    <div className="mb-8 flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        User Dashboard
      </h1>
      <p className="text-sm text-gray-500">
        Manage your link, messages, and preferences in one place.
      </p>
    </div>
 
    <div className="mb-8">
      <h2 className="mb-2 text-sm font-semibold text-gray-700">
        Share Your Personal Anonymous Message Link
      </h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 focus:outline-none"
        />
        <Button
          className="w-full cursor-pointer sm:w-auto"
          onClick={copyToClipboard}
        >
          Copy Link
        </Button>
      </div>
    </div>
 
    <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-800">
          Accept Messages
        </p>
        <p className="text-xs text-gray-500">
          Allow others to send you anonymous messages
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="scale-125 cursor-pointer data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
        />
        <span
          className={`text-sm font-medium ${
            acceptMessages ? 'text-green-800' : 'text-gray-800'
          }`}
        >
          {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
    </div>

    <Separator className="my-6" />
 
    <div className="mb-6 flex justify-end">
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-transparent cursor-pointer"
        onClick={(e) => {
          e.preventDefault()
          fetchMessages(true)
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
        <span className="text-sm">Refresh</span>
      </Button>
    </div>
 
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {messages.length > 0 ? (
        messages.map((message) => (
          <MessageCard
            key={message._id.toString()}
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
        ))
      ) : (
        <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">
            No messages to display yet.
          </p>
        </div>
      )}
    </div>

  </div>
</div>

  )
}

export default page
