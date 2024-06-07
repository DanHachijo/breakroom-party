<script>
	import { onMount } from 'svelte';
	import { getDeletionTime } from '$lib/helper/buzzer';
	import { hostDataMgr } from '$lib/helper/buzzerStore.svelte';

	let { name, created_at, host_uuid, id, uuid, pass } = hostDataMgr.hostData || {};

	let { isShowHostDelete = false, isShowJoinPass } = $props();

	let isShowPass = $state(false);

	function toggleIsShowPass() {
		isShowPass = !isShowPass;
	}

	onMount(() => {
		isShowJoinPass ? (isShowPass = true) : '';
	});
</script>

<div class="flex flex-col p-2 rounded-md bg-slate-200 gap-3">
	<div class="flex flex-wrap justify-center items-end p-2 gap-1">
		<span class=" text-xl font-bold">
			{name}
		</span>
	</div>

	{#if isShowHostDelete}
		<div>
			<div class="flex flex-col flex-wrap justify-center ">
				<div class="flex justify-center font-bold text-sm ">JOIN PASS</div>
				<div class="flex  flex-wrap justify-center ">
					{#each pass.toString() as item, index}
						<span class="bg-slate-100 p-2 m-1 rounded-md w-9 h-10 flex items-center justify-center">
							{#if isShowPass}
								{item}
							{/if}
						</span>
					{/each}
					<button class="btn btn-xs w-9 h-10 btn-info m-1 {isShowPass ? 'opacity-50' : ''}" onclick={toggleIsShowPass}
						>👀</button
					>
				</div>
			</div>
		</div>

		<div class="text-xs text-slate-500 flex justify-center items-center gap-2">
			Available till {getDeletionTime(created_at)}
			<button
				class="btn btn-ghost btn-xs"
				aria-label="Delete hosted game"
				onclick={() => {
					deleteBuzzHostModal.showModal();
				}}>🗑️</button
			>
		</div>
	{/if}
</div>

<dialog id="deleteBuzzHostModal" class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Are you sure you want to delete this host?</h3>

		<div class="modal-action">
			<form method="dialog">
				<button
					class="btn btn-md my-2 btn-error mr-3"
					onclick={() => hostDataMgr.deleteBuzzHostFromDB()}>Delete this host</button
				>
				<button class="btn">Cancel</button>
			</form>
		</div>
	</div>
</dialog>
