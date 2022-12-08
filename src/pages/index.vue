<template></template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main";
import { useSettingsStore } from "~/stores/settings";

const route = useRouter();

onMounted(() => {
	const preferredOrganization = useSettingsStore().getPreferredOrganization;

	route.push({
		name: "organization-home",
		params: {
			organization_id:
				preferredOrganization !== ""
					? preferredOrganization
					: useMainStore().getOrganizations![0].id,
		},
	});
});
</script>

<route lang="yaml">
name: home
</route>
