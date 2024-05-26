<!-- /BUZZER -->
<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		createBuzzHost,
		fetchBuzzHostByHostUUID,
		deleteBuzzHost
	} from '$lib/supabase/buzzerClient.js';
	import { setHostUUID, getHostUUID, deleteHostUUID, getDeletionTime } from '$lib/helper/buzzer';
	import { addToastMsgQue } from '$lib/store/globalStore';
	import { copyToClipboard } from '$lib/helper/global';
	import HostNameDisplay from '$lib/components/buzzer/HostNameDisplay.svelte';

	let fetchedHost = $state(null);
	let loading = true;
	let error = null;
	let host_uuid = $state(null);
	let hostNameInput = $state(null);
	let joinURL = $state(null);

  $effect(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    const baseURL = isLocalhost ? 'http://localhost:5173' : `http://${window.location.hostname}`;
    joinURL = `${baseURL}/buzzer/join/${fetchedHost?.uuid}`;
  });

	function saveUUID() {
		setHostUUID(host_uuid);
		host_uuid = getHostUUID();
		// addToastMsgQue("UUID saved successfully!");
	}

	function removeUUID() {
		deleteHostUUID();
		host_uuid = getHostUUID();
		addToastMsgQue('UUID deleted successfully!');
	}

	// Function to create a buzz host
	async function handleCreateBuzzHost() {
		try {
			const newHost = await createBuzzHost(hostNameInput);
      fetchedHost = newHost[0]
			host_uuid = newHost[0].host_uuid;
			hostNameInput = ""
			addToastMsgQue('Buzz host created successfully!');
			saveUUID();
		} catch (error) {
			addToastMsgQue(`Error creating buzz host: ${error.message}`);
		}
	}

	// Function to get a buzz host
	async function handleGetBuzzHost() {
		try {
			let data = await fetchBuzzHostByHostUUID(host_uuid);
			fetchedHost = data[0];
			addToastMsgQue('Buzz host fetched successfully!');
			// console.log(fetchedHost);
		} catch (error) {
			addToastMsgQue(`Error fetching buzz host: ${error.message}`);
		}
	}

	// Function to delete a buzz host
	async function handleDeleteBuzzHost() {
		try {
			await deleteBuzzHost(host_uuid);
			host_uuid = '';
			fetchedHost = null;
			addToastMsgQue('Buzz host deleted successfully!');
			saveUUID();
		} catch (error) {
			addToastMsgQue(`Error deleting buzz host: ${error.message}`);
		}
	}




	onMount(async () => {
		host_uuid = getHostUUID();
		(await host_uuid) ? handleGetBuzzHost() : '';

	});
</script>



<div class="flex items-center justify-center h-full-content">
	<div class="grid grid-cols-2 gap-4">
		<div class=" col-span-2 md:col-span-1 flex flex-col justify-between bg-primary rounded-md p-2">
			<div class="font-semibold p-3">HOST Buzz Game</div>

			{#if !host_uuid}
				<div class="flex justify-center">
					<input
						type="text"
						placeholder="Type host name to dispay"
						class="input input-bordered w-full m-4"
						bind:value={hostNameInput}
					/>
				</div>
				<div class="flex justify-end">
					<button
						disabled={!hostNameInput}
						class="btn btn-md btn-primary mt-4"
						onclick={() => handleCreateBuzzHost()}>Create a game</button
					>
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center flex-wrap gap-2 p-2">
					<div class="flex justify-center items-end">
						{#if fetchedHost }
						<HostNameDisplay hostData={fetchedHost}}/>
						{/if}
					</div>
					<!-- <div class="flex"> 
						This game will automatically deleted at {getDeletionTime(fetchedHost?.created_at)}
					</div>
					<div>

						Or you can delete it now 
						<button
		class="btn btn-base-200 btn-xs"
		onclick={() => {
			deleteBuzzHostModal.showModal();
		}}>🗑️</button -->
	>
					<!-- </div> -->
				

				</div>
				<div class="flex justify-end gap-2">
					<button
						class="btn btn-accent"
						onclick={() => window.open(`buzzer/host/${fetchedHost.host_uuid}`, '_blank')}
						>Buzz room</button
					>
				</div>
				<!-- <dialog id="deleteBuzzHostModal" class="modal">
					<div class="modal-box">
						<h3 class="font-bold text-lg">Are you sure you want to delete a hosted game?</h3>

						<div class="modal-action">
							<form method="dialog">
								<button
									class="btn btn-md my-2 btn-error mr-3"
									onclick={() => handleDeleteBuzzHost()}>Delete this host</button
								>
								<button class="btn">Cancel</button>
							</form>
						</div>
					</div>
				</dialog> -->
			{/if}
		</div>

		<div class="col-span-2 md:col-span-1 justify-between bg-primary rounded-md p-2">
			<div class="font-semibold p-3">JOIN Buzz Button</div>
			{#if host_uuid}
				{#if joinURL}
					<p class="flex justify-center">👇Share this Join URL with your team👇</p>
					<div class="border-2 mt-2 p-2 flex flex-row items-center">
						<a
							class="text-blue-500 hover:text-blue-700 text-xs"
							target="_blank"
							rel="noopener noreferrer"
							href={joinURL}>{joinURL}</a
						>
						<button class="btn btn-sm btn-info ml-2" onclick={() => copyToClipboard(joinURL)}
							>Copy</button
						>
					</div>
				{/if}
			{:else}
				<p class="flex justify-center my-4">Ask host the Join URL 😊</p>
				<div></div>
			{/if}
		</div>
	</div>
</div>
