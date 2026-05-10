"use client";

import Link from "next/link";

export default function ErrorCard() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6">
			<div className="w-full max-w-md">
				<div className="
					rounded-2xl border border-red-500/30 
					bg-gray-900/80 backdrop-blur-md 
					p-8 text-center
					shadow-lg shadow-red-900/20
				">
					<h2 className="text-2xl font-semibold text-white mb-2">
						No Surveys Found
					</h2>
					<p className="text-gray-400 text-sm mb-6">
						We couldn’t find any surveys to display. Try creating one or check back later.
					</p>

					<Link href="/">
						<button className="
							px-5 py-2.5 rounded-xl
							bg-red-600/70 text-white text-sm font-medium
							border border-red-500/40
							transition-all duration-200
							hover:bg-red-600 hover:shadow-lg hover:shadow-red-900/30
							active:scale-95
						">
							Go Back Home
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}