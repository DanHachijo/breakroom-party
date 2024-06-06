<script>
	import { navigate, goToGitHub } from '$lib/helper/global';
	import Shuffle from '$lib/components/shuffle/Shuffle.svelte';
	import BuzzBtn from '$lib/components/buzzer/BuzzBtn.svelte';
</script>

<div class="flex flex-col justify-center items-center text-2xl font-bold ">
  <div class="min-h-24 sm:min-h-80 flex items-center">

    <div class="flex flex-wrap items-end gap-2 p-2 min-h-24 justify-center ">
      <span class="">Welcome to </span>
      <span class="text-blue-400 text-4xl">Break room</span>
      <span class=""> Party 🎉</span>
    </div>
  </div>

	<div class="flex justify-center sm:justify-start w-full ">
		<div class="bg-slate-600 rounded-md p-4 grid grid-cols-12 gap-2 my-3 min-h-72 w-full sm:min-w-fit">
			<div class="col-span-12 sm:col-span-4 flex flex-col justify-between ">
				<h2 class="text2xl text-slate-50 font-bold">Shuffle Game</h2>
				<div class="mt-2">
					<ul class="list-disc list-inside text-slate-50 text-sm">
						<li>Fully editable and saves in the browser's memory</li>
						<li>Up to 4 customizable lists</li>
						<li>Can disable items once selected</li>
					</ul>
				</div>
				<div class="flex justify-center p-2">
					<button class="btn btn-info btn-md" onclick={() => navigate('/shuffle')}
						>Create my SHUFFLE</button
					>
				</div>
			</div>
			<div class="col-span-12 sm:col-span-8 ">
				<Shuffle isDemo={true} />
			</div>
		</div>
	</div>

	<div class="flex justify-center sm:justify-end w-full">
		<div class="bg-slate-600 rounded-md p-4 py-6 grid grid-cols-12 gap-2 my-3 min-h-72 w-full sm:min-w-fit">
			<div class="col-span-12 sm:col-span-8 flex justify-center items-center ">
				<BuzzBtn isDemo={true} />
			</div>

			<div class="col-span-12 sm:col-span-4 flex flex-col justify-between">
				<h2 class="text2xl text-slate-50 font-bold">Shuffle Game</h2>
				<div class="mt-2">
					<ul class="list-disc list-inside text-slate-50 text-sm">
						<li>Fully editable and saves in the browser's memory</li>
						<li>Up to 4 customizable lists</li>
						<li>Can disable items once selected</li>
					</ul>
				</div>
				<div class="flex justify-center p-2">
					<button class="btn btn-info btn-md" onclick={() => navigate('/buzzer')}
						>Create my BUZZ GAME
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
