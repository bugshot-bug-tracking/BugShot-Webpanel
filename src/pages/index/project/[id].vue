<template>
	<T2Page>
		<template #header>
			<T2Header v-if="project">
				<template #l-top>
					{{ project.attributes.designation }}
				</template>

				<template #l-bottom>
					{{ project.attributes.company.attributes.designation }}
				</template>

				<AddBug :id="id" />

				<InviteModal :dataType="'Project'" :id="id" />
			</T2Header>
		</template>

		<BugsTable v-if="project" :id="id" />
	</T2Page>
</template>

<script setup>
import { useMainStore } from "~/stores/main";
import { useProjectStore } from "~/stores/project";

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

<route lang="yaml">
name: project
</route>
