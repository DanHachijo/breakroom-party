<script>
	import { addToastMsgQue } from '$lib/store/globalStore';
	import { onMount } from 'svelte';

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

	// $effect(() => {
	// 	if (isSelectOnlyOnce) {
	// 	} else {
	// 		setItemListDefault();
	// 	}
	// });

	$effect(() => {
		if (countSelectedFalse <= 1 && isSelectOnlyOnce) {
			addToastMsgQue("We don't have enough items shuffle😅");
		}
	});

	// EDIT LIST
	let itemListNames = $state([]);

	$effect(() => {
		itemListNames = itemList.map((item) => item.name).join('\n');
	});

	function removeItemsWithEmptyNames() {
		itemList = itemList.filter((item) => item.name.trim() !== '');
	}

	function updateItemListFromNames(names, event) {
		const nameArray = names.split('\n').map((name) => name.trim());
		const selectionStart = event.target.selectionStart;
		// const selectionEnd = event.target.selectionEnd;

		// Filter out empty names and create new objects
		const newItems = nameArray.map((name, index) => ({
			id: itemList[index]?.id || Math.max(...itemList.map((item) => item.id), 0) + index + 1, // Calculate new ID
			name: name,
			isSelected: false
		}));

		itemList = newItems;

		// Restore cursor position
		setTimeout(() => {
			event.target.selectionStart = selectionStart;
			event.target.selectionEnd = selectionStart;
		});
	}

	//END  EDIT LIST

	let countSelectedFalse = $derived(itemList.filter((item) => !item.isSelected).length);

	function shuffleAndHighlight() {
		let itemsToShuffle = itemList;
		if (isSelectOnlyOnce) {
			itemsToShuffle = itemList.filter((item) => !item.isSelected);
		}

		const randomIndex = Math.floor(Math.random() * itemsToShuffle.length);
		highlightedItem = itemsToShuffle[randomIndex];
	}

	function pickRandomItem() {
		isShuffling = true;
		let shuffleDuration = 3000; // 3 seconds
		let intervalDuration = 100; // Shuffle every 100ms

		shuffleAndHighlight();
		const intervalId = setInterval(shuffleAndHighlight, intervalDuration);

		// Stop shuffling after shuffleDuration
		setTimeout(() => {
			clearInterval(intervalId);
			selectedItem = highlightedItem;
			setSelectedTrue(selectedItem.id);
      modalSelectedItem.showModal()
			isShuffling = false;
		}, shuffleDuration);
	}

	onMount(() => {
		setItemListDefault();
	});
</script>

<!-- <button class="btn" onclick={()=>{addToastMsgQue("Lorem ipsum dolor sit. Lorem ipsum dolor sit.")}}>
  Update
</button> -->
<div class="">
	<div class="flex justify-center items-center gap-2">
		<button
			class="btn btn-md btn-secondary"
			onclick={() => my_modal_3.showModal()}
			disabled={isShuffling}
		>
			EDIT LIST
		</button>

		<dialog id="my_modal_3" class="modal modal-bottom sm:modal-middle">
			<div class="modal-box">
				<form method="dialog">
					<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onclick={removeItemsWithEmptyNames}>✕</button>
				</form>
				<h3 class="font-bold text-lg">Shuffle list</h3>

        <span class="text-sm">⚠️Once you make changes in the list, all the selected items will be reset.</span>
				{#if itemList.length <= 1}
					<div class="alert alert-warning my-2">
						<span>⚠️ Please add more than 2 items to paly this game. </span>
					</div>
				{/if}

				<textarea
					class="textarea textarea-bordered min-h-32 w-full "
					placeholder="Item List"
					bind:value={itemListNames}
					oninput={(event) => updateItemListFromNames(itemListNames, event)}
				></textarea>
			</div>
		</dialog>

		<button
			class="btn btn-md btn-primary"
			onclick={pickRandomItem}
			disabled={isShuffling ||
				(countSelectedFalse <= 1 && isSelectOnlyOnce) ||
				itemList.length <= 1}
		>
			START
		</button>

		<div class="form-control">
			<label class="label cursor-pointer">
				<span class="label-text p-1">
					{isSelectOnlyOnce ? 'Disabled selected' : 'Select all'}
				</span>
				<input
					disabled={isShuffling}
					type="checkbox"
					class="toggle"
					bind:checked={isSelectOnlyOnce}
				/>
			</label>
		</div>
	</div>

	<div class="grid grid-cols-12 justify-center gap-2 mt-3">
		{#if itemList.length > 1}
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
						<div class="flex justify-between">
							<div class="badge badge-primary absolute -top-2 -left-2">{index + 1}</div>
              <span class="truncate">

                {item.name}
              </span>
							<!-- {#if isSelectOnlyOnce}

						<button class="btn btn-xs" onclick={() => (item.isSelected = !item.isSelected)}
							>{item.isSelected ? '✅' : '🟩'}</button
						>
            {/if} -->
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<!-- MODAL SHOW SELECTED ITEM -->
<dialog id="modalSelectedItem" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="font-bold text-lg">{selectedItem.name}</h3>
  </div>
</dialog>