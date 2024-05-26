<script>
	import { goto } from '$app/navigation';
</script>

<div class="navbar flex justify-between rounded-b-lg bg-gradient">
	<div id="left" class="dropdown dropdown-start ">
		<div tabindex="0" role="button" class="btn btn-ghost rounded-btn text-slate-50 jello-horizontal">Mini Games</div>
		<div class="menu dropdown-content z-[1] p-2 shadow bg-gradient rounded-box w-52 mt-4 gap-2">
			<button class="btn btn-accent" onclick={() => goto('/shuffle')}>Shuffle Game</button>
			<button class="btn btn-accent" onclick={() => goto('/buzzer')}>Buzzer Button </button>
		</div>
	</div>
	<div id="center">
		<button class="btn btn-ghost text-slate-50 font-bold" onclick={() => goto('/')}>Breakroom Party</button>
	</div>
		<div id="right" class="dropdown dropdown-end ">
			<div tabindex="0" role="button" class="btn btn-ghost rounded-btn text-slate-50 ">Menu</div>
			<div class="menu dropdown-content z-[1] p-2 shadow bg-gradient rounded-box w-52 mt-4 gap-2">
			<button class="btn" onclick={() => privacyConsentModal.showModal()}>Privacy Policy</button>
			</div>
		</div>

</div>
