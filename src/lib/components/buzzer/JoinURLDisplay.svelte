<script>
	import { onMount } from 'svelte';
	import { copyToClipboard } from '$lib/helper/global';

	export let uuid;

	let joinURL = '';

	function getJoinURL(uuid) {
		const isLocalhost = window.location.hostname === 'localhost';
		const baseURL = isLocalhost ? 'http://localhost:5173' : `http://${window.location.hostname}`;
		return `${baseURL}/buzzer/join/${uuid}`;
	}

	onMount(() => {
		joinURL = getJoinURL(uuid);
	});
</script>

<div class="flex flex-col m-2 bg-gray-100 p-2 px-4 rounded-full">
  <p class="flex justify-center">👇Join URL for participant👇</p>

  <div class="mt-2 p-2 flex flex-row flex-wrap items-center">
    <div class="flex-1 "> 
      <a
        class="text-blue-500 hover:text-blue-700 text-xs break-words  w-full"
        target="_blank"
        rel="noopener noreferrer"
        href={joinURL}>{joinURL}</a>
    </div>
    <button class="btn btn-sm btn-secondary ml-2" onclick={() => copyToClipboard(joinURL)}>📋</button>
  </div>
</div>