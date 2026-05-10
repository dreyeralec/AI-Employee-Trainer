import { Chat } from "./types";

//sending request to api/scores/route.ts internal API
export async function gradeScores(chats: Chat[]) {
    //send the chats in the body of the request
    const res = await fetch('/api/scores', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ chats }),
    });

    //check if the response was ok, if not throw an error
    if (!res.ok) throw new Error("API call failed");

    //take the data out of the response
    const data = await res.json();
    
    //parse the nested JSON string out of the Gemini response
    const raw = data.res.response.candidates[0].content.parts[0].text;
    const scores = JSON.parse(raw);
    
    return scores;
}