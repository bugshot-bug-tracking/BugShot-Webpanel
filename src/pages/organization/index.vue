<template></template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main";

const store = useMainStore();

const route = useRouter();

route.push({ name: "organization", params: { id: store.getOrganizations![0].id } });
</script>

<route lang="yaml">
name: organization-index
</route>
