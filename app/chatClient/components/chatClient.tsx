"use client";

import ChatDisplay from "./chatDisplay";
import TextBox from "./textBox";
import { useState, useEffect, useRef } from "react";
import { sendChats } from "@/lib/sendChats";
import Link from "next/link";
import { Chat, Survey } from "@/lib/types";
import { saveScores } from "@/app/actions/serverActions";
import { gradeScores } from "@/lib/gradeScores";

export default function ChatClient({ survey }: { survey: Survey }) {
	//state array for storing the chat history
	const [chatHistory, setChatHistory] = useState<Chat[]>([]);
	//boolean for controlling the thinking state
	const [thinking, setThinking] = useState(false);
	//boolean for controlling if the survey is open or not
	const [surveyOpen, setSurveyOpen] = useState(true);

	//reference for checking if we are in a survey
	const hasInitialized = useRef(false);

	//fires when survey loads
	useEffect(() => {
		//check our reference to see if we can proceed
		if (hasInitialized.current) return;
		hasInitialized.current = true;

		//build a prompt object with the survey questions for the model
		const prompt: Chat = {
			role: "user",
			parts: [{ text: `Here are the survey questions: ${JSON.stringify(survey)}` }],
		};

		//send our survey questions to the model
		sendChat(prompt);
	}, [survey]);

	//send user input to the model
	const sendChat = async (chat: Chat) => {
		//put the new chat into the chat history
		const updatedHistory = [...chatHistory, chat];
		//save the chat history in the state array
		setChatHistory(updatedHistory);
		//set the state to thinking
		setThinking(true);

		try {
			//send all the chats to the model
			const llmResponse = await sendChats(updatedHistory);

			//get the raw response from the model
			const rawResponse: string =
				llmResponse.result.response.candidates[0].content.parts[0].text;

			//check if the response contained the scores block
			const isDone = rawResponse.includes("%%DONE%%");

			//take done block out of the response if its there
			const cleanedResponse = rawResponse.replace("%%DONE%%", "").trim();
			
			//build a chat object with the response
			const cleanedChat: Chat = {
				role: "model",
				parts: [{ text: cleanedResponse }],
			};

			//if the survey is complete
			if (isDone) {
				//upload the scores
				try {
					//send the chat history to the grading API
					const scores = await gradeScores([...updatedHistory, cleanedChat])
					//send those scores to the GCS Bucket
					await saveScores(scores);
				} catch (err) {
					//log any error in the console
					console.log("Error uploading scores", err);
				}

				//close the survey so user cannot interact with the model
				setSurveyOpen(false);
			}

			//add model's response object to the chat history to be displayed
			setChatHistory([...updatedHistory, cleanedChat]);
		} catch (err) {
			//catch any error and log it in the console
			console.log("Error sending chat", err);
		} finally {
			//stop the thinking state
			setThinking(false);
		}
	};

	return (
		<>
			<Link href="/surveysClient">
				<button
					className="
						absolute top-6 left-6 z-50
						px-4 py-2 rounded-xl
						bg-red-600/60 text-white text-sm font-medium
						border border-red-500/40
						shadow-md
						transition-all duration-200
						hover:bg-red-600 hover:shadow-lg hover:shadow-red-900/30
						active:scale-95"
				>
					{surveyOpen ? "Cancel Survey" : "Exit"}
				</button>
			</Link>

			<div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
				<div
					className="flex-1 overflow-y-auto px-4 pt-21 xl:pt-6 pb-40 mx-auto w-full"
					style={{ scrollbarGutter: "stable both-edges" }}
				>
					<ChatDisplay chats={chatHistory} />
				</div>

				<div className="fixed bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
					{thinking && (
						<div className="px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-sm shadow-md animate-pulse">
							Thinking...
						</div>
					)}
				</div>

				<div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
					<div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-3">
						{!thinking && surveyOpen && <TextBox sendChat={sendChat} />}
					</div>
				</div>
			</div>
		</>
	);
}