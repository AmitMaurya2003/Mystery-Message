import { getServerSession } from "next-auth"; 
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User"; 
import { authOptions } from "../auth/[...nextauth]/options"; 

export async function POST(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!session || !session.user){
        return Response.json({success: false, message: "Not Authenticated"}, {status: 401})
    }

    const userId = user?._id
    const {acceptMessages} = await request.json()

    try {
        const updateUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage: acceptMessages}, {new: true})
        if(!updateUser){
            return Response.json({success: false, message: "failed to update user status to accept message"}, {status: 401})
        }
        return Response.json({success: true, message: "Message acceptance status updated successfully", updateUser}, {status: 200})
        
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json({success: false, message: "failed to update user status to accept messages"}, {status: 500})
    }
}

export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!session || !session.user){
        return Response.json({success: false, message: "Not Authenticated"}, {status: 401})
    }

    const userId = user?._id;
    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return Response.json({success: false, message: "User not found"}, {status: 404})
        }
        return Response.json({success: true, isAcceptingMessage: foundUser.isAcceptingMessage}, {status: 200})
        
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json({success: false, message: "Error is getting message acceptance status"}, {status: 500})
    }
}