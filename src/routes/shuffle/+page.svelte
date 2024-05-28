<script>
	import Shuffle from '$lib/components/shuffle/Shuffle.svelte';

	let totalPageNum = 4;
	let currentPage = 1;

	let isShuffleParent = false;
	function toggleShuffleParent(value) {
		isShuffleParent = value;
	}




	const badgeColorOption = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500'];
	const pages = Array.from({ length: totalPageNum }, (_, i) => i + 1);

	function showPage(num) {
		currentPage = num;
	}
</script>

<div class="grid grid-cols-12 gap-4 pb-2 p-3 mb-2">
	{#each pages as pageNum, index (index)}
		<button
			disabled={isShuffleParent}
			class="btn btn-sm opacity-80 col-span-6 sm:col-span-3 w-full border-none {currentPage === pageNum
				? badgeColorOption[index]
				: ''}"
			onclick={() => showPage(pageNum)}
		>
			LIST <div  class="badge { isShuffleParent ? 'opacity-50' : ''} {badgeColorOption[index]}  badge-md border-none">{index + 1}</div>
		</button>
	{/each}
</div>

{#each pages as pageNum, index (index)}
	{#if currentPage === pageNum}
		<Shuffle
			tabNum={pageNum}
			badgeColor={badgeColorOption[index]}
			{toggleShuffleParent}
		/>
	{/if}
{/each}
