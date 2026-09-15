<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FleetSection from '$lib/components/FleetSection.svelte';
	import FleetComparison from '$lib/components/FleetComparison.svelte';
</script>

<svelte:head><title>Our Fleet | SAN Transport Services</title></svelte:head>

<Navbar />
<FleetSection />
<FleetComparison />
<Footer />