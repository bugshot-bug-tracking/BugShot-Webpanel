<template>
	<Layout>
		<template v-slot:title>{{ project?.attributes.designation }}</template>

		<template v-slot:sub-title>
			{{ project?.attributes.company.designation }}
		</template>

		<template v-slot:top>
			<button>Project Settings</button>
		</template>
	</Layout>
</template>

<script>
import { computed, reactive } from "@vue/reactivity";
import Layout from "../Layout.vue";
import store from "../../../store";
export default {
	components: {
		Layout,
	},
	props: {
		id: {
			required: true,
		},
	},
	setup(props) {
		const project = computed(() => {
			//!!!!!!!!!!!!!!!!! !TODO! update after UUID Changes

			const match = store.getters.getProjectById(parseInt(props.id));


			return match;
		});

		return {
			project,
		};
	},
};
</script>

<style></style>
