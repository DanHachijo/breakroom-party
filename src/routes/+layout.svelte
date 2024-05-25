<script>
	import '../app.css';
	import Header from '$lib/wireframe/Header.svelte';
	import Toast from '$lib/wireframe/Toast.svelte';
	import { toastMsgQue } from '$lib/store/globalStore';

	let toastMsgList;

	toastMsgQue.subscribe((value) => {
		toastMsgList = value;
	});

</script>

<div class=" h-screen bg-gradient">
	<div class="container mx-auto">
		<Header />
		<div class="h-full-content">
			<slot />
			<div class="toast toast-bottom toast-start">
					{#each toastMsgList as { msg, style, id } (id)}
						<Toast {msg} {style} {id} />
					{/each}
			</div>
		</div>
	</div>
</div>
