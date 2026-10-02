<script lang="ts">
	import '$lib/scss/global.scss';
	import type { Hst } from '@histoire/plugin-svelte';
	import Logo from '$lib/components/atoms/Logo.svelte';

	export let Hst: Hst;
</script>

<Hst.Story title="Atoms/Logo" layout={{ type: 'grid', width: 400 }}>
	<!-- Logo takes no props; the old Animated/Static variants referenced an
	     `animated` prop that no longer exists. -->
	<Hst.Variant title="Default">
		<Logo />
	</Hst.Variant>
</Hst.Story>
