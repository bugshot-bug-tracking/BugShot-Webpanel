<template></template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useMainStore } from "~/stores/main";
import { useSettingsStore } from "~/stores/settings";

const router = useRouter();
const store = useMainStore();
const authStore = useAuthStore();

const organizations = computed(() => store.organizations);

const redirect = () => {
	if (organizations.value === undefined) {
		// redirect to new page

		if (useAuthStore().user === undefined) return router.replace({ name: "login" });

		router.replace({
			name: "dashboard-all",
		});
	} else {
		if (
			authStore.new_user === true &&
			authStore.user?.attributes.trial_end_date == null &&
			(authStore.user?.attributes.subscriptions?.length ?? 0) === 0 &&
			(store.organizations?.length ?? 0) <= 1
		) {
			return router.replace({
				name: "new",
			});
		}

		// // redirect to first org page or the favorite org page

		// const preferredOrganization = useSettingsStore().getPreferredOrganization;

		// const isPrefAvailable = organizations.value.find((o) => o.id == preferredOrganization);

		// router.replace({
		// 	name: "organization-home",
		// 	params: {
		// 		organization_id:
		// 			preferredOrganization !== "" && isPrefAvailable !== undefined
		// 				? preferredOrganization
		// 				: store.getMyOrganization.id,
		// 	},
		// });

		router.replace({
			name: "dashboard-all",
		});
	}
};

onMounted(redirect);

watch(organizations, redirect);
</script>

<route lang="yaml">
name: home
</route>
