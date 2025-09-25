import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { answer } = await req.json();

	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [
					{
						parts: [
							{ text: `Give feedback on this interview answer: ${answer}` },
						],
					},
				],
			}),
		}
	);

	const data = await response.json();
	return NextResponse.json(data);
}
