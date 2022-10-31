<template>
	<T2Page>
		<template #header>
			<T2Header>
				<template #l-top>
					{{ $t("project_settings") }}
				</template>

				<template #l-bottom>
					{{
						project.id
							? project.attributes.designation
							: $t("loading")
					}}
				</template>
			</T2Header>
		</template>
	</T2Page>
</template>

<script setup lang="ts">
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

const store = useProjectStore();

store.init(props.id, props.project_id);

watch(
	props,
	() => {
		store.init(props.id, props.project_id);
	},
	{ deep: true }
);

const project = computed(() => {
	let s = store.getProject;
	console.log(s);
	return s;
});
</script>

<style scoped></style>

<route lang="yaml">
name: project-settings
</route>
