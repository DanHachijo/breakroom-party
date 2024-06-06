<script>
	let { handleBtnClick, isBuzzBtnLock, isDemo = false } = $props();
</script>

<div class="flex flex-col justify-center items-center gap-2 min-h-44	 ">
	<div class="button-frame plastic">
		<button
			class="the-button plastic z-10 {isBuzzBtnLock ? 'disabled' : ''}"
			onclick={handleBtnClick}
			disabled={isBuzzBtnLock}
		></button>
	</div>
</div>

<div class="z-0 font-bold text-5xl {isBuzzBtnLock ? 'text-red-500' : 'text-blue-500'}">
	{#if !isDemo}
		{isBuzzBtnLock ? 'BUZZED' : 'READY'}
	{/if}
</div>

<style>
	.the-button {
		border-radius: 50%;
		box-shadow:
			0 0 0.5em rgba(0, 0, 0, 1),
			inset 0 0.25em 0.3em rgba(255, 255, 255, 0.3),
			inset 0 -0.25em 0.3em rgba(0, 0, 0, 0.5);
		cursor: pointer;
		font: inherit;
		height: 100%;
		padding: 0;
		position: relative;
		width: 100%;
	}

	.the-button:before {
		background: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.14) 0%,
			rgba(255, 255, 255, 0) 50%,
			rgba(255, 255, 255, 0) 100%
		);
		border-radius: 50%;
		content: ' ';
		height: 80%;
		left: 10%;
		position: absolute;
		top: 10%;
		width: 80%;
	}

	.the-button:active {
		box-shadow:
			0 0 0.5em rgba(0, 0, 0, 1),
			inset 0 0.1em 0.3em rgba(0, 0, 0, 0.5),
			inset 0 -0.1em 0.3em rgba(0, 0, 0, 0.5);
	}

	/* DISABLED */
	.the-button.disabled {
		cursor: not-allowed;
	}

	.the-button.disabled:active {
		box-shadow:
			0 0 0.5em rgba(0, 0, 0, 1),
			inset 0 0.25em 0.3em rgba(255, 255, 255, 0.3),
			inset 0 -0.25em 0.3em rgba(0, 0, 0, 0.5);
	}

	.the-button.disabled:active:before {
		top: 10%;
	}
	/* END DISABLED */

	.the-button:active:before {
		top: 11.5%;
	}

	.button-frame {
		background: #cc0000;
		border-radius: 50%;
		display: block;
		height: 7em;
		margin: auto;
		padding: 0.55em;
		position: relative;
		width: 7em;
		z-index: 20;
	}

	.plastic {
		background: linear-gradient(to bottom, #b01e1e 0%, #920f0f 100%);
	}
</style>
