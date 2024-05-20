<script>
	import { addToastMsgQue } from '$lib/store/globalStore';

	let selectedItem = $state('');
	// let selectedItemId = $state(null);

	let highlightedItem = $state('');
	let isShuffling = $state(false);

	let itemListDefault = [
		{ id: 1, name: 'Pizza', isSelected: false },
		{ id: 2, name: 'Burger', isSelected: false },
		{ id: 3, name: 'Sushi', isSelected: true },
		{ id: 4, name: 'Salad', isSelected: true },
		{ id: 5, name: 'Steak', isSelected: false },
		{ id: 6, name: 'Fries', isSelected: true },
		{ id: 7, name: 'Ice Cream', isSelected: true },
		{ id: 8, name: 'Pasta', isSelected: true },
		{ id: 9, name: 'Tacos', isSelected: false },
		{ id: 10, name: 'Sandwich', isSelected: false }
	];

	let itemList = $state([]);

	function setItemListDefault() {
		itemList = [...itemListDefault];
	}

	function removeItemFromItemList(itemsToRemove) {
		itemList = itemList.filter((item) => !itemsToRemove.includes(item));
	}

	let isSelectOnlyOnce = $state(false);

	function toggleSelectedOption() {
		isSelectOnlyOnce = !isSelectOnlyOnce;
	}

	// function toggleSelectedItem(itemId) {
	// 	const item = itemList.find((item) => item.id === itemId);
	// 	if (item) {
	// 		item.isSelected = !item.isSelected;
	// 	}
	// }

	function setSelectedTrue(itemId) {
		const item = itemList.find((item) => item.id === itemId);
		if (item) {
			console.log('FOUND');
			item.isSelected = true;
		}
	}

	$effect(() => {
		if (isSelectOnlyOnce) {
		} else {
			setItemListDefault();
		}
	});

	$effect(() => {
		if (countSelectedFalse <= 1 && isSelectOnlyOnce) {
			addToastMsgQue('We only have one item left to shuffle😅');
		}
	});

	let countSelectedFalse = $derived(itemList.filter((item) => !item.isSelected).length);

	function shuffleAndHighlight() {
		let itemsToShuffle = itemList;
		if (isSelectOnlyOnce) {
			itemsToShuffle = itemList.filter((item) => !item.isSelected);
		}

		const randomIndex = Math.floor(Math.random() * itemsToShuffle.length);
		highlightedItem = itemsToShuffle[randomIndex];
	}

	// Function to pick a random item from the shuffled array
	function pickRandomItem() {
		isShuffling = true;
		let shuffleDuration = 3000; // 3 seconds
		let intervalDuration = 100; // Shuffle every 100ms

		// Shuffle immediately and then at regular intervals
		shuffleAndHighlight();
		const intervalId = setInterval(shuffleAndHighlight, intervalDuration);

		// Stop shuffling after shuffleDuration
		setTimeout(() => {
			clearInterval(intervalId);
			selectedItem = highlightedItem;
			// toggleSelectedItem(selectedItem.id);
			console.log(selectedItem.id);
			setSelectedTrue(selectedItem.id);
			isShuffling = false;
		}, shuffleDuration);
	}
</script>

<!-- <button class="btn" onclick={()=>{addToastMsgQue("Lorem ipsum dolor sit. Lorem ipsum dolor sit.")}}>
  Update
</button> -->
<div class="">
	<button
		class="btn btn-md btn-primary"
		onclick={pickRandomItem}
		disabled={isShuffling || (countSelectedFalse <= 1 && isSelectOnlyOnce)}
	>
		Pick Item for me
	</button>

	<div class="form-control">
		<label class="label cursor-pointer">
			<span class="label-text">
				{isSelectOnlyOnce ? 'Disabled selected items' : 'Select from all'}
				e</span
			>
			<input
				disabled={isShuffling}
				type="checkbox"
				class="toggle"
				bind:checked={isSelectOnlyOnce}
			/>
		</label>
	</div>

	<div class="grid grid-cols-12 justify-center gap-2 mt-3">
		{#each itemList as item, index}
			<div
				class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 flex justify-center {item.isSelected &&
				isSelectOnlyOnce &&
				highlightedItem.id !== item.id
					? 'opacity-50'
					: ''} "
			>
				<div
					class="w-full relative p-4 rounded-md transition-transform duration-100 {highlightedItem ===
					item
						? 'bg-blue-300 scale-105'
						: 'bg-gray-200'}"
				>
					<div class="">
						<div class="badge badge-primary absolute -top-3 -left-3">{index + 1}</div>

						{item.name} ( {item.isSelected}
						)
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
