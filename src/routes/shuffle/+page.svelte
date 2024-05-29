<script>
	import Shuffle from '$lib/components/shuffle/Shuffle.svelte';

	let totalPageNum = 4;
	let currentPage = 1;

	let isShuffleParent = false;
	function toggleShuffleParent(value) {
		isShuffleParent = value;
	}

	const badgeColorOption = ['bg-blue-400', 'bg-red-400', 'bg-green-400', 'bg-purple-400'];
	const textColorOption = ['text-blue-400', 'text-red-400', 'text-green-400', 'text-purple-400'];

	const pages = Array.from({ length: totalPageNum }, (_, i) => i + 1);

	function showPage(num) {
		currentPage = num;
	}
</script>

<div class="grid grid-cols-12 gap-4 pt-4 px-2">
	{#each pages as pageNum, index (index)}
		<button
			disabled={isShuffleParent}
			class="btn btn-sm col-span-3 rounded-none rounded-t-md border-none text-slate-50 {currentPage ===
			pageNum
				? badgeColorOption[index]
				: ''}"
			onclick={() => showPage(pageNum)}
			>
			<div class="badge text-slate-50 {badgeColorOption[index]}  badge-md border-none">
				LIST
				{index + 1}
			</div>
		</button>
	{/each}
</div>

{#each pages as pageNum, index (index)}
	{#if currentPage === pageNum}
		<Shuffle tabNum={pageNum} badgeColor={badgeColorOption[index]} {toggleShuffleParent} />
	{/if}
{/each}
