<template>
	<div>{{ id }}</div>
</template>

<script setup lang="ts">
defineProps({
	id: {
		type: String,
		required: true,
		description: "Organization id",
	},
});
</script>

<style scoped></style>

<route lang="yaml">
name: organization-payments
</route>
