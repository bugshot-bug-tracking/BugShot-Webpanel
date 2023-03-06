<template></template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useMainStore } from "~/stores/main";
import { useSettingsStore } from "~/stores/settings";

const route = useRouter();
const store = useMainStore();

const organizations = computed(() => store.organizations);

const redirect = () => {
	if (organizations.value === undefined) {
		// redirect to new page
	} else {
		if (useAuthStore().new_user === true) {
			return route.replace({
				name: "new",
			});
		}

		// redirect to first org page or the favorite org page

		const preferredOrganization = useSettingsStore().getPreferredOrganization;

		const isPrefAvailable = organizations.value.find((o) => o.id == preferredOrganization);

		route.replace({
			name: "organization-home",
			params: {
				organization_id:
					preferredOrganization !== "" && isPrefAvailable !== undefined
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
