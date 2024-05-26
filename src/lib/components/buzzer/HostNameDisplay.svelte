<script>
	import {  getDeletionTime } from '$lib/helper/buzzer';
	import { hostDataMgr } from '$lib/helper/buzzerStore.svelte';

	let { name, created_at, host_uuid, id, uuid } = hostDataMgr.hostData || {};

  let { isShowHostDelete = false } = $props() 

	function addRainbowColors(text) {
		if (!text) return '';

		const colors = [
			'text-red-500',
			'text-orange-500',
			'text-yellow-500',
			'text-green-500',
			'text-blue-500',
			'text-indigo-500',
			'text-purple-500',
			'text-pink-500'
		];

		let result = '';
		for (let i = 0; i < text.length; i++) {
			const colorClass = colors[i % colors.length];
			result += `<span class="${colorClass}">${text[i]}</span>`;
		}

		return result;
	}

</script>

<div class="flex flex-col m-2 bg-gray-100 p-2 px-12 rounded-full ">
	<div class="flex flex-wrap justify-center items-end p-2 gap-1  ">
		<span class="colorful-party-text text-2xl font-bold">
      {#if name}
			{@html addRainbowColors(name)}
      {/if}
		</span>
		<!-- <span class="text-xs text-sl'ate-400">{id}</span> -->
	</div>

  {#if isShowHostDelete}
	<div class="text-xs text-slate-400">
		Available till {getDeletionTime(created_at)} 		<button
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
				<button class="btn btn-md my-2 btn-error mr-3" onclick={() => hostDataMgr.deleteBuzzHostFromDB()}
					>Delete this host</button
				>
				<button class="btn">Cancel</button>
			</form>
		</div>
	</div>
</dialog>
