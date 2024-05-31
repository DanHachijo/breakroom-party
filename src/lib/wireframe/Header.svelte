<script>
	import { goto } from '$app/navigation';

  function goToGitHub() {
    window.open('https://github.com/DanNakatoshi/breakroom-party', '_blank');
  }
</script>

<div class="navbar flex justify-between rounded-b-lg bg-slate-700">
	<div id="left" class="dropdown dropdown-start ">
		<div tabindex="0" role="button" class="btn btn-ghost rounded-btn text-slate-50 jello-horizontal">Games</div>
		<div class="menu dropdown-content z-[1] p-2 shadow bg-slate-700 rounded-box w-52 mt-4 gap-2">
			<button class="btn btn-accent btn-sm" onclick={() => goto('/shuffle')}>Shuffle Game</button>
			<button class="btn btn-accent btn-sm" onclick={() => goto('/buzzer')}>Buzzer Button </button>
		</div>
	</div>
	<div id="center">
		<button class="btn btn-ghost text-slate-50 font-bold" onclick={() => goto('/')}>Break Room Party</button>
	</div>
	
		<div id="right" class="dropdown dropdown-end ">
			<div tabindex="0" role="button" class="btn btn-ghost rounded-btn text-slate-50 ">☰</div>
			<div class="menu dropdown-content z-[1] p-2 shadow bg-slate-700 rounded-box w-52 mt-4 gap-2">
			<button class="btn btn-link" onclick={() => privacyConsentModal.showModal()}>Privacy Policy</button>
			<button class="btn btn-link" onclick={goToGitHub}>GitHub</button>
			</div>
		</div>

</div>
