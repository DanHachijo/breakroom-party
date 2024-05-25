<script>
	import { goto } from '$app/navigation';
</script>

<div class="navbar bg-base-300 rounded-b-lg">
	<div class="flex-1">
		<button class="btn btn-ghost text-base" onclick={() => goto('/')}>Breakroom Party</button>
	</div>
	<div class="dropdown dropdown-end">
		<div tabindex="0" role="button" class="btn btn-ghost rounded-btn">Games</div>
		<div
			class="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4 gap-2 "
		>
			<button class="btn " onclick={() => goto('/shuffle')}>shuffle</button>
			<button class="btn " onclick={() => goto('/buzzer')}>Buzzer Button </button>
		</div>
	</div>
</div>
