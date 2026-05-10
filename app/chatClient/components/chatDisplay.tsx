"use client";

import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Chat } from "@/lib/types";

export default function ChatDisplay({ chats }: { chats: Chat[] }) {
	//reference for finding the last message
	const lastMessageRef = useRef<HTMLDivElement>(null);

	//when chats parameter gets updated scroll to the last chat
	useEffect(() => {
		lastMessageRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}, [chats]);

	return (
		<div className="flex flex-col gap-6 max-w-3xl mx-auto w-full px-4">
			{chats.slice(1).map((chat, index) => {
				const isUser = chat.role === "user";

				return (
					<div
						key={index}
						ref={lastMessageRef}
						className={`flex ${isUser ? "justify-end" : "justify-start"}`}
					>
						<div
							className={`
                				max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md
                					${isUser ? "bg-red-600 text-white rounded-br-md"
										: "bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-md"
									}
              					`}
						>
							{isUser ? (
								<span>{chat.parts[0].text}</span>
							) : (
								<div className="prose prose-invert prose-sm max-w-none">
									<ReactMarkdown
										rehypePlugins={[rehypeHighlight]}
										remarkPlugins={[remarkGfm]}
									>
										{chat.parts[0].text}
									</ReactMarkdown>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}