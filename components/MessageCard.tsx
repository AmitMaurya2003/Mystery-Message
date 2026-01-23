"use client";
import {
  Card,
  CardAction, 
  CardDescription, 
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button'
import { Axis3D, X } from "lucide-react";
import { Message } from "@/src/model/User";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/src/types/ApiResponse"; 

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {  

  const formattedDate = new Date(message.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast.success(response.data.message)
        onMessageDelete(message._id.toString())
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>

        <CardAction>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="cursor-pointer"><X className="w-5 h-5"/></Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent cursor-pointer">Cancel</AlertDialogCancel>
              <AlertDialogAction className=" cursor-pointer" onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </CardAction>

        <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
    </Card>
  );
};

export default MessageCard;
