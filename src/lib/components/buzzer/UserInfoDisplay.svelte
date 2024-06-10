<script>
	import { deleteBuzzUser } from '$lib/supabase/buzzerClient.js';
  import { toastMgr } from '$lib/helper/toastStore.svelte';
  import { Trash2 } from 'lucide-svelte';

	let { winUserId = 0, userId = 0, userName = 'Guest', winNum = 0, uuid = '' } = $props();

	let isShowDeleteBtn = $state(false);
	function toggleDeleteBtn() {
		isShowDeleteBtn = !isShowDeleteBtn;
	}
	async function handleDeleteUser(userID) {
		try {
			if (userID && uuid) {
				const response = await deleteBuzzUser(userID, uuid);
				toastMgr.addToastMsgQue('User deleted successfully', 'alert-success');
			} else {
				console.error('UserID or UUID is missing');
			}
		} catch (error) {
			console.error('Error deleting user:', error.message);
		}
	}
</script>

<div
	class="relative col-span-1 m-2 rounded-md gap-2 p-2 {winUserId == userId
		? 'bg-pink-100'
		: 'bg-slate-100'}"
>
	{#if winUserId == userId}
		<span class=" absolute -top-3 -left-2 text-2xl">🎉</span>
	{/if}
	<div class="flex justify-between">
		<div class="flex flex-col overflow-hidden overflow-ellipsis whitespace-nowrap">
			<p class="font-bold text-base">{userName}</p>
			<p class="text-gray-500 text-xs">id:{userId}</p>
		</div>

		<div class="flex">
			<div class="flex items-center justify-center mx-2 px-4 rounded-sm bg-slate-200">
				<span class="font-bold">
					{winNum}
				</span>
			</div>

			<div class="flex items-end">
        <button class="btn btn-xs" onclick={toggleDeleteBtn}><Trash2 size={16}/></button>

				{#if isShowDeleteBtn}
        <div class="absolute inset-0 flex items-center gap-6 pr-6 justify-end bg-slate-200 rounded-md ">
					<p>DELETE USER: {userName} ?</p>
					<button
						class="btn btn-sm btn-warning "
						onclick={() => {
							handleDeleteUser(userId);
						}}>DELETE</button
					>
          <button
          class="btn btn-sm btn-info x"
          onclick={toggleDeleteBtn}>CANCEL</button
        >
        </div>
				{/if}
			</div>
		</div>
	</div>
</div>

