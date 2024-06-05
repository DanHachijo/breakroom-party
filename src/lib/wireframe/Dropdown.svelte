<script>
  import { onMount, onDestroy } from 'svelte'
  import { browser } from '$app/environment';
  import { fly } from 'svelte/transition';

	let { btnName = 'Open', items = {}, postion = 'left-0'} = $props();

  let dropdownRef;
	let isDropdownOpen = $state(false);

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}


  function handleClickOutside(event) {
    console.log("click")
    if (dropdownRef && !dropdownRef.contains(event.target)) {
      isDropdownOpen = false;
    }
  }

  if (browser) {
    onMount(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onDestroy(() => {
      document.removeEventListener('click', handleClickOutside);
    });
  }

</script>

{#snippet dropdownItem(item)}
	<button class="btn btn-accent btn-sm w-full text-left mt-1" onclick={item.func}>{item.name}</button>
{/snippet}

<div class="relative inline-block " bind:this={dropdownRef}>
	<button onclick={toggleDropdown} class="btn btn-md btn-ghost text-slate-50">
		{btnName}
	</button>

	{#if isDropdownOpen}
		<div class="absolute z-[10]  w-48 bg-slate-600 shadow-lg rounded-md p-2 {postion}" transition:fly={{ y: -10, duration: 200 }}>
			{#each items as item}
				{@render dropdownItem(item)}
			{/each}
		</div>
	{/if}
</div>