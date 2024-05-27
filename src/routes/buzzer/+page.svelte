<!-- /BUZZER -->
<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import HostNameDisplay from '$lib/components/buzzer/HostNameDisplay.svelte';
	import JoinUrlDisplay from '$lib/components/buzzer/JoinURLDisplay.svelte';
	import { hostDataMgr } from '$lib/helper/buzzerStore.svelte';

	let isHostUUID = $derived(Boolean(hostDataMgr?.hostData?.host_uuid));
	let isLoading = $state(true);

	let hostNameInput = $state(null);


	onMount(async () => {
		if (hostDataMgr.getHostUUIDFromLocalStorage()) {
			await hostDataMgr.fetchtBuzzHostFromDB();
		}
		isLoading = false;
	});
</script>

<div class="flex items-center justify-center h-full-content">
	<div class="grid grid-cols-2 gap-4">
		<div class=" col-span-2 md:col-span-1 flex flex-col justify-between bg-primary rounded-md p-2">
			<div class="font-semibold p-3">Are you hosting the game?</div>

			{#if !isHostUUID || isLoading}
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
						class="btn btn-md btn-accent mt-4"
						onclick={() => hostDataMgr.createBuzzHostDB(hostNameInput) && (hostNameInput = '')}
						>Create a game</button
					>
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center flex-wrap gap-2 p-2">
					<div class="flex justify-center items-end">
						{#if hostDataMgr.hostData}
							<HostNameDisplay isShowHostDelete={true} />
						{/if}
					</div>
				</div>
					<button
						class="btn btn-accent"
						onclick={() => window.open(`buzzer/host/${hostDataMgr.hostData.host_uuid}`, '_blank')}
						>Buzz room</button
					>
			{/if}
		</div>

		<div class="col-span-2 md:col-span-1 flex flex-col justify-between bg-primary rounded-md p-2">
			<div class="font-semibold p-3">Are you joining the game?</div>
			{#if !isHostUUID || isLoading}
				<p class="flex justify-center my-4">Ask host the Join URL 😊</p>
				<div></div>
			{:else }
			<JoinUrlDisplay uuid={hostDataMgr?.hostData?.uuid}/>
			<div></div>
			<div></div>
			{/if}
		</div>
	</div>
</div>
