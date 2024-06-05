<script>
	// import { goto } from '$app/navigation';
	import { navigate, goToGitHub } from '$lib/helper/global';
	import Dropdown from '$lib/wireframe/Dropdown.svelte';

	let items = ['Shuffle Game', 'Buzzer Button', 'Privacy Policy'];

	let dropdownItems = [
		{
			name:"Shuffle Game",
			func: () => navigate('/shuffle')
		},
		{
			name:"Buzzer Button",
			func: () => navigate('/buzzer')
		},
	]

</script>



<div class="navbar flex justify-between rounded-b-lg bg-slate-700">
  <div id="left" class="dropdown dropdown-start z-[1]">
		<Dropdown items={dropdownItems}/>


    <!-- <summary
      class="btn btn-ghost rounded-btn text-slate-50 jello-horizontal"
      aria-haspopup="true"
      aria-expanded="false"
      aria-controls="games-menu"
    >
      Games
    </summary>
    <ul
      id="games-menu"
      class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
      aria-labelledby="games-menu-button"
    >
      <li>
        <button class="btn btn-accent btn-sm mt-2" onclick={() => navigate('/shuffle')}>
          Shuffle Game
        </button>
      </li>
      <li>
        <button class="btn btn-accent btn-sm mt-2" onclick={() => navigate('/buzzer')}>
          Buzzer Button
        </button>
      </li>
    </ul> -->
  </div>

	<div id="center">
		<button class="btn btn-ghost text-slate-50 font-bold" onclick={() => navigate('/')}
			>Break Room Party</button
		>
	</div>

	<div id="right" class="dropdown dropdown-end">
		<div tabindex="0" role="button" class="btn btn-ghost rounded-btn text-slate-50">☰</div>
		<div class="menu dropdown-content z-[10] p-2 shadow bg-slate-700 rounded-box w-52 mt-4 gap-2">
			<button class="btn btn-link" onclick={() => privacyConsentModal.showModal()}
				>Privacy Policy</button
			>
			<button class="btn btn-link" onclick={goToGitHub}>GitHub</button>
		</div>
	</div>
</div>
