<template></template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main";

const store = useMainStore();

const route = useRouter();

route.push({
	name: "organization-home",
	params: { organization_id: store.getOrganizations![0].id },
});
</script>

<route lang="yaml">
name: home
</route>
