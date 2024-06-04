<script>
	// import { goto } from '$app/navigation';
import { navigate, goToGitHub } from '$lib/helper/global'

	
</script>

<div class="navbar flex justify-between rounded-b-lg bg-slate-700">
	<div id="left" class="dropdown dropdown-start">
		<div
			tabindex="0"
			role="button"
			class="btn btn-ghost rounded-btn text-slate-50 jello-horizontal"
		>
			Games
		</div>
		<div class="menu dropdown-content z-[1] p-2 shadow bg-slate-700 rounded-box w-52 mt-4 gap-2">
			<!-- <a href="/shuffle" class="btn btn-accent btn-sm" >Shuffle Game</a>
			<a href="/buzzer" class="btn btn-accent btn-sm" >Buzzer Button</a> -->

			<button class="btn btn-accent btn-sm" onclick={() => navigate('/shuffle')}>Shuffle Game</button>
			<button class="btn btn-accent btn-sm" onclick={() => navigate('/buzzer')}>Buzzer Button </button>
		</div>
	</div>
	<div id="center">
		<button class="btn btn-ghost text-slate-50 font-bold" onclick={() => navigate('/')}
			>Break Room Party</button
		>
	</div>

	<div id="right" class="dropdown dropdown-end">
		<div tabindex="0" role="button" class="btn btn-ghost rounded-btn text-slate-50">☰</div>
		<div class="menu dropdown-content z-[1] p-2 shadow bg-slate-700 rounded-box w-52 mt-4 gap-2">
			<button class="btn btn-link" onclick={() => privacyConsentModal.showModal()}
				>Privacy Policy</button
			>
			<button class="btn btn-link" onclick={goToGitHub}>GitHub</button>
		</div>
	</div>
</div>

