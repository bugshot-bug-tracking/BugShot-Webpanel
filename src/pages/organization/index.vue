<template></template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main";

const store = useMainStore();

const route = useRouter();

route.replace({ name: "organization", params: { id: store.getMyOrganization.id } });
</script>

<route lang="yaml">
name: organization-index
</route>
