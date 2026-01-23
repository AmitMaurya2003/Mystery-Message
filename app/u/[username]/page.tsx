"use client";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; 
import { Button } from "@/components/ui/button";
import { messageSchema } from "@/src/schemas/messageSchema";
import { ApiResponse } from "@/src/types/ApiResponse";
import { useChat } from "@ai-sdk/react"; 
import { Input } from "@/components/ui/input";
import type { UIMessage } from "ai";

type messageResponse = {
  success: boolean;
  message: string;
};

const page = () => {
  const [input, setInput] = useState("");

  const { messages, sendMessage, setMessages, status } = useChat();

  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === "user");

  const lastAIMessage = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");

  const isLoading = status === "submitted" || status === "streaming";

  function getMessageText(message?: UIMessage) {
  if (!message) return "";

  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams<{ username: string }>();

  const sendAnnonymousMessage = async () => {
    try {
      setLoading(true);
      const result = messageSchema.safeParse({
        content: message,
      });

      if (!result.success) {
        toast.error(result.error.issues[0].message, { position: "top-right" });
        return;
      }
      const response = await axios.post<messageResponse>("/api/send-message", {
        username: params.username,
        content: result.data.content,
      });
      if (response.data.success) {
        toast.success("Message send successfully", { position: "top-right" });
        setMessage("");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("Message send error", axiosError);
      toast.error(
        axiosError.response?.data.message || "Failed to send message",
        { position: "top-right" },
      );
    } finally {
      setLoading(false);
      setMessage("");
    }
  };
 
  return (   
    <div className="mt-10 flex justify-center px-4">
      <div className="w-full max-w-5xl grid grid-rows-1 gap-10"> 
        <div className="w-full flex h-full flex-col space-y-5 rounded-2xl border bg-white p-6 shadow-sm">
          <div>
            <Field>
              <FieldLabel
                htmlFor="textarea-message"
                className="text-2xl font-semibold tracking-tight"
              >
                Anonymous Message
              </FieldLabel>

              <FieldDescription className="text-sm text-gray-500">
                {`Send your message to @${params.username}.`}
              </FieldDescription>

              <Textarea
                id="textarea-message"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="
                    w-full
                    resize-none
                    rounded-xl
                    border border-gray-300
                    px-4 py-3
                    text-sm
                    shadow-sm
                    focus-visible:outline-none
                    focus-visible:ring-2
                  focus-visible:ring-blue-500/40
                  focus-visible:border-blue-500
                    transition
                  "
              />
            </Field>
          </div>

          <div className="mt-auto flex justify-end">
            <Button
              onClick={sendAnnonymousMessage}
              disabled={loading}
              className="
                h-11 
                rounded-xl
                text-base
                font-medium
                transition
                disabled:opacity-50
                cursor-pointer
              "
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div> 

                         {/* RIGHT : Ask AI  */}
        <div className="w-full space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-center tracking-tight">
            Ask Anonymous Message with AI
          </h1>

          {/* Question + Answer */}
          {lastUserMessage && (
            <div className="space-y-4">
              {/* User Question */}
              <div className="rounded-xl border bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  You asked
                </p>
                <p className="text-sm font-medium text-gray-900">
                    {getMessageText(lastUserMessage)}
                </p>
              </div>

              {/* AI Answer */}
              <div className="rounded-xl border border-blue-500/40 bg-blue-50/40 p-4">
                <p className="text-xs uppercase tracking-wide text-blue-600 mb-1">
                  AI replied
                </p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {lastAIMessage
                    ? getMessageText(lastAIMessage)
                    : isLoading
                      ? "Thinking…"
                      : null}
                </p>
              </div>
            </div>
          )}

          {/* 🔹 Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return; 

              sendMessage({ text: input });
              setInput("");
            }}
            className="grid grid-rows-1 gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="
            flex-1
            rounded-xl
            border border-gray-300
            px-4 py-2
            text-sm
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500/40
            transition
          "
            />
            
            <div className="mt-auto flex justify-end">
            <Button
              disabled={isLoading}
              className=" 
                w-36
                h-11 
                rounded-xl
                text-base
                font-medium
                transition
                disabled:opacity-50
                cursor-pointer 
                "
            >
              Ask
            </Button>
            </div>
          </form>
        </div>
      </div>
    </div>  
  );
};

export default page;
