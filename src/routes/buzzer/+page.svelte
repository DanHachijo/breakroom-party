<!-- /BUZZER -->
<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import HostNameDisplay from '$lib/components/buzzer/HostNameDisplay.svelte';
	import JoinUrlDisplay from '$lib/components/buzzer/JoinURLDisplay.svelte';
	import { hostDataMgr } from '$lib/helper/buzzerStore.svelte';
	import { getUUIDByPass } from '$lib/supabase/buzzerClient.js';

	let isHostUUID = $derived(Boolean(hostDataMgr?.hostData?.host_uuid));
	let isLoading = $state(true);

	let hostNameInput = $state(null);

	let digits = $state(['', '', '', '', '', '', '', '']);

	function createPassObject() {
		const pass = digits.join('');
		if (pass.length === 8) {
			return pass
		}
		return null;
	}

	async function jumpToGuestPage() {
		let pass = createPassObject();
		console.log(pass);
		try {
			const response = await getUUIDByPass(pass);
			let uuid = response.uuid
			goto(`buzzer/join/${uuid}`)
		} catch (error) {
			console.error(error.message);
		}
		getUUIDByPass();
	}

	function focusNextInput(index) {
		const nextInputIndex = index === digits.length - 1 ? index : index + 1;
		const nextInput = document.querySelector(`#input-${nextInputIndex}`);
		if (nextInput) {
			nextInput.focus();
		}
	}

	function highlightInput(event) {
    if (event.target.value) {
      event.target.select();
    }
  }


	onMount(async () => {
		if (hostDataMgr.getHostUUIDFromLocalStorage()) {
			await hostDataMgr.fetchtBuzzHostFromDB();
		}
		isLoading = false;
	});
</script>

<div class="flex items-center justify-center mt-4">
	<div class="grid grid-cols-2 gap-4 p-2">
		<div
			class=" col-span-2 md:col-span-1 flex flex-col justify-between border-4 border-primary bg-slate-100 rounded-md p-2 hover-scale"
		>
			<div class="font-semibold p-3 text-xl md:text-2xl">Host the game?</div>
			<div class="p-3">
				<p>Hosts can:</p>
				<ul>
					<li class="text-sm">- See who pressed the buzzer button.</li>
					<li class="text-sm">- Assign participants a score of 1 or higher.</li>
					<li class="text-sm">- Delete participants from the game.</li>
					<li class="text-sm">- Clear the game and move to the next one.</li>
				</ul>
			</div>
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
					class="btn btn-primary"
					onclick={() => goto(`buzzer/host/${hostDataMgr.hostData.host_uuid}`)}>Buzz room</button
				>
			{/if}
		</div>

		<div
			class="col-span-2 md:col-span-1 flex flex-col justify-between bg-primary rounded-md p-2 hover-scale"
		>
			<div class="font-semibold p-3 text-xl md:text-2xl text-slate-50">Join the game?</div>
			<div class="p-3 text-slate-50">
				<p>Participants can:</p>
				<ul>
					<li class="text-sm">- Press the button when you know the answer.</li>
					<li class="text-sm">- The button will be locked once you press.</li>
					<li class="text-sm">- Only the host can reset your locked button.</li>
					<li class="text-sm">- Delete your user when it's done.</li>
				</ul>

				<div class="flex  text-slate-950">
					{#each digits as digit, index}
						<input
							type="text"
							class="input w-8 h-10   mx-1 text-sm input-sm  text-cente "
							bind:value={digits[index]}
							onfocus={highlightInput}
							oninput={(event) => {
								digits[index] = event.target.value.slice(0, 1);
								focusNextInput(index);
							}}
							id={`input-${index}`}
						/>
					{/each}
				</div>
				<button class="btn btn-sm" onclick={jumpToGuestPage}>Submit</button>
			</div>
			{#if !isHostUUID || isLoading}
				<p class="flex justify-center my-4 text-slate-50">Ask host for the Join URL 😊</p>
				<div></div>
			{:else}
				<JoinUrlDisplay uuid={hostDataMgr?.hostData?.uuid} />
				<div></div>
				<div></div>
			{/if}
		</div>
		<div class="col-span-2">
			<ul class="text-gray-400">
				<li>
					- All host data, user data, and game scores are automatically deleted from the database
					approximately 3 hours after creation.
				</li>
				<li>- Please refrain from entering any sensitive information.</li>
				<li>
					- The site owner disclaims responsibility for any consequences arising from the use of
					this site.
				</li>
			</ul>
		</div>
	</div>
</div>
