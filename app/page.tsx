"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
	const router = useRouter();

	//connect this state variable to an auth system to configure "Create a New Survey" availability
	const [auth, setAuth] = useState<boolean>(true);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6">
			<div className="flex flex-col gap-4 w-full max-w-md bg-gray-850/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8">
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-semibold text-white tracking-wide">
						Scheels Learning Library
					</h1>
					<p className="text-sm text-gray-400 mt-1">
						Employee Training
					</p>
				</div>

				<button
					onClick={() => router.push("/surveysClient")}
					className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-200 text-white font-medium shadow-lg hover:shadow-red-900/40 active:scale-[0.98]"
				>
					Go to Surveys
				</button>

				{auth && 
					<button
						onClick={() => router.push("/surveyBuilderClient")}
						className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-200 text-white font-medium shadow-lg hover:shadow-red-900/40 active:scale-[0.98]"
					>
						Create a New Survey
					</button>
				}

				<div className="mt-6 text-center text-xs text-gray-500">
					© {new Date().getFullYear()} Scheels Employee Training
				</div>
			</div>
		</div>
	);
}
