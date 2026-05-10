"use client";

import { useState } from "react";
import { QuestionCardProps, ArrayField } from "@/lib/types";

export default function QuestionCard({
	question,
	index,
	onUpdate,
	onRemove,
	onAddTag,
	onRemoveTag,
}: QuestionCardProps) {
	//state variable for holding the user's input for expected concepts
	const [conceptInput, setConceptInput] = useState<string>("");
	//state variable for holding the user's input for critical mistakes
	const [mistakeInput, setMistakeInput] = useState<string>("");

	//add the user's input to the array for the respective field
	function handleAddTag(field: ArrayField, value: string, clearFn: any) {
		//if there was no input, exit
		if (!value.trim()) return;
		//adding the tag to the actual array via the parent's function
		onAddTag(question.id, field, value.trim());
		//clearing the input field
		clearFn("");
	}

	return (
		<fieldset className="space-y-5">

			<div className="flex justify-between items-center">
				<legend className="text-lg font-semibold text-white">
					Question {index + 1}
				</legend>

				<button
					onClick={() => onRemove(question.id)}
					className="
						text-sm px-3 py-1 rounded-lg
						bg-red-600/20 text-red-400 border border-red-500/30
						hover:bg-red-600 hover:text-white
						transition"
				>
					Remove
				</button>
			</div>

			<div className="flex flex-col gap-2">
				<label
					htmlFor={`text-${question.id}`}
					className="text-sm text-gray-300"
				>
					Question
				</label>

				<textarea
					id={`text-${question.id}`}
					rows={2}
					value={question.text}
					onChange={(e) =>
						//set the text for the respective question
						onUpdate(question.id, "text", e.target.value)
					}
					className="
						w-full rounded-xl bg-gray-900 border border-gray-700
						text-white px-4 py-2 text-sm
						focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
						resize-none"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label className="text-sm text-gray-300">
					Expected Concepts
				</label>

				<div className="flex flex-wrap gap-2">
					{question.expectedConcepts.map((concept: string, idx: number) => (
						<span
							key={idx}
							className="
								flex items-center gap-2
								bg-gray-800 border border-gray-700
								px-3 py-1 rounded-full text-sm text-gray-200"
						>
							{concept}
							<button
								onClick={() =>
									//remove a tag from the array of the respective field via button
									onRemoveTag(question.id, "expectedConcepts", idx)
								}
								className="text-gray-400 hover:text-red-400"
							>
								✕
							</button>
						</span>
					))}
				</div>

				<div className="flex gap-2">
					<input
						type="text"
						placeholder="Add concept..."
						value={conceptInput}
						onChange={(e) => setConceptInput(e.target.value)}
						onKeyDown={(e) => {
							//adding a tag to the array of the respective field via enter key
							if (e.key === "Enter")
								handleAddTag(
									"expectedConcepts",
									conceptInput,
									setConceptInput
								);
						}}
						className="
							flex-1 rounded-xl bg-gray-900 border border-gray-700
							text-white px-3 py-2 text-sm
							focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
					/>

					<button
						onClick={() =>
							//adding the tag via the button
							handleAddTag(
								"expectedConcepts",
								conceptInput,
								setConceptInput
							)
						}
						className="
							px-4 py-2 rounded-xl
							bg-gray-800 border border-gray-700 text-gray-300 text-sm
							hover:border-red-500 hover:text-white
							transition"
					>
						Add
					</button>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<label className="text-sm text-gray-300">
					Critical Mistakes
				</label>

				<div className="flex flex-wrap gap-2">
					{question.criticalMistakes.map((mistake: string, idx: number) => (
						<span
							key={idx}
							className="
								flex items-center gap-2
								bg-gray-800 border border-gray-700
								px-3 py-1 rounded-full text-sm text-gray-200"
						>
							{mistake}
							<button
								onClick={() =>
									//removing a tag via button
									onRemoveTag(question.id, "criticalMistakes", idx)
								}
								className="text-gray-400 hover:text-red-400"
							>
								✕
							</button>
						</span>
					))}
				</div>

				<div className="flex gap-2">
					<input
						type="text"
						placeholder="Add mistake..."
						value={mistakeInput}
						onChange={(e) => setMistakeInput(e.target.value)}
						onKeyDown={(e) => {
							//adding a tag via enter key
							if (e.key === "Enter")
								handleAddTag(
									"criticalMistakes",
									mistakeInput,
									setMistakeInput
								);
						}}
						className="
							flex-1 rounded-xl bg-gray-900 border border-gray-700
							text-white px-3 py-2 text-sm
							focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
					/>

					<button
						onClick={() =>
							//adding a tag via the button
							handleAddTag(
								"criticalMistakes",
								mistakeInput,
								setMistakeInput
							)
						}
						className="
							px-4 py-2 rounded-xl
							bg-gray-800 border border-gray-700 text-gray-300 text-sm
							hover:border-red-500 hover:text-white
							transition"
					>
						Add
					</button>
				</div>
			</div>

		</fieldset>
	);
}