"use client";

import { Survey } from "@/lib/types";
import Link from "next/link";

export default function SurveyCard({ survey }: { survey: Survey }) {
	return (
		<Link href={`/chatClient?surveyID=${survey.formid}`}>
			<div className="group cursor-pointer rounded-xl border border-gray-700 bg-gray-800/60 p-5 transition-all duration-200 hover:border-red-500/50 hover:bg-gray-800 hover:shadow-lg hover:shadow-red-900/20 active:scale-[0.99]">

				<div className="flex items-center gap-4">
					<div className="text-3xl transition-transform duration-200 group-hover:scale-110">
						📋
					</div>

					<div>
						<h2 className="text-lg font-medium text-white group-hover:text-red-400 transition">
							{survey.formName}
						</h2>
						<p className="text-sm text-gray-400">
							Click to open survey
						</p>
					</div>
				</div>

			</div>
		</Link>
	);
}