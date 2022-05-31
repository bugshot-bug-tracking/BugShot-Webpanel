<template>
	<Layout>
		<h1>Company Invoices</h1>
		<h4>{{ id }}</h4>
	</Layout>
</template>

<script setup>
import Layout from "../Layout.vue";

const props = defineProps({
	id: {
		required: true,
	},
});
</script>

<style></style>
