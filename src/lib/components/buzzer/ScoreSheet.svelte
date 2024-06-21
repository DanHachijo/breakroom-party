<script>
	import UserInfoDisplay from '$lib/components/buzzer/UserInfoDisplay.svelte';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { fly  } from 'svelte/transition';

	let { usersData = [] , isShowUserDelete = false, winUserId } = $props();

	let isHideScoreSheet = $state(false);

	let sortedUsersByWinNum = $derived([...usersData].sort((a, b) => b.win_num - a.win_num));

	function toggleScoreSheet() {
		isHideScoreSheet = !isHideScoreSheet;
	}
</script>

<div class="flex justify-center items-center gap-4 mt-4 lg:mt-6">
	{#if sortedUsersByWinNum.length == 0}
		<div class="flex justify-center mt-8 mb-4 font-bold">Waiting Users to join...</div>
	{:else}
		<h5>SCORE SHEET</h5>
		<button class="btn btn-xs" onclick={toggleScoreSheet}>
			{#if isHideScoreSheet}
				<EyeOff size={18} />
			{:else}
				<Eye size={18} />
			{/if}
		</button>
	{/if}
</div>

{#if isHideScoreSheet}
	<div class="" transition:fly={{ y: -10, duration: 200 }}>
		{#each sortedUsersByWinNum as user (user.id)}
			<UserInfoDisplay
				{winUserId}
				userId={user.id}
				userName={user.name}
				winNum={user.win_num}
				uuid={user.fk_uuid}
        isShowUserDelete={isShowUserDelete}
			/>
		{/each}
	</div>
{/if}
