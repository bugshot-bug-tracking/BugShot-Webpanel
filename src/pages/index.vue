<template></template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main";
import { useSettingsStore } from "~/stores/settings";

const route = useRouter();
const store = useMainStore();

const organizations = computed(() => store.organizations);

const redirect = () => {
	if (organizations.value === undefined || organizations.value.length < 1) {
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
						: store.getMyOrganization.id,
			},
		});
	}
};

onMounted(redirect);

watch(organizations, redirect);
</script>

<route lang="yaml">
name: home
</route>
