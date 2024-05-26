import { fetchBuzzHostByHostUUID, fetchBuzzUsers, fetchBuzzedUsers } from '$lib/supabase/buzzerClient.js';
import { redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').PageLoad}
 */
export async function load({ params }) {

	try {
		const { host_uuid } = params; // Destructure uuid from params

		const dataBuzzHost = await fetchBuzzHostByHostUUID(host_uuid); // Pass uuid to fetchBuzzHostByHostUUID
    const buzzHost = dataBuzzHost[0]


    const buzzUsers = await fetchBuzzUsers(buzzHost.uuid); // Fetch buzz users data

		const buzzGame = await fetchBuzzedUsers(buzzHost.uuid); 

		return {
			props: {
				buzzHost,
        buzzUsers,
				buzzGame,
			}
		};
	} catch (error) {
		console.error('Error fetching buzz host:', error.message);
		throw redirect(302, '/buzzer');

		// return {
		// 	status: 500,
		// 	error: {
		// 		message: 'Internal Server Error'
		// 	}
		// };
	}
}

