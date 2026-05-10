import { Chat } from "./types";

//sending request to api/chat/route.ts internal API
export async function sendChats(chats: Chat[]) {
    //send the chats in the body of the request
    const res = await fetch('/api/chat', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ chats }),
    });

    //check if the response was ok, if not throw an error
    if (!res.ok) throw new Error("API call failed");
    //return the response
    return res.json();
}