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
import store from "../../../store";
import Layout from "../Layout.vue";
import AddBug from "../../../components/AddBug.vue";
import InviteModal from "../../../components/InviteModal.vue";
import BugsTable from "./BugsTable/Index.vue";

const props = defineProps({
	id: {
		required: true,
		type: String,
		desciption: "Project ID",
	},
});

const project = computed(() => store.getters.getProjectById(props.id));
</script>
