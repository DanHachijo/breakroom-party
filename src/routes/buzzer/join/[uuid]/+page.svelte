<script>
	import {
		fetchBuzzUser,
		addBuzzUser,
		deleteBuzzUser,
		handleBuzzButtonClick,
		subscribeToBuzzBtnUnlock,
		checkBuzzBtnExistence,
		subscribeToUserDelete
	} from '$lib/supabase/buzzerClient.js';
	import {
		getBuzzUserIDFromLocal,
		setBuzzUserIDToLocal,
		deleteBuzzUserIDFromLocal
	} from '$lib/helper/buzzer';
	import { addToastMsgQue } from '$lib/store/globalStore';
	import { onMount } from 'svelte';
	import BuzzBtn from '$lib/components/buzzer/BuzzBtn.svelte';
	import HostNameDisplay from '$lib/components/buzzer/HostNameDisplay.svelte';

	let { data } = $props();

	let buzzHost = $state(data.props.buzzHost);

	let defaultBuzzUser = {
		id: '',
		name: '',
		uuid: ''
	};

	let buzzUserData = $state(defaultBuzzUser);

	let userNameInput = $state(null);
	let userID = $state(null);

	let buzz_game_id = $state(null);
	// Btn Component
	let isBuzzBtnLock = $state(false);

	$effect(() => {
		if (buzz_game_id !== null && buzz_game_id !== 0) {
			console.log('Buzz Btn is Locked');
			toggleBuzzBtn(true);
			subscribeToBuzzBtnUnlock(userID, buzz_game_id, toggleBuzzBtn);
		} else {
			toggleBuzzBtn(false);
		}
	});

	// END Btn Component

	let createUserState = $state({
		uuid: buzzHost?.uuid,
		name: ''
	});

	$effect(() => {
		createUserState.name = userNameInput;
	});

	function toggleBuzzBtn(setting = false) {
		isBuzzBtnLock = setting;
	}

	function updateUserID() {
		userID = buzzUserData?.id;
		setBuzzUserIDToLocal(userID);
	}

	async function createNewUser() {
		try {
			const [createdUser] = await addBuzzUser(createUserState);
			buzzUserData = createdUser;
			updateUserID();
			listenUserDeletion();
			userNameInput = null;
			addToastMsgQue('User is created', 'alert-info');
		} catch (error) {
			showAlert('Error creating user');
		}
	}

	async function fetchUserInfo() {
		try {
			const [userInfo] = await fetchBuzzUser(userID, buzzHost.uuid);
			buzzUserData = userInfo;
			updateUserID();
			addToastMsgQue('User info is fetched', 'alert-info');
		} catch (error) {
			console.error('Error fetching user info:', error.message);
			deleteBuzzUserIDFromLocal();
		}
	}

	async function handleBtnClick() {
		try {
			const response = await handleBuzzButtonClick(userID);
			buzz_game_id = response[0].id;
			// console.log('Success:', buzz_game_id);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	// UserDelete

	function resetUserInfoAfterDelete() {
		buzzUserData = defaultBuzzUser;
		userID = null;
		buzz_game_id = null;
		isBuzzBtnLock = false;
		deleteBuzzUserIDFromLocal();
		addToastMsgQue('User is deleted', 'alert-warning');
	}

	async function listenUserDeletion() {
		try {
			await subscribeToUserDelete(userID, resetUserInfoAfterDelete);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function handleDeleteUser() {
		try {
			if (userID && buzzHost.uuid) {
				const response = await deleteBuzzUser(userID, buzzHost.uuid);
			} else {
				console.error('UserID or UUID is missing');
			}
		} catch (error) {
			console.error('Error deleting user:', error.message);
		}
	}

	onMount(async () => {
		userID = getBuzzUserIDFromLocal();
		if (userID) {
			await fetchUserInfo();
			buzz_game_id = await checkBuzzBtnExistence(userID);
			subscribeToBuzzBtnUnlock(userID, buzz_game_id, toggleBuzzBtn);
			listenUserDeletion();
		}
	});
</script>

<div class="flex flex-col justify-between items-center h-full-content">
	{#if userID == null}
		<div id="TOP"></div>
		<div id="MID" class="flex-col gap-2">
			<div class="bg-info py-4 px-6 rounded-md">
				<div class="text-base m-2">Let's create your buzz button</div>
				<input
					type="text"
					placeholder="Your display name"
					class="input input-bordered w-full max-w-xs"
					bind:value={userNameInput}
				/>
				<div class="flex justify-end">
					<button
						class="btn btn-sm btn-secondary my-2"
						onclick={createNewUser}
						disabled={!userNameInput}>Create</button
					>
				</div>
			</div>
		</div>
		<div id="BOT"></div>
	{:else if userID}
		<div id="TOP" class="flex flex-col">
			<HostNameDisplay hostName={buzzHost.name}/>

			<div class="flex flex-col bg-gray-200 p-2 rounded-md">
				<div>Welcome, {buzzUserData.name}</div>
				<div class="text-base text-gray-400">user id:{userID}</div>
				<button class="btn btn-sm btn-ghost m-2" onclick={() => userDeleteModal.showModal()}
					>🗑️
				</button>
			</div>

			<dialog id="userDeleteModal" class="modal">
				<div class="modal-box">
					<form method="dialog">
						<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
					</form>
					<p class="py-4">Are your sure you want to delete the user, ?</p>
					<div class="modal-action">
						<form method="dialog">
							<div class="flex justify-end">
								<button class="btn btn-sm btn-warning" onclick={handleDeleteUser}>DELETE</button>
							</div>
						</form>
					</div>
				</div>
			</dialog>
		</div>

		<div id="MID" class="text-2xl my-4 flex items-center gap-2">
			<div class="py-12 md:scale-125 lg:scale-150">
				<BuzzBtn {handleBtnClick} {isBuzzBtnLock} />
			</div>
		</div>
		<div id="BOT" class="flex flex-col justify-center items-center"></div>
	{/if}
</div>
