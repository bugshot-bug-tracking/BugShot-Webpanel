<template>
	<T2Page>
		<template #header>
			<T2Header v-if="project.id">
				<template #l-top>
					<a :href="project.attributes.url" target="_blank">
						{{ project.attributes.designation }}

						<img
							src="/src/assets/icons/external-link.svg"
							alt="external"
							w-3
							v-if="project.attributes.url"
						/>
					</a>
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

<script setup lang="ts">
import { useMainStore } from "~/stores/main";
import { useProjectStore } from "~/stores/project";

const props = defineProps({
	id: {
		required: true,
		type: String,
		description: "Company ID",
	},
	project_id: {
		required: true,
		type: String,
		description: "Project ID",
	},
});

useProjectStore().init(props.id, props.project_id);

watch(
	props,
	() => {
		useProjectStore().init(props.id, props.project_id);
	},
	{ deep: true }
);

const project = computed(() => useProjectStore().getProject);


</script>

<route lang="yaml">
name: project
</route>
