<template>
	<Layout>
		<h1>Company Invoices</h1>
		<h4>{{ id }}</h4>
	</Layout>
</template>

<script>
import Layout from "../Layout.vue";
export default {
	components: { Layout },
	name: "CompanyInvoices",
	props: {
		id: {
			required: true,
		},
	},
};
</script>

<style></style>
