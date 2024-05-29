<script>
  import { onMount } from 'svelte';
  import { policyContent } from '$lib/components/privacyPolicy/policyContent';

  let gtagScript;

  // Function to update consent state
  function updateConsent() {
    localStorage.setItem('consentGranted', 'true');

    // Function to initialize gtag
    function gtag() {
      dataLayer.push(arguments);
    }

    // Initialize dataLayer and gtag consent
    window.dataLayer = window.dataLayer || [];
    gtag('consent', 'update', {
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      ad_storage: 'granted',
      analytics_storage: 'granted'
    });

    // Load gtag.js script
    gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-L8ER5KHEJ3';

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(gtagScript, firstScript);
    
    // Close the modal after updating consent
    privacyConsentModal.close();
  }

  // Function to handle rejection of consent
  function rejectConsent() {
    localStorage.setItem('consentGranted', 'false');
    if (gtagScript) {
      gtagScript.parentNode.removeChild(gtagScript);
      gtagScript = null;
    }
    privacyConsentModal.close();
  }

  onMount(() => {
    const consentGranted = localStorage.getItem('consentGranted');
    if (consentGranted === 'true') {
      // Load gtag.js if consent is already granted
      gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-L8ER5KHEJ3';

      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(gtagScript, firstScript);
    } else if (consentGranted === 'false') {
      // Handle the case where consent is rejected
      console.log('Consent was rejected previously');
    } else {
      privacyConsentModal.showModal();
    }
  });
</script>

<div>
  <dialog id="privacyConsentModal" class="modal   ">
    <div class="modal-box rounded-none">
      <h3 class="text-2xl">Privacy Policy</h3>
      <div class="p-2">
        {@html policyContent}
      </div>
      <div class="modal-action">
        <form method="dialog">
          <!-- If there is a button in the form, it will close the modal -->
          <button class="btn" type="button" onclick={rejectConsent}>Reject</button>
          <button class="btn btn-success" type="button" onclick={updateConsent}>Consent</button>
        </form>
      </div>
    </div>
  </dialog>
</div>

