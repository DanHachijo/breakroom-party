<script>
	import { onMount } from 'svelte';
  import {policyContent} from '$lib/components/privacyPolicy/policyContent'
	// Function to update consent state
	function updateConsent() {
		localStorage.setItem('consentGranted', 'true');
		function gtag() {
			dataLayer.push(arguments);
		}

		gtag('consent', 'update', {
			ad_user_data: 'granted',
			ad_personalization: 'granted',
			ad_storage: 'granted',
			analytics_storage: 'granted'
		});

		// Load gtag.js script.
		var gtagScript = document.createElement('script');
		gtagScript.async = true;
		gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-L8ER5KHEJ3';

		var firstScript = document.getElementsByTagName('script')[0];
		firstScript.parentNode.insertBefore(gtagScript, firstScript);
	}

	onMount(() => {
		// Check if consent is already granted
		const consentGranted = localStorage.getItem('consentGranted');
		if (consentGranted === 'true') {
			// Load gtag.js if consent is already granted
			var gtagScript = document.createElement('script');
			gtagScript.async = true;
			gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-L8ER5KHEJ33';

			var firstScript = document.getElementsByTagName('script')[0];
			firstScript.parentNode.insertBefore(gtagScript, firstScript);
		} else {
      privacyConsentModal.showModal()
    }
		console.log(`consentGranted ${consentGranted}`);
	});
</script>

<!-- <button class="btn" onclick={() => privacyConsentModal.showModal()}>open modal</button> -->

<div>

	<dialog id="privacyConsentModal" class="modal modal-bottom ">
		<div class="modal-box rounded-none">
      <h3 class="text-2xl">Privacy Policy</h3>
      <div class="p-2 ">
        {@html policyContent}
      </div>
      <div class="modal-action">
				<form method="dialog">
					<!-- if there is a button in form, it will close the modal -->
					<button class="btn">Reject</button>
					<button class="btn" onclick={updateConsent}>Consent</button>
				</form>
			</div>
		</div>
	</dialog>
</div>
