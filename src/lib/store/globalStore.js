// GlobalStore.js

import { writable } from 'svelte/store';


export const toastMsgQue = writable([]);
let currentId = 0;


export function setToastMsgQueEmpty() {
	toastMsgQue.set([]);
}

export function addToastMsgQue(msg = 'Default message', style = 'alert-info') {
  currentId++;
  toastMsgQue.update((queue) => [...queue, { id: currentId, msg, style }]);
}

export function removeToastMsg(idToRemove) {
  toastMsgQue.update((queue) => queue.filter((msg) => msg.id !== idToRemove));
}