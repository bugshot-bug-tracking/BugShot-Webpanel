<template></template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main";
import { useSettingsStore } from "~/stores/settings";

const route = useRouter();
const store = useMainStore();

onMounted(() => {
	if (store.organizations === undefined || store.organizations.length < 1) {
		// redirect to new page
	} else {
		// redirect to first org page or the favorite org page

		const preferredOrganization = useSettingsStore().getPreferredOrganization;

		route.replace({
			name: "organization-home",
			params: {
				organization_id:
					preferredOrganization !== ""
						? preferredOrganization
						: store.organizations[0].id,
			},
		});
	}
});
</script>

<route lang="yaml">
name: home
</route>
