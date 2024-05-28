<script>
	import {
		fetchBuzzUser,
		addBuzzUser,
		deleteBuzzUser,
		handleBuzzButtonClick,
		subscribeToBuzzBtnUnlock,
		checkBuzzBtnExistence,
		subscribeToUserDelete,
		subscribeToUserWinNum
	} from '$lib/supabase/buzzerClient.js';
	import {
		getBuzzUserIDFromLocal,
		setBuzzUserIDToLocal,
		deleteBuzzUserIDFromLocal,
	} from '$lib/helper/buzzer';
	import { toastMgr } from '$lib/helper/toastStore.svelte';
	import { onMount } from 'svelte';
	import BuzzBtn from '$lib/components/buzzer/BuzzBtn.svelte';
	import HostNameDisplay from '$lib/components/buzzer/HostNameDisplay.svelte';
	import { hostDataMgr } from '$lib/helper/buzzerStore.svelte';
	import UserInfoDisplay from '$lib/components/buzzer/UserInfoDisplay.svelte';
	import JSConfetti from 'js-confetti';

	let jsConfetti;

	let { data } = $props();

	hostDataMgr.updateData(data.props.buzzHost)
	
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
			toggleBuzzBtn(true);
			subscribeToBuzzBtnUnlock(userID, buzz_game_id, toggleBuzzBtn);
		} else {
			toggleBuzzBtn(false);
		}
	});

	// END Btn Component

	let createUserState = $state({
		uuid: hostDataMgr.hostData?.uuid,
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
			subscribeToUserWinNum(userID, updateAfterWin)
			toastMgr.addToastMsgQue('User is created', 'alert-info');
		} catch (error) {
			showAlert('Error creating user');
		}
	}

	async function fetchUserInfo() {
		try {
			const [userInfo] = await fetchBuzzUser(userID, hostDataMgr.hostData.uuid);
			buzzUserData = userInfo;
			updateUserID();
			toastMgr.addToastMsgQue('User info is fetched', 'alert-info');
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
	function updateAfterWin(data) {
		buzzUserData = data
		triggerConfetti()
	}

	function resetUserInfoAfterDelete() {
		buzzUserData = defaultBuzzUser;
		userID = null;
		buzz_game_id = null;
		isBuzzBtnLock = false;
		deleteBuzzUserIDFromLocal();
		toastMgr.addToastMsgQue('User is deleted', 'alert-warning');
		console.log("deleted")

	}

	async function listenUserDeletion() {
		console.log("Listening delete")
		console.log(userID)

		try {
			await subscribeToUserDelete(userID, resetUserInfoAfterDelete);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	// async function handleDeleteUser() {
	// 	try {
	// 		if (userID && hostDataMgr.hostData.uuid) {
	// 			const response = await deleteBuzzUser(userID, hostDataMgr.hostData.uuid);
	// 		} else {
	// 			console.error('UserID or UUID is missing');
	// 		}
	// 	} catch (error) {
	// 		console.error('Error deleting user:', error.message);
	// 	}
	// }
	function triggerConfetti() {
		jsConfetti.addConfetti({
			emojiSize: 100,
			confettiNumber: 30,
			emojis: ['🚀', '⭐', '💥', '✨', '🌎', '😊']
		});
	}


	onMount(async () => {
		userID = getBuzzUserIDFromLocal();
		if (userID) {
			await fetchUserInfo();
			buzz_game_id = await checkBuzzBtnExistence(userID);
			subscribeToBuzzBtnUnlock(userID, buzz_game_id, toggleBuzzBtn);
			await listenUserDeletion();
			await subscribeToUserWinNum(userID, updateAfterWin)
		}
		jsConfetti = new JSConfetti();
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
			<HostNameDisplay />

		</div>

		<div id="MID" class="text-2xl flex items-center gap-2">
			<div class=" md:scale-125 ">
				<BuzzBtn {handleBtnClick} {isBuzzBtnLock} />
			</div>
		</div>
		<div id="BOT" class="flex flex-col justify-center items-center">
			<UserInfoDisplay  userId={userID} userName={buzzUserData.name} winNum={buzzUserData.win_num} uuid={hostDataMgr.hostData.uuid}/>
		</div>
	{/if}
</div>
