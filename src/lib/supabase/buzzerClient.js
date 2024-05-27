import { supabase } from './client';

// Helper function for error handling
async function executeSupabaseQuery(promise) {
	const { data, error } = await promise;
	if (error) throw error;
	return data;
}

// HOST TABLE

export function fetchBuzzHostByUUID(uuid) {
	return executeSupabaseQuery(supabase.from('buzz_host').select().eq('uuid', uuid));
}

export function fetchBuzzHostByHostUUID(uuid) {
	return executeSupabaseQuery(supabase.from('buzz_host').select().eq('host_uuid', uuid));
}

export function createBuzzHost(hostName) {
	return executeSupabaseQuery(
		supabase
			.from('buzz_host')
			.insert([{ name: hostName }])
			.select()
	);
}

export function deleteBuzzHost(uuid) {
	return executeSupabaseQuery(supabase.from('buzz_host').delete().eq('uuid', uuid));
}

export function deleteBuzzHostByHostUUID(host_uuid) {
	return executeSupabaseQuery(supabase.from('buzz_host').delete().eq('host_uuid', host_uuid));
}

// USER TABLE

export function fetchBuzzUser(userID, uuid) {
	return executeSupabaseQuery(
		supabase.from('buzz_users').select().eq('fk_uuid', uuid).eq('id', userID)
	);
}

export function addBuzzUser(formState) {
	return executeSupabaseQuery(
		supabase
			.from('buzz_users')
			.insert([{ fk_uuid: formState.uuid, name: formState.name }])
			.select()
	);
}

export function deleteBuzzUser(userID, uuid) {
	return executeSupabaseQuery(
		supabase.from('buzz_users').delete().eq('fk_uuid', uuid).eq('id', userID)
	);
}

// GAME TABLE

export function handleBuzzButtonClick(userID) {
	return executeSupabaseQuery(
		supabase
			.from('buzz_game')
			.insert([{ fk_buzzed_user: userID }])
			.select()
	);
}

export function fetchBuzzedUsers(uuid) {
	return executeSupabaseQuery(supabase.from('buzz_game').select().eq('fk_uuid', uuid));
}

export function clearAllBuzzedUsers(uuid) {
	return executeSupabaseQuery(supabase.from('buzz_game').delete().eq('fk_uuid', uuid));
}

export async function checkBuzzBtnExistence(userID) {
	try {
		const buzz_game = await executeSupabaseQuery(
			supabase.from('buzz_game').select('*').eq('fk_buzzed_user', userID).single()
		);
		return buzz_game.id;
	} catch (error) {
		// console.log(error.message)
		return null;
	}
}

export function subscribeToBuzzBtnUnlock(userID, buzz_game_id, unlockFunc) {
	const channelName = `buzz_game_user_${userID}`;
	const filter = `fk_buzzed_user=eq.${userID}`;
	supabase
		.channel(channelName)
		.on(
			'postgres_changes',
			{ event: '*', schema: 'public', table: 'buzz_game', filter },
			(payload) => {
				if (payload.eventType === 'DELETE' && payload.old.id === buzz_game_id) {
					unlockFunc();
					console.log('Weeee');
				}
			}
		)
		.subscribe();
}

export function subscribeToUserDelete(userID, callback ) {
	const channelName = `game_user_${userID}`;
	const filter = `id=eq.${userID}`;
	supabase
		.channel(channelName)
		.on(
			'postgres_changes',
			{ event: '*', schema: 'public', table: 'buzz_users', filter },
			(payload) => {
				if (payload.eventType === 'DELETE' && payload.old.id === userID) {
					callback()
				}
			}
		)
		.subscribe();
}

export function subscribeToUserWinNum(userID, callback) {
  const channelName = `game_user_${userID}`;
  const filter = `id=eq.${userID}`;
  supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'buzz_users', filter },
      (payload) => {
        if (payload.eventType === 'UPDATE' && payload.new && payload.new.win_num !== undefined) {
          callback(payload.new);
        }
      }
    )
    .subscribe();
}

// // HOST
export function fetchBuzzUsers(uuid) {
	return executeSupabaseQuery(supabase.from('buzz_users').select('*').eq('fk_uuid', uuid));
}

export async function subscribeGameUsers(uuid, callback) {
	try {
		const channelName = `buzzed_users`;
		const filter = `fk_uuid=eq.${uuid}`;
		supabase
			.channel(channelName)
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'buzz_game', filter: filter },
				async (payload) => {
					console.log("Change received in buzzed_users!", payload);
					await callback();
				}
			)
			.subscribe();
	} catch (error) {
		console.error('Error checking row existence:', error.message);
	}
}

export function subscribeToBuzzUsers(uuid, callback) {
  const filter = `fk_uuid=eq.${uuid}`;

  supabase.channel(`buzz_game_users`)
    .on("postgres_changes", { event: "*", schema: "public", table: "buzz_users", filter }, async () => {
      await callback(uuid);
    })
    .subscribe();
}

export function updateWinCount(userId, win_num, uuid) {
  return executeSupabaseQuery(supabase.from("buzz_users").update({ win_num }).eq("id", userId).eq("fk_uuid", uuid).select());
}
