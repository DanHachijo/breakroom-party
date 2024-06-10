<!-- /BUZZER -->
<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import HostNameDisplay from '$lib/components/buzzer/HostNameDisplay.svelte';
	// import JoinUrlDisplay from '$lib/components/buzzer/JoinURLDisplay.svelte';
	import { hostDataMgr } from '$lib/helper/buzzerStore.svelte';
	import { getUUIDByPass } from '$lib/supabase/buzzerClient.js';
  import { toastMgr } from '$lib/helper/toastStore.svelte';

	let isHostUUID = $derived(Boolean(hostDataMgr?.hostData?.host_uuid));
	let isLoading = $state(true);

	let hostNameInput = $state(null);

	let digits = $state(['', '', '', '', '', '', '', '']);
	let isJoinBtnEnabled = $derived(digits.every(digit => digit !== ''))



	function createPassObject() {
		const pass = digits.join('');
		if (pass.length === 8) {
			return pass;
		}
		return null;
	}

	async function jumpToGuestPage() {
		let pass = createPassObject();
		try {
			const response = await getUUIDByPass(pass);
			let uuid = response.uuid;
			goto(`buzzer/join/${uuid}`);
		} catch (error) {
			console.error(error.message);
			toastMgr.addToastMsgQue("Invalid JOIN PASS", 'alert-warning');

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

<div class="min-h-[92vh] flex flex-col justify-center">
	<div class="grid grid-cols-2 gap-4 p-2">
		<div
			class=" col-span-2 lg:col-span-1 flex flex-col justify-between bg-slate-700 rounded-md p-2 hover-scale"
		>
			<div class="font-semibold p-3 text-4xl text-accent">HOST GMAE</div>
			<div class="p-3 text-slate-50">
				<p>Hosts can:</p>
				<ul>
					<li class="text-sm">- See who pressed the buzzer button.</li>
					<li class="text-sm">- Assign participants a score of 1 or higher.</li>
					<li class="text-sm">- Delete participants from the game.</li>
					<li class="text-sm">- Clear the game and move to the next one.</li>
				</ul>
			</div>
			{#if isLoading}
				<div class="flex justify-center min-h-56">
					<span class="loading loading-dots loading-md text-slate-50"></span>
				</div>
			{:else if !isHostUUID}
				<div class="flex justify-center">
					<input
						type="text"
						placeholder="Type host name to dispay"
						class="input input-bordered w-full m-4"
						bind:value={hostNameInput}
						maxlength="36"
					/>
				</div>
				
					<button
						disabled={!hostNameInput}
						class="btn btn-md btn-accent mt-4 btn-outline"
						onclick={() => hostDataMgr.createBuzzHostDB(hostNameInput) && (hostNameInput = '')}
						>Create a game</button
					>
				
			{:else}
				{#if hostDataMgr.hostData}
					<HostNameDisplay isShowHostDelete={true} isShowJoinPass={true} />
				{/if}
				<button
					class="btn btn-accent mt-2 font-bold"
					onclick={() => goto(`buzzer/host/${hostDataMgr.hostData.host_uuid}`)}>HOST</button
				>
			{/if}
		</div>

		<div
			class="col-span-2 lg:col-span-1 flex flex-col justify-between bg-slate-700 rounded-md p-2 hover-scale"
		>
			<div class="font-semibold p-3 text-4xl text-accent">JOIN GAME</div>
			<div class="text-slate-50">
				<p>Participants can:</p>
				<ul>
					<li class="text-sm">- Press the button when you know the answer.</li>
					<li class="text-sm">- The button will be locked once you press.</li>
					<li class="text-sm">- Only the host can reset your locked button.</li>
					<li class="text-sm">- Delete your user when it's done.</li>
				</ul>
			</div>
			<div>
				<div class="  bg-slate-200 p-2 py-6 rounded-md flex flex-col items-center">
					<div class="">
						<div class="font-bold text-sm ml-1">JOIN PASS</div>
						<div class="flex flex-wrap justify-center text-slate-950">
							{#each digits as digit, index}
								<input
									type="text"
									class="input w-9 h-10 m-1 text-sm input-sm text-center"
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
					</div>
				</div>
				<div class="flex flex-col">
					<button class="btn btn-md {isHostUUID ? 'btn-outline' : '' }  btn-accent font-bold mt-2" onclick={jumpToGuestPage} disabled={!isJoinBtnEnabled}
						>JOIN</button
					>
				</div>
			</div>
		</div>
	</div>

	<div class="col-span-2">
		<ul class="text-gray-700 p-2">
			<li>
				- All host data, user data, and game scores are automatically deleted from the database
				approximately 3 hours after creation.
			</li>
			<li>- Please refrain from entering any sensitive information.</li>
			<li>
				- The site owner disclaims responsibility for any consequences arising from the use of this
				site.
			</li>
		</ul>
	</div>
</div>
