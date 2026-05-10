"use server";

import { ai } from "../../../lib/ai";
import { NextResponse } from "next/server";
import { gradingContext } from "../../../lib/ai"
import { SchemaType } from "@google-cloud/vertexai"

//schema enforced by Gemini's controlled generation
const gradingSchema = {
    type: SchemaType.OBJECT,
    properties: {
        survey_name: { type: SchemaType.STRING },
        employee_name: { type: SchemaType.STRING },
        summary: { type: SchemaType.STRING },
        metrics: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    category: { type: SchemaType.STRING },
                    score: { type: SchemaType.NUMBER },
                    gradeReasoning: { type: SchemaType.STRING },
                },
                required: ["category", "score", "gradeReasoning"],
            },
        },
    },
    required: ["employee_name", "summary", "metrics"],
};

//post request for grading and sending scores
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
            parts: [{ text: gradingContext }],
        },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: gradingSchema,
        },
    });

    //inject chat history into the chat session
    const chatSession = model.startChat({ 
        history: chats
    });

    //instruct the model to grade this user's survey performance
    const res = await chatSession.sendMessage("Survey has ended, grade this user's survey performance");

    //send the result from the model in the response
    return NextResponse.json({ res });
}