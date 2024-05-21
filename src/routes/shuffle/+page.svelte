<script>
	import Shuffle from '$lib/components/shuffle/Shuffle.svelte';

	let totalPageNum = 4;
	let currentPage = 1;

	const sampleLists = [
		[
			{ id: 1, name: 'Pizza', isSelected: false },
			{ id: 2, name: 'Burger', isSelected: false },
			{ id: 3, name: 'Sushi', isSelected: false },
			{ id: 4, name: 'Salad', isSelected: false }
		],
		[
			{ id: 1, name: 'Apple', isSelected: false },
			{ id: 2, name: 'Banana', isSelected: false },
			{ id: 3, name: 'Cherry', isSelected: false },
			{ id: 4, name: 'Date', isSelected: false },
			{ id: 5, name: 'Elderberry', isSelected: false },
			{ id: 6, name: 'Fig', isSelected: false }
		],
		[
			{ id: 1, name: 'Red', isSelected: false },
			{ id: 2, name: 'Blue', isSelected: false },
			{ id: 3, name: 'Green', isSelected: false },
			{ id: 4, name: 'Yellow', isSelected: false },
			{ id: 5, name: 'Purple', isSelected: false },
			{ id: 6, name: 'Orange', isSelected: false },
			{ id: 7, name: 'Pink', isSelected: false },
			{ id: 8, name: 'Brown', isSelected: false }
		],
		[
			{ id: 1, name: 'Cat', isSelected: false },
			{ id: 2, name: 'Dog', isSelected: false },
			{ id: 3, name: 'Rabbit', isSelected: false },
			{ id: 4, name: 'Parrot', isSelected: false },
			{ id: 5, name: 'Hamster', isSelected: false },
			{ id: 6, name: 'Fish', isSelected: false },
			{ id: 7, name: 'Turtle', isSelected: false },
			{ id: 8, name: 'Lizard', isSelected: false },
			{ id: 9, name: 'Snake', isSelected: false },
			{ id: 10, name: 'Horse', isSelected: false }
		]
	];

	const badgeColorOption = ["bg-blue-500",  "bg-red-500", "bg-green-500", "bg-yellow-500"	]
	const pages = Array.from({ length: totalPageNum }, (_, i) => i + 1);

	function showPage(num) {
		currentPage = num;
	}
</script>

<div class="grid grid-cols-12 gap-4 pb-2 p-3 mb-2">
	{#each pages as pageNum, index (index)}
		<button
			class="btn btn-sm    opacity-80 col-span-6 sm:col-span-3 w-full  {currentPage === pageNum ? badgeColorOption[index] :''}" 
			onclick={() => showPage(pageNum)}
		>
			LIST <div class="badge {badgeColorOption[index]} badge-md border-none">{index + 1}</div>
		</button>
	{/each}
</div>

{#each pages as pageNum, index (index)}
	{#if currentPage === pageNum}
		<Shuffle tabNum={pageNum} itemListDefault={sampleLists[index]} badgeColor={badgeColorOption[index]} />
	{/if}
{/each}

