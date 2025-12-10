<template></template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useMainStore } from "~/stores/main";

const router = useRouter();
const store = useMainStore();
const authStore = useAuthStore();

const organizations = computed(() => store.organizations);

const redirect = () => {
	if (authStore.user === undefined) return router.replace({ name: "login" });

	router.replace({
		name: "dashboard-all",
	});
};

onMounted(redirect);

watch(organizations, redirect);
</script>

<route lang="yaml">
name: home
</route>
