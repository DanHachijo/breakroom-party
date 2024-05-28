import { fetchBuzzHostByUUID } from '$lib/supabase/buzzerClient.js';
import { redirect } from '@sveltejs/kit';

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
		throw redirect(302, '/buzzer');
	}
}
