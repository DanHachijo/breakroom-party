<script>
	import { navigate, goToGitHub } from '$lib/helper/global';
</script>

<div class="flex flex-col justify-center items-center h-full text-2xl font-bold">
	<div class="flex flex-wrap items-end gap-2 p-2">
		<span class="">Welcome to </span>
		<span class="text-blue-400 text-4xl">Break room</span>
		<span class=""> Party 🎉</span>
	</div>

  <div class="flex flex-wrap gap-2">
    <button class="btn btn-accent btn-sm" onclick={() => navigate('/shuffle')}>Shuffle Game</button>
    <button class="btn btn-accent btn-sm" onclick={() => navigate('/buzzer')}>Buzzer Button </button>
    <button class="btn btn-link" onclick={goToGitHub}>GitHub</button>
  </div>
</div>