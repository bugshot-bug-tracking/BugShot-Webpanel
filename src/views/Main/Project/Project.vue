<template>
	<Layout>
		<template v-slot:title>{{ project?.attributes.designation }}</template>

		<template v-slot:sub-title v-if="project">
			{{ project.attributes.company.attributes.designation }}
		</template>

		<template v-slot:top>
			<AddBug :id="id" />
			<InviteModal :dataType="'Project'" :id="id" />
		</template>

		<BugsTable v-if="project" :id="id" />
	</Layout>
</template>

<script setup>
import { computed } from "@vue/runtime-core";
import { useMainStore } from "src/stores/main";
import Layout from "../Layout.vue";
import AddBug from "../../../components/AddBug.vue";
import InviteModal from "../../../components/InviteModal.vue";
import BugsTable from "./BugsTable/Index.vue";
import { useProjectStore } from "src/stores/project";

const props = defineProps({
	id: {
		required: true,
		type: String,
		description: "Project ID",
	},
});

const project = computed(() => {
	let project = useMainStore().getProjectById(props.id);

	if (project) useProjectStore().init(props.id);

	return project;
});
</script>
