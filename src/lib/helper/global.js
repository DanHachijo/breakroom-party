import { toastMgr } from '$lib/store/globalStore.svelte';

export function copyToClipboard(url) {
	navigator.clipboard
		.writeText(url)
		.then(() => {
			console.log('URL copied to clipboard:', url);
			toastMgr.addToastMsgQue('copied it to clipboard');
		})
		.catch((error) => {
			console.error('Error copying URL to clipboard:', error);
      toastMgr.addToastMsgQue('Failed to copy URL to clipboard. Please try again.');
		});
}
