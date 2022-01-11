<template>
	<Layout>
		<h1>Settings Page Project</h1>
	</Layout>
</template>

<script>
import Layout from "../Layout.vue";
export default {
	components: { Layout },
	name: "ProjectSettings",
	props: {
		id: {
			required: true,
		},
	},
};
</script>

<style></style>
