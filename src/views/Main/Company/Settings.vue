<template>
	<Layout>
		<h1>Settings Page Company</h1>
	</Layout>
</template>

<script>
import Layout from "../Layout.vue";
export default {
	components: { Layout },
	name: "CompanySettings",
	props: {
		id: {
			required: true,
		},
	},
};
</script>

<style></style>
