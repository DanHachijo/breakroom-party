<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		createBuzzHost,
		fetchBuzzHostByHostUUID,
		deleteBuzzHost
	} from '$lib/supabase/buzzerClient.js';
	import { setHostUUID, getHostUUID, deleteHostUUID } from '$lib/helper/buzzer';
	import { addToastMsgQue } from '$lib/store/globalStore';
	import { copyToClipboard } from '$lib/helper/global';

	let fetchedHost = $state(null);
	let loading = true;
	let error = null;
	let host_uuid = $state(null);
	let hostNameInput = $state(null);
	let joinURL = $state(null);

	$effect(() => {
		joinURL = `http://${window.location.hostname}:5173/buzzer/join/${fetchedHost?.uuid}`;
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
		// console.log(host_uuid)
		// fetchBuzzHost(host_uuid)
	});
</script>

<!-- host_uuid{host_uuid}

<input
	type="text"
	placeholder="Type host name to dispay"
	class="input input-bordered w-full m-4"
	bind:value={hostNameInput}
/>
<button disabled={!hostNameInput} class="btn btn-md btn-primary mt-4" onclick={handleCreateBuzzHost}
	>Create a game</button
>
<button onclick={handleDeleteBuzzHost}>DELETE</button>

{#if fetchedHost}
	fetchedHost
	{fetchedHost.name}
{/if} -->

<div class="flex items-center justify-center h-full-content">
	<div class="grid grid-cols-2 gap-4">
		<div class=" col-span-2 md:col-span-1 flex flex-col justify-between bg-success rounded-md p-2">
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
				<div class="flex items-center justify-center flex-wrap gap-2 p-2">
					<span class=" text-base">host name: </span>
					<span class="text-xl font-extrabold">{fetchedHost?.name}</span>
				</div>

				<div class="flex justify-end gap-2">
					<button
						class="btn btn-accent"
						onclick={() => window.open(`buzzer/host/${fetchedHost.host_uuid}`, '_blank')}
						>Buzz room</button
					>
					<button
						class="btn btn-base-200"
						onclick={() => {
							deleteBuzzHostModal.showModal();
						}}>🗑️</button
					>
				</div>
				<dialog id="deleteBuzzHostModal" class="modal">
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
				</dialog>
			{/if}
		</div>

		<div class="col-span-2 md:col-span-1 justify-between bg-info rounded-md p-2">
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
