import { fetchBuzzHostByUUID } from '$lib/supabase/buzzerClient.js';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ params }) {
	try {
		const { uuid } = params; 

		const dataBuzzHost = await fetchBuzzHostByUUID(uuid); // Pass uuid to fetchBuzzHostByHostUUID
    const buzzHost = dataBuzzHost[0]

		return {
			props: {
				buzzHost,
			}
		};
	} catch (error) {
		console.error('Error fetching buzz host:', error.message);
		return {
			status: 500,
			error: {
				message: 'Internal Server Error'
			}
		};
	}
}
