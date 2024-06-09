<script>
	import { navigate, goToGitHub } from '$lib/helper/global';
	import Shuffle from '$lib/components/shuffle/Shuffle.svelte';
	import BuzzBtn from '$lib/components/buzzer/BuzzBtn.svelte';

	let clickedNames = $state([]);
	let isBtnALocked = $state(false);
	let isBtnBLocked = $state(false);

	function handleBtnClickA() {
		clickedNames = [...clickedNames, 'Person A'];
		isBtnALocked = true;
	}

	function handleBtnClickB() {
		clickedNames = [...clickedNames, 'Person B'];
		isBtnBLocked = true;
	}

	function resetBtns() {
		clickedNames = [];
		isBtnALocked = false;
		isBtnBLocked = false;
	}
</script>

<div class="flex flex-col justify-between items-center text-2xl font-bold p-2">
	<div class="min-h-24 sm:min-h-80 flex items-center">
		<div class="flex flex-wrap items-end gap-2 p-2 min-h-24 justify-center">
			<span class="">Welcome to </span>
			<span class="text-blue-400 text-4xl">Break room</span>
			<span class=""> Party 🎉</span>
		</div>
	</div>

	<div class="flex justify-center sm:justify-start w-full">
		<div
			class="bg-slate-700  rounded-md p-4 grid grid-cols-12 gap-2 my-3 min-h-72 w-full sm:min-w-fit hover-scale"
		>
    <div class="col-span-12 md:col-span-4 flex flex-col justify-between">
        <h2 class="flex justify-center text-4xl text-accent font-bold ">SHUFFLE GAME</h2>

				<div class="mt-2">
					<ul class="list-disc list-inside text-slate-50 text-sm">
						<li>Fully editable and saves in the browser's memory</li>
						<li>Up to 4 customizable lists</li>
						<li>Can disable items once selected</li>
					</ul>
				</div>
				<div class="flex justify-center p-2">
					<button class="btn btn-accent btn-lg" onclick={() => navigate('/shuffle')}
						>CREATE SHUFFLE GAME</button
					>
				</div>
			</div>
			<div class="col-span-12 md:col-span-8">
				<Shuffle isDemo={true} />
			</div>
		</div>
	</div>

	<div class="flex justify-center sm:justify-end w-full">
		<div
			class="bg-slate-700 rounded-md p-4 py-6 grid grid-cols-12 gap-2 my-3 min-h-72 w-full sm:min-w-fit hover-scale"
		>


    <div class="col-span-12 md:col-span-4 flex flex-col justify-between">
      <h2 class="flex justify-center  text-4xl text-accent font-bold ">BUZZER BUTTON</h2>
      <div class="mt-2">
        <ul class="list-disc list-inside text-slate-50 text-sm">
          <li>Fully editable and saves in the browser's memory</li>
          <li>Up to 4 customizable lists</li>
          <li>Can disable items once selected</li>
        </ul>
      </div>
      <div class="flex justify-center p-2">
        <button class="btn btn-accent btn-lg" onclick={() => navigate('/buzzer')}
          >CREATE BUZZ GAME
        </button>
      </div>
    </div>

			<div class="col-span-12 md:col-span-8 flex flex-wrap justify-around items-center">

				<div class="flex gap-8 flex-wrap">
					<div class="flex flex-col items-center">
						<BuzzBtn
							isDemo={true}
							handleBtnClick={handleBtnClickA('Person A')}
							isBuzzBtnLock={isBtnALocked}
						/>
						<p class="text-slate-50">Person A</p>
					</div>
					<div class="flex flex-col items-center">
						<BuzzBtn
							isDemo={true}
							handleBtnClick={handleBtnClickB('Person B')}
							isBuzzBtnLock={isBtnBLocked}
						/>
						<p class="text-slate-50">Person B</p>
					</div>
				</div>

        <div class="min-w-28 flex flex-col justify-between p-2">
          <div class="min-h-24 text-slate-50">

            {#each clickedNames as name}
						<div>
              {name}
						</div>
            {/each}
          </div>
          {#if clickedNames.length >= 1}
					<button onclick={resetBtns} class="btn btn-md btn-info">RESET</button>
          {/if}
				</div>

			</div>


		</div>
	</div>
</div>
