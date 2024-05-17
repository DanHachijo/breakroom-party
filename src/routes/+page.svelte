<script>
	import { get } from '$lib/supabase/client';

	async function fetchData() {
		try {
			const response = await get();
			if (response.status === 200) {
				console.log('Data fetched successfully:', response.body.data);
				// Do something with the fetched data
			} else {
				console.error('Failed to fetch data:', response.body.error);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	fetchData();
</script>

<h1 class="text-3xl font-bold underline">Hello world!</h1>
<button class="btn btn-primary">Btn</button>
