<template>
	<Layout>
		<template v-slot:left>
			<CompanySidebar />
		</template>

		<template v-slot:title>Projects</template>

		<template v-slot:sub-title>{{
			activeCompany?.attributes?.designation
		}}</template>

		<template v-slot:top> Top Content </template>

		<h1>Main Page</h1>
	</Layout>
</template>

<script>
import Layout from "./Layout.vue";
import CompanySidebar from "./Company/Sidebar.vue";
import { computed } from "@vue/reactivity";
import store from "../../store";

export default {
	components: { Layout, CompanySidebar },
	name: "MainPage",
	setup() {
		const activeCompany = computed(() => {
			return store.getters.getActiveCompany;
		});

		return {
			activeCompany,
		};
	},
};
</script>

<style></style>
