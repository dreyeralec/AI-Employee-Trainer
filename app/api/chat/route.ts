"use server"

import { NextResponse } from "next/server";
import { context } from "@/lib/ai";
import { ai } from "@/lib/ai";

//function for sending and recieving data with the VertexAI cloud endpoint
export async function POST(req: Request) {
    //chats object from the request data
    const { chats } = await req.json();

    //if there are no chats, exit
    if (!chats) return NextResponse.json({ success: false });

    //set up our model with the context prompt
    const model = ai.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: {
            role: "system",
            parts: [{ text: context }],
        }
    });

    //exclude most recent chat to build history array
    const history = chats.slice(0, -1);

    //create a chat session with the model, give it our history and google search tool
    const chatSession = model.startChat({ 
        history,
        tools: [{ google_search: {} } as any],
    });

    //get user's message as the last item in the chats array
    const message = chats[chats.length - 1].parts[0].text;
    //send the message to the model via the chat session
    const result = await chatSession.sendMessage(message);

    //send the result from the model in the response
    return NextResponse.json({ result });
}