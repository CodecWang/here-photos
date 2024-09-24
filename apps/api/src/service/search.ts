import axios from 'axios';

export const client = axios.create({
	baseURL: process.env.SEARCH_ENDPOINT || 'http://127.0.0.1:8000',
});

export async function search(q: string): Promise<number[]> {
	try {
		const res = await client.get<{ data: number[] }>('/search', { params: { q } });
		return res.data.data;
	} catch (err) {
		console.error(err);
		return [];
	}
};
