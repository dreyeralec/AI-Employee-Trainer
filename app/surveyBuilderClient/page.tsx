"use client";

import { NewQuestion, Question, ArrayField } from "@/lib/types";
import { useState } from "react";
import QuestionCard from "./components/questionCard";
import Link from "next/link";
import { createSurvey } from "../actions/serverActions";

export default function QuestionBuilder() {
	//state array for saving user's questions being created
	const [questions, setQuestions] = useState<NewQuestion[]>([]);
	//state array for saving the user's survey name
	const [surveyName, setSurveyName] = useState<string>("");

	//creates the survey and sends it to the cloud
	const handleAddSurvey = async () => {
		//creates the json file and sends it to the cloud
		await createSurvey(surveyName, questions);
		//clear the form
		clearForm();
	};

	//clearing the form
	function clearForm() {
		setQuestions([]);
		setSurveyName("");
	}

	//adding a question to the questions array
	function addQuestion() {
		//appends new question to a shallow copy of the previous array
		setQuestions((prev) => [
			...prev,
			{ id: Date.now(), text: "", expectedConcepts: [], criticalMistakes: [] },
		]);
	}

	//removes a question from the questions array
	function removeQuestion(id: number) {
		//filter the questions array for everything that isn't the selected question
		setQuestions((prev) => prev.filter((question) => question.id !== id));
	}

	//update a field in the selected question
	function updateQuestion(id: number, field: keyof Question, value: string) {
		//find the selected question and update the respective field
		setQuestions((prev) =>
			prev.map((question) => (question.id === id ? { ...question, [field]: value }
				: question
			))
		);
	}

	//adding a tag to a selected question and field
	function addTag(id: number, field: ArrayField, value: string) {
		//find the selected question and the field the tag is going in then add the value
		setQuestions((prev) =>
			prev.map((question) =>
				question.id === id ? { ...question, [field]: [...question[field], value] }
					: question
			)
		);
	}

	//removing a tag from a selected question and field
	function removeTag(id: number, field: ArrayField, idx: number) {
		setQuestions((prev) =>
			//find the selected question and filter the tags to not include the selected index
			prev.map((question) =>
				question.id === id
					? { ...question, [field]: question[field].filter((_, i) => i !== idx) }
					: question
			)
		);
	}

	//turn the questions and survey name data into json
	const json = JSON.stringify(
		{
			formName: surveyName,
			questions: questions.map(({ text, expectedConcepts, criticalMistakes }) => ({
				text,
				expectedConcepts,
				criticalMistakes,
			})),
		},
		null,
		2
	);

	return (
		<>
			<Link href="/">
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
					Go Back
				</button>
			</Link>

			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-10">
				<div className="max-w-4xl mx-auto mt-3">

					<div className="mb-8">
						<h1 className="text-3xl font-semibold text-white">
							Survey Builder
						</h1>
						<p className="text-gray-400 text-sm mt-1">
							Create new surveys
						</p>
					</div>

					<div className="flex flex-col gap-2 mb-5">
						<label className="text-sm text-gray-300">
							Survey Name
						</label>

						<textarea
							value={surveyName}
							onChange={((e) =>
								setSurveyName(e.target.value)
							)}
							className="
								w-full rounded-xl bg-gray-900 border border-gray-700
								text-white px-4 py-2 text-sm
								focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
								resize-none"
						/>
					</div>

					<div className="space-y-6">
						{questions.map((q, i) => (
							<div
								key={q.id}
								className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5 shadow-md"
							>
								<QuestionCard
									question={q}
									index={i}
									onUpdate={updateQuestion}
									onRemove={removeQuestion}
									onAddTag={addTag}
									onRemoveTag={removeTag}
								/>
							</div>
						))}
					</div>

					<div className="mt-6">
						<button
							onClick={addQuestion}
							className="
								px-5 py-3 rounded-xl
								bg-red-600 text-white font-medium
								transition-all duration-200
								hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/30
								active:scale-95"
						>
							+ Add Question
						</button>
					</div>

					<div className="mt-10">
						<h2 className="text-xl text-white mb-3">View JSON</h2>

						<div className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-inner">
							<textarea
								rows={15}
								readOnly
								value={json}
								className="
									w-full bg-transparent text-gray-300 text-sm
									outline-none resize-none font-mono"
							/>
						</div>

						<Link href="/">
							<button
								onClick={handleAddSurvey}
								className="
									mt-4 px-4 py-2 rounded-lg
									bg-red-600 text-white text-sm
									hover:bg-red-700
									transition"
							>
								Save Survey
							</button>
						</Link>

							<button
								onClick={handleAddSurvey}
								className="
									mt-4 px-4 py-2 rounded-lg
									bg-red-600 text-white text-sm
									hover:bg-red-700
									transition ml-3"
							>
								Save & Add New Survey
							</button>

						<p className="text-gray-400 text-sm mt-2">
							Store to Google Cloud Bucket
						</p>

					</div>
				</div>
			</div>
		</>
	);
}