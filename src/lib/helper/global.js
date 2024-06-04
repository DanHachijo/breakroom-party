
// import { toastMgr } from '$lib/helper/toastStore.svelte';
import { goto } from '$app/navigation';

// export function copyToClipboard(url) {
// 	navigator.clipboard
// 		.writeText(url)
// 		.then(() => {
// 			console.log('URL copied to clipboard:', url);
// 			toastMgr.addToastMsgQue('Copied !');
// 		})
// 		.catch((error) => {
// 			console.error('Error copying URL to clipboard:', error);
//       toastMgr.addToastMsgQue('Failed to copy URL to clipboard. Please try again.');
// 		});
// }

export function navigate(url) {
 setTimeout(() => goto(url), 0);
}

export function goToGitHub() {
	window.open('https://github.com/DanNakatoshi/breakroom-party', '_blank');
}