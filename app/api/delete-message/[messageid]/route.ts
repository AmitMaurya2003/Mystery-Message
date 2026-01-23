import { getServerSession } from "next-auth"; 
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";  
import { User } from "next-auth"; 
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose, { ObjectId } from "mongoose";

export async function DELETE(request: Request, {params}: {params: Promise<{messageid: string}>}) { 
    const {messageid} = await params
    const messageId = messageid

    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({success: false, message: "Not Authenticated"}, {status: 401})
    } 

    try {
        const updateResult = await UserModel.updateOne(
            {_id: new mongoose.Types.ObjectId(session.user._id)},
            {$pull: {messages: {_id: new mongoose.Types.ObjectId(messageId)}}}
        ) 
        if(updateResult.modifiedCount == 0){
            return Response.json({success: false, message: "Message not found or already deleted"}, {status: 404})
        }
        return Response.json({success: true, message: "Message Deleted"}, {status: 200})
        
    } catch (error) {
        console.log("Error deleting message", error)
        return Response.json({success: false, message: "Error deleting message"}, {status: 401})
    }
}