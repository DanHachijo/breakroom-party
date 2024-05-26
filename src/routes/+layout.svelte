<script>
	import '../app.css';
	import Header from '$lib/wireframe/Header.svelte';
	import Toast from '$lib/wireframe/Toast.svelte';
	import { toastMgr } from '$lib/store/globalStore.svelte';

	// let toastMsgList;

	// toastMsgQue.subscribe((value) => {
	// 	toastMsgList = value;
	// });



</script>

<div class=" h-screen ">
	<div class="container mx-auto">
		<Header />
		<div class="h-full-content">
			<slot />
			<div class="toast toast-bottom toast-start">
					{#each toastMgr.toastMsgQue as { msg, style, id } (id)}
						<Toast {msg} {style} {id} />
					{/each}
			</div>
		</div>
	</div>
</div>
