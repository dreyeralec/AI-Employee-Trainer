"use client";

import { Survey } from "@/lib/types";
import SurveyCard from "./surveyCard";
import ErrorCard from "./errorCard";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SurveysClient({ surveys }: { surveys: Survey[] }) {
	//State variable to hold the user's search
	const [query, setQuery] = useState<string>("");

	//if no surveys are found then display error component
	if (surveys.length === 0) {
		return <ErrorCard />
	}

	//filter the survey array based on the user's text input
	const filtered = surveys.filter((item) =>
		item.formName.toLowerCase().includes(query.toLowerCase())
	);

	return (
		<div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-10">
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

			<div className="max-w-4xl mx-auto mt-3 h-full flex flex-col min-h-0">
				<div className="mb-6">
					<h1 className="text-3xl font-semibold text-white tracking-wide">
						Select Survey
					</h1>
					<p className="text-gray-400 text-sm mt-1">
						Search and choose a survey to continue
					</p>
				</div>

				<div className="mb-6">
					<input
						type="search"
						placeholder="Search surveys..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="
							w-full rounded-xl bg-gray-800 
							border border-gray-700 text-white 
							placeholder-gray-400 px-4 py-3 focus:outline-none 
							focus:ring-2 focus:ring-red-500 focus:border-red-500 
							transition"
					/>
				</div>

				<div
					className="
						flex-1 min-h-0
						space-y-1 overflow-y-auto pr-2
						scroll-smooth rounded-xl"
					style={{ scrollbarGutter: "stable both-edges" }}
				>
					{filtered.length > 0 ? (
						filtered.map((survey, key) => (
							<div
								key={key + 1}
								className="rounded-xl p-4 hover:border-red-500/40 transition"
							>
								<SurveyCard survey={survey} />
							</div>
						))
					) : (
						<div className="text-center text-gray-400 py-10">
							No matching surveys found
						</div>
					)}
				</div>
			</div>
		</div>
	);
}