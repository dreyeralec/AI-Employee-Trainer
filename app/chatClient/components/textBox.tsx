"use client";

import { useState, useRef, useEffect } from "react";
import { Chat } from "@/lib/types";

export default function ChatInput({ sendChat }: { sendChat: (chat: Chat) => void }) {
	//state variable for holding the user's input
	const [userInput, setUserInput] = useState<string>("");
	
	//reference for checking user input
	const inputRef = useRef<HTMLDivElement>(null);

	//fires when user input is changed
	useEffect(() => {
		//if the reference is not what is current, exit
		const element = inputRef.current;
		if (!element) return;

		//auto grow the user input text box
		element.style.height = "auto";
		const scrollHeight = element.scrollHeight;
		const maxHeight = 160;
		element.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
	}, [userInput]);

	//set the user input state variable to the user's input
	const handleInput = (e: React.InputEvent<HTMLDivElement>) => {
		setUserInput(e.currentTarget.textContent || "");
	};

	//check each key down event to see if it was enter
	const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		//if it was enter, send the chat
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			//send the chat
			handleSend();
		}
	};

	//handle sending the chat
	const handleSend = () => {
		//if there was no user input, exit
		if (!userInput.trim()) return;

		//build a chat object with the input
		const chat: Chat = { role: "user", parts: [{ text: userInput }] };
		//send the chat to the model
		sendChat(chat);
		//clear the user input state variable
		setUserInput("");
		//clear the input reference
		if (inputRef.current) inputRef.current.textContent = "";
	};

	return (
		<div className="flex items-end gap-3 w-full min-w-0">
			<div
				className="
          			flex-1 min-w-0 rounded-2xl border border-gray-700 bg-gray-800/80 
          			backdrop-blur-md px-4 py-3 text-white
         			focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500
          			transition"
			>
				<div
					ref={inputRef}
					contentEditable
					onInput={handleInput}
					onKeyDown={handleKeyDown}
					suppressContentEditableWarning={true}
					data-placeholder="Enter your response..."
					className="
						w-full outline-none
						max-h-40 overflow-y-auto
						text-sm leading-relaxed
						break-words whitespace-pre-wrap
						empty:before:content-[attr(data-placeholder)]
						empty:before:text-gray-400
						empty:before:pointer-events-none"
				/>
			</div>

			<button
				title="Send response"
				onClick={handleSend}
				className={`
					flex items-center justify-center
					h-12 w-12 rounded-xl
					bg-red-600 text-white text-xl
					transition-all duration-200
					hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/30
					active:scale-95
					${!userInput.trim() && "opacity-40 pointer-events-none"}
				`}
			>
				➤
			</button>
		</div>
	);
}