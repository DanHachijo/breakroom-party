<script>
	// import { goto } from '$app/navigation';
	import { navigate, goToGitHub } from '$lib/helper/global';
	import Dropdown from '$lib/wireframe/Dropdown.svelte';


	let dropdownItemsGames = [
		{
			name:"Shuffle Game",
			func: () => navigate('/shuffle')
		},
		{
			name:"Buzzer Button",
			func: () => navigate('/buzzer')
		},
	]

	let dropdownItemsMenu = [
		{
			name:"Privacy Policy",
			func: () => privacyConsentModal.showModal()
		},
		{
			name:"GitHub",
			func: goToGitHub
		},
	]

</script>



<div class="navbar flex justify-between rounded-b-lg bg-slate-700">
  <div id="left" class="dropdown dropdown-start z-[1]">
		<Dropdown items={dropdownItemsGames} btnName="Games"/>
  </div>
	<div id="center">
		<button class="btn btn-ghost text-slate-50 font-bold" onclick={() => navigate('/')}
			>Break Room Party</button
		>
	</div>

	<div id="right" class="dropdown dropdown-end">
		<Dropdown items={dropdownItemsMenu} btnName="☰" postion={'right-0'}/>
	</div>
</div>
