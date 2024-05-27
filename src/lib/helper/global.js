import { toastMgr } from '$lib/helper/toastStore.svelte';

export function copyToClipboard(url) {
	navigator.clipboard
		.writeText(url)
		.then(() => {
			console.log('URL copied to clipboard:', url);
			toastMgr.addToastMsgQue('Copied !');
		})
		.catch((error) => {
			console.error('Error copying URL to clipboard:', error);
      toastMgr.addToastMsgQue('Failed to copy URL to clipboard. Please try again.');
		});
}
