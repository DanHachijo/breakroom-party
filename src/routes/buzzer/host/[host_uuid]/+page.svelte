<!-- HOST/HOST_UUID -->
<script>
	import { onMount } from 'svelte';
	import { calculateTimeDifference } from '$lib/helper/buzzer';
	import {
		clearAllBuzzedUsers,
		subscribeGameUsers,
		fetchBuzzedUsers,
		subscribeToBuzzUsers,
		fetchBuzzUsers,
		updateWinCount,
		deleteBuzzUser
	} from '$lib/supabase/buzzerClient.js';
	import { toastMgr } from '$lib/helper/toastStore.svelte';
	import JSConfetti from 'js-confetti';
	import HostNameDisplay from '$lib/components/buzzer/HostNameDisplay.svelte';
	// import JoinUrlDisplay from '$lib/components/buzzer/JoinURLDisplay.svelte';
	import { hostDataMgr } from '$lib/helper/buzzerStore.svelte';
	import UserInfoDisplay from '$lib/components/buzzer/UserInfoDisplay.svelte';
	let jsConfetti;

	let { data } = $props();
	hostDataMgr.updateData(data.props.buzzHost);

	let buzzHost = $state(data.props.buzzHost);
	let Users = $state(data.props.buzzUsers);
	let buzzGame = $state(data.props.buzzGame);
	let gameUsers = $state([]);
	const uuid = data.props.buzzHost.uuid;

	// SCORE BOARD
	let activeUserIndex = $state(0);
	let isBtnDisabled = $state(false);
	let winUserId = $state(null);
	let scoreNum = $state(1);
	let sortedUsersByWinNum = $state([]);

	$effect(() => {
		sortedUsersByWinNum = [...Users].sort((a, b) => b.win_num - a.win_num);
	});

	$effect(() => {
		const sortedGameUsers = [...buzzGame].sort(
			(a, b) => new Date(a.created_at) - new Date(b.created_at)
		);
		gameUsers = sortedGameUsers;
	});

	async function updateGameUsers() {
		try {
			buzzGame = await fetchBuzzedUsers(uuid);
		} catch (error) {
			console.error('Error fetching users:', error.message);
		}
	}

	async function resetGame() {
		try {
			await clearAllBuzzedUsers(uuid);
			activeUserIndex = 0;
			winUserId = null;
			isBtnDisabled = false;
			toastMgr.addToastMsgQue('Game is reset', 'alert-info');
		} catch (error) {
			console.error('Error reset game:', error.message);
		}
	}

	async function updateUsers() {
		try {
			Users = await fetchBuzzUsers(uuid);
		} catch (error) {
			console.error('Error fetching users:', error.message);
		}
	}

	async function answerCorrect(userID, win_num) {
		try {
			isBtnDisabled = true;
			await updateWinCount(userID, win_num, uuid);
			triggerConfetti();
			winUserId = userID;
		} catch (error) {
			console.error('Error incrementing win_num:', error.message);
		}
	}

	// fetchBuzzedUsers(uuid);
	function triggerConfetti() {
		jsConfetti.addConfetti({
			emojiSize: 100,
			confettiNumber: 30,
			emojis: ['🚀', '⭐', '💥', '✨', '🌎', '😊']
		});
	}

	onMount(async () => {
		subscribeGameUsers(uuid, updateGameUsers);
		subscribeToBuzzUsers(uuid, updateUsers);
		jsConfetti = new JSConfetti();
	});
</script>

<div class="flex flex-col justify-between h-full-content">
	<div id="host-name-section" class=" flex justify-center pt-2">
		<HostNameDisplay isShowHostDelete={true} />
	</div>

	<div
		id="buzzed-display-section"
		class="flex overflow-auto min-h-40 justify-center items-start pt-3 w-full py-3"
	>
		{#if gameUsers.length === 0}
			<div class="flex flex-col flex-wrap justify-center items-center text-pretty mx-4">
				<div class="font-bold text-4xl py-5">
					Welcome to <span class="text-red-600">Buzz</span> Game
				</div>
				<div class=" text-base">Press the red button 🔴 after the host's announcement...</div>
				<div class="py-4">
					<!-- <JoinUrlDisplay {uuid} /> -->
				</div>
			</div>
		{/if}
		<div class="flex flex-col gap-2">
			{#each gameUsers as gameUser, index (gameUser.id)}
				<div class="relative">
					<button
						class=" flex gap-2 p-2 m-3 min-w-64 jello-horizontal justify-between items-center w-full cursor-pointer rounded-lg {isBtnDisabled
							? 'opacity-60'
							: ''} {activeUserIndex == index
							? 'border-2 border-indigo-500/50  bg-indigo-200 shadow-md opacity-100'
							: ''}
          {activeUserIndex > index ? 'bg-slate-600' : ''}
          
          {activeUserIndex < index ? 'bg-pink-200' : ''}
          "
						onclick={() => (activeUserIndex = index)}
					>
						<div
							class=" absolute -top-3 -left-3 badge {activeUserIndex > index
								? 'badge-neutral'
								: 'badge-accent '}
            "
						>
							{index + 1}
						</div>
						{#if winUserId == gameUser.fk_buzzed_user}
							<span
								class="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
							>
								🎉
							</span>
						{/if}
						<div class="flex flex-col">
							<p
								class="font-bold text-xl overflow-hidden overflow-ellipsis whitespace-nowrap max-w-64"
							>
								{gameUser.name}
							</p>
							<div class="flex justify-start">
								<p class="text-gray-500 text-xs">
									id:{gameUser.fk_buzzed_user}
								</p>
							</div>
						</div>
						<div class="p-2 bg-slate-100 rounded-sm {activeUserIndex > index ? 'opacity-50' : ''}">
							{#if index === 0}
								<div class="flex flex-col -rotate-12">
									<div class="font-semibold">FIRST</div>
									<div class="text-gray-500 text-xs">buzz</div>
								</div>
							{/if}

							{#if index > 0}
								<div class="flex flex-col -rotate-12">
									<div class="font-semibold">
										{calculateTimeDifference(gameUsers[0].created_at, gameUser.created_at)}
									</div>
									<div class="text-gray-500 text-xs">sec gap</div>
								</div>
							{/if}
						</div>
					</button>
					<div>
						{#if activeUserIndex == index}
							{#each Users as user (user.id)}
								{#if user.id === gameUser.fk_buzzed_user}
									<div class=" absolute inset-0 flex items-center justify-end">
										{#if !isBtnDisabled}
											<div class="flex shadow-lg jello-horizontal">
												<button
													class="btn btn-md btn-accent rounded-none rounded-l-lg font-bold"
													disabled={isBtnDisabled}
													onclick={() =>
														answerCorrect(gameUser.fk_buzzed_user, user.win_num + scoreNum)}
													>+{scoreNum}🎉</button
												>
												<div class="flex flex-col min-w-6">
													<button
														disabled={isBtnDisabled}
														class="btn btn-xs rounded-none rounded-tr-lg btn-success"
														onclick={() => scoreNum++}>+</button
													>
													<button
														class="btn btn-xs rounded-none rounded-br-lg btn-success"
														onclick={() => (scoreNum >= 2 ? scoreNum-- : '')}
														disabled={scoreNum == 1 || isBtnDisabled}>-</button
													>
												</div>
											</div>
										{/if}
									</div>
								{/if}
							{/each}
						{/if}
					</div>
				</div>
			{/each}
			{#if gameUsers.length !== 0}
				<div
					class={isBtnDisabled
						? 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 gap-2'
						: 'flex justify-center'}
				>
					<button
						class="btn {isBtnDisabled ? 'btn-lg' : 'btn-md'} btn-accent shadow-lg"
						onclick={resetGame}>NEXT GAME</button
					>
					{#if isBtnDisabled}
						<button
							class="btn btn-lg btn-accent btn-outline shadow-lg"
							onclick={() => {
								isBtnDisabled = false;
							}}>BACK</button
						>
					{/if}
				</div>
			{/if}
		</div>
	</div>
	{#if sortedUsersByWinNum.length == 0 }
		<div class="flex justify-center mb-4 font-bold">Waiting Users to join...</div>
	{:else}
		<div class="flex justify-center mb-4 font-bold">⬇️ Score Sheet ⬇️</div>
	{/if}
</div>

<div
	id="joined-user-section"
	class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:lg:grid-cols-6"
>
	{#each sortedUsersByWinNum as user (user.id)}
		<UserInfoDisplay
			{winUserId}
			userId={user.id}
			userName={user.name}
			winNum={user.win_num}
			uuid={buzzHost.uuid}
		/>
	{/each}
</div>
