// buzzerlStore.js
import {
	createBuzzHost,
	fetchBuzzHostByHostUUID,
	deleteBuzzHostByHostUUID
} from '$lib/supabase/buzzerClient.js';
import { toastMgr } from '$lib/helper/toastStore.svelte';
import { goto } from '$app/navigation';

//

function createHostData() {
	let hostData = $state();

	let defaultObject = {
		id: null,
		name: null,
		uuid: null,
		host_uuid: null,
		created_at: ''
	};

	hostData = defaultObject;

	function updateData(newData) {
		hostData = newData;
	}

	function deleteData() {
		updateData(defaultObject);
	}

	async function createBuzzHostDB(hostNameInput) {
		try {
			const newHost = await createBuzzHost(hostNameInput);
			hostData = newHost[0];
			setHostUUIDToLocalStorage();
			console.log(hostData);
			toastMgr.addToastMsgQue('Buzz host created successfully!');
		} catch (error) {
			toastMgr.addToastMsgQue(`Error creating buzz host: ${error.message}`);
		}
	}

	// CRUD Buzz Host
	async function deleteBuzzHostFromDB() {
		try {
			console.log(hostData.host_uuid);
			await deleteBuzzHostByHostUUID(hostData.host_uuid);
			updateData(defaultObject);
			toastMgr.addToastMsgQue('Buzz host deleted successfully!');
			deleteHostUUIDFromLocalStorage();
			goto('/buzzer');
		} catch (error) {
			toastMgr.addToastMsgQue(`Error deleting buzz host: ${error.message}`);
		}
	}

	async function fetchtBuzzHostFromDB() {
		try {
			let data = await fetchBuzzHostByHostUUID(hostData.host_uuid);
			hostData = data[0];
			toastMgr.addToastMsgQue('Buzz host fetched successfully!');
		} catch (error) {
			toastMgr.addToastMsgQue(`Error fetching buzz host: ${error.message}`);
		}
	}

	function setHostUUIDToLocalStorage() {
		try {
			localStorage.setItem('host_uuid', hostData.host_uuid);
			console.log('host_uuid set successfully');
		} catch (error) {
			console.error('Error setting host_uuid:', error);
		}
	}

	function getHostUUIDFromLocalStorage() {
		try {
			const uuid = localStorage.getItem('host_uuid');
			if (uuid) {
				console.log(`host_uuid retrieved successfully: ${uuid}`);
				hostData.host_uuid = uuid;
				return uuid;
			} else {
				console.log('No host_uuid found');
				return null;
			}
		} catch (error) {
			console.error('Error getting host_uuid:', error);
			return null;
		}
	}

	function deleteHostUUIDFromLocalStorage() {
		try {
			localStorage.removeItem('host_uuid');
			console.log('host_uuid deleted successfully');
		} catch (error) {
			console.error('Error deleting host_uuid:', error);
		}
	}

	return {
		get hostData() {
			return hostData;
		},
		updateData,
		deleteData,

		createBuzzHostDB,
		deleteBuzzHostFromDB,
		fetchtBuzzHostFromDB,

		setHostUUIDToLocalStorage,
		getHostUUIDFromLocalStorage,
		deleteHostUUIDFromLocalStorage
	};
}
export const hostDataMgr = createHostData();
