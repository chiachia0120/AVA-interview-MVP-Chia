'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Loading from './components/Loading';
import { notification } from './services/notification';

export default function Home() {
	const [answer, setAnswer] = useState('');
	const [feedback, setFeedback] = useState('');
	const [loading, setLoading] = useState(false);

	const submitAnswer = async () => {
		setLoading(true);
		try {
			if (!answer.trim()) {
				setFeedback('Please enter your answer.');
				return;
			}

			const res = await fetch('/api/gemini', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ answer }),
			});
			const data = await res.json();

			if (data.error || data.error?.code) {
				notification.error(
					data?.error.message || 'Something went wrong, please try again.'
				);
			} else {
				setFeedback(
					data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No feedback'
				);
				notification.success('Feedback received!');
			}
		} catch (err) {
			notification.error('API error, please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="p-8 max-w-xl mx-auto h-screen flex flex-col">
			<h1 className="text-2xl font-bold mb-4">Interview Question</h1>
			<p className="mb-4">Tell me about yourself.</p>

			<div className="flex-1 overflow-y-auto px-1">
				<textarea
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					className="w-full p-2 border rounded mb-4"
					rows={4}
					placeholder="Type your answer here..."
				/>

				{feedback && (
					<div className="px-4 py-2 border rounded bg-gray-50">
						<h2 className="font-semibold mb-2">AI Feedback</h2>
						<ReactMarkdown>{feedback}</ReactMarkdown>
					</div>
				)}
			</div>

			<div className="mt-4 flex gap-2">
				{!feedback ? (
					<button
						className={`px-4 py-2 border rounded ${
							!answer.trim()
								? 'bg-gray-200 text-gray-400 cursor-not-allowed'
								: 'hover:bg-gray-100'
						}`}
						onClick={submitAnswer}
						disabled={!answer.trim()}
					>
						Get Feedback
					</button>
				) : (
					<div className="flex gap-2">
						<button
							className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
							onClick={submitAnswer}
							disabled={loading}
						>
							Try Again
						</button>
						<button
							className="px-4 py-2 border border-gray-400 rounded hover:bg-red-100 text-red-600"
							onClick={() => {
								setAnswer('');
								setFeedback('');
							}}
						>
							Clear Answer
						</button>
					</div>
				)}

				{loading && <Loading />}
			</div>
		</main>
	);
}
