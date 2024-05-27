<!-- Toast.svelte -->
<script>
	import { onMount } from 'svelte';
	import { toastMgr } from '$lib/helper/toastStore.svelte';
	let { msg, style, id } = $props();

	function closeToast() {
		toastMgr.removeToastMsg(id);
	}

	onMount(() => {
		setTimeout(closeToast, 5000);
	});
</script>

<div class="alert relative p-4 {style} ">
	<button class="btn btn-ghost btn-circle btn-xs absolute right-1 top-1" onclick={closeToast}
		>✕</button
	>
	<span>{msg} </span>
</div>
