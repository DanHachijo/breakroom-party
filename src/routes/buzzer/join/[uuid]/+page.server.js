import { fetchBuzzHostByUUID, fetchBuzzUsers } from '$lib/supabase/buzzerClient.js';
import { redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ params }) {
	try {
		const { uuid } = params; 

		const dataBuzzHost = await fetchBuzzHostByUUID(uuid); // Pass uuid to fetchBuzzHostByHostUUID
    const buzzHost = dataBuzzHost[0]
    const buzzUsers = await fetchBuzzUsers(buzzHost.uuid); // Fetch buzz users data

		return {
			props: {
				buzzHost,
				buzzUsers
			}
		};
	} catch (error) {
		console.error('Error fetching buzz host:', error.message);
		throw redirect(302, '/buzzer');
	}
}
