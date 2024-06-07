<script>
	import { toastMgr } from '$lib/helper/toastStore.svelte';
	import { onMount } from 'svelte';
	import JSConfetti from 'js-confetti';
	import { templateList } from '$lib/helper/shuffleTemplateList';

	let { tabNum = 0, badgeColor = '', toggleShuffleParent, isDemo = false } = $props();

	function extractItemListDefault(index) {
		if (index >= 0 && index < templateList.length) {
			return templateList[index].list;
		} else {
			return [];
		}
	}

	const itemListDefault = extractItemListDefault(tabNum);

	// CONFETTI
	let jsConfetti;
	function initializeConfetti() {
		jsConfetti = new JSConfetti();
	}
	function addConfetti() {
		jsConfetti.addConfetti();
	}
	// END CONFETTI

	const ITEM_LIST_KEY = `itemList_${tabNum || 1}`;

	function getItemListFromLocalStorage() {
		const storedItemList = localStorage.getItem(ITEM_LIST_KEY);
		if (storedItemList) {
			try {
				return JSON.parse(storedItemList);
			} catch (error) {
				console.error('Error parsing stored itemList:', error);
			}
		}
		return [];
	}

	function setItemListToLocalStorage() {
		localStorage.setItem(ITEM_LIST_KEY, JSON.stringify(itemList));
	}

	let selectedItem = $state('');
	let highlightedItem = $state('');
	let isShuffling = $state(false);

	let shuffleDuration = $state(3000);

	let itemList = $state([]);

	function setItemListDefault() {
  if (isDemo) {
    itemList = [...itemListDefault];
  } else {
    const storedItemList = getItemListFromLocalStorage();
    if (storedItemList.length > 0) {
      itemList = storedItemList;
    } else {
      itemList = [...itemListDefault];
      setItemListToLocalStorage(itemList);
    }
  }
}

	function setTemplateList(id) {
		const selectedTemplate = templateList.find((item) => item.id === id);
		if (selectedTemplate) {
			itemList = [...selectedTemplate.list];
			setItemListToLocalStorage();
		}
	}

	let isSelectOnlyOnce = $state(false);

	function setAllItemsUnselected() {
		itemList = itemList.map((item) => ({
			...item,
			isSelected: false
		}));
		selectedItem = '';
		highlightedItem = '';
		setItemListToLocalStorage();
	}

	function setSelectedTrue(itemId) {
		const item = itemList.find((item) => item.id === itemId);
		if (item) {
			item.isSelected = true;
		}
	}

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
		if (!isDemo) {
			toggleShuffleParent(true);
		}
		isShuffling = true;
		let intervalDuration = 100; // Shuffle every 100ms

		shuffleAndHighlight();
		const intervalId = setInterval(shuffleAndHighlight, intervalDuration);

		// Stop shuffling after shuffleDuration
		setTimeout(() => {
			clearInterval(intervalId);
			selectedItem = highlightedItem;
			isShuffling = false;
			if (!isDemo) {
				addConfetti();
				setSelectedTrue(selectedItem.id);
				setItemListToLocalStorage();
				modalSelectedItem.showModal();
				toggleShuffleParent(false);
			}
		}, shuffleDuration);
	}

	onMount(() => {
		setItemListDefault();
		initializeConfetti();
	});
</script>

<div class="{badgeColor}  rounded-md flex flex-col {isDemo? '' : 'min-h-[80vh]'} ">
	<div class="flex justify-center md:justify-between flex-wrap items-center  ">
		<div class="p-2">
			<div class="flex gap-2 flex-wrap pt-4 pl-2 md:p-2">
				{#if !isDemo}
					<div class="dropdown dropdown-start">
						<button class=" btn btn-sm btn-accent btn-outline border-2" disabled={isShuffling}>
							<div tabindex="0" role="button">USE TEMPALTE</div>
						</button>
						<div
							class="menu dropdown-content z-[1] p-2 shadow bg-slate-50 rounded-box w-52 mt-4 gap-2"
						>
							{#each templateList as item (item.id)}
								<button
									class="btn btn-xs btn-ghost"
									onclick={() => {
										setTemplateList(item.id);
									}}>{item.name}</button
								>
							{/each}
						</div>
					</div>

					<button
						class="btn btn-sm btn-accent btn-outline border-2"
						onclick={() => editModal.showModal()}
						disabled={isShuffling}
					>
						EDIT
					</button>

					<dialog id="editModal" class="modal modal-bottom sm:modal-middle">
						<div class="modal-box">
							<h3 class="font-bold text-lg">Shuffle list</h3>

							<span class="text-xs"
								>Once you make changes in the list, all the selected items✅ will be reset to 🟩.</span
							>
							{#if itemList?.length <= 1}
								<div class="alert alert-warning my-2">
									<span>⚠️ Please add more than 2 items to paly this game. </span>
								</div>
							{/if}

							<textarea
								class="textarea textarea-bordered min-h-96 w-full"
								placeholder="Item List"
								bind:value={itemListNames}
								oninput={(event) => updateItemListFromNames(itemListNames, event)}
							></textarea>

							<form method="dialog">
								<div class="flex justify-end">
									<button
										class="btn btn-sm btn-accent mt-2"
										disabled={itemList?.length <= 1}
										onclick={() => {
											removeItemsWithEmptyNames();
											setItemListToLocalStorage();
										}}>DONE</button
									>
								</div>
							</form>
						</div>
					</dialog>
				{/if}

				<button
					class="btn btn-sm {isDemo ? 'btn-info' : 'btn-accent'} jello-horizontal"
					onclick={pickRandomItem}
					disabled={isShuffling ||
						(countSelectedFalse <= 1 && isSelectOnlyOnce) ||
						itemList.length <= 1}
				>
				{isDemo ? 'START DEMO' : 'START'}
					
				</button>
				
			</div>
		</div>
		{#if !isDemo}
			<div class="flex items-center">
				<div class="flex justify-start items-center w-full gap-2 flex-wrap p-2 ">

					<div class="form-control sm:w-64 ">
						<label class="label cursor-pointer flex justify-end">
							<span class="label-text p-1 mr-2 text-slate-100 {isShuffling ? 'opacity-50' : ''}">
								{isSelectOnlyOnce ? 'Disable "Select Only Once"' : 'Enable "Select Only Once"'}
							</span>
							<input
								disabled={isShuffling}
								type="checkbox"
								class="toggle"
								bind:checked={isSelectOnlyOnce}
							/>
						</label>
					</div>

					<button
						disabled={isShuffling || !isSelectOnlyOnce}
						class="btn btn-sm mr-2"
						onclick={setAllItemsUnselected}>RESET ALL ✅</button
					>


				</div>
			</div>
		{/if}
	</div>

	<div class="px-3">
		<hr />
	</div>
	<div class="grid grid-cols-12 justify-center gap-4 px-2 py-4">
		{#if itemList.length > 1}
			{#each itemList as item, index}
				<div
					class="col-span-12 lg:col-span-6 flex justify-center {item.isSelected &&
					isSelectOnlyOnce &&
					highlightedItem.id !== item.id
						? 'opacity-50'
						: ''} "
				>
					<div class="w-full px-4 sm:px-1">
						<div
							class=" relative py-3 rounded-md min-h-12 transition-transform duration-100 {highlightedItem ===
							item
								? 'bg-yellow-300 	'
								: 'bg-gray-100'}"
						>
							<div class="flex justify-between">
								<div
									class="badge text-slate-50 font-bold border-none bg-slate-500 absolute -top-2 -left-1 -rotate-12"
								>
									{index + 1}
								</div>
								<span class="truncate pl-2 md:px-3 font-bold">
									{item.name}
								</span>
								{#if isSelectOnlyOnce}
									<button
										class="mr-3"
										disabled={isShuffling}
										onclick={() => (item.isSelected = !item.isSelected)}
										>{item.isSelected ? '✅' : '🟩'}</button
									>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<!-- MODAL SHOW SELECTED ITEM -->
<dialog id="modalSelectedItem" class="modal">
	<div class="modal-box min-h-40 flex flex-col justify-center item-center bg-slate-100">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class=" font-bold text-lg flex justify-center">
			{selectedItem.name}
			{#if isSelectOnlyOnce}
				✅
			{/if}
		</h3>
	</div>
</dialog>

<style>
	.bg-gradient {
		background-image: radial-gradient(
			circle farthest-corner at 48.4% 47.5%,
			rgba(122, 183, 255, 1) 0%,
			rgba(21, 83, 161, 1) 90%
		);
	}
</style>
