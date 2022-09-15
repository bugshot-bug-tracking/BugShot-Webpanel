<template>
	<T2Page>
		<template #header>
			<h3>{{ $t("all_projects") }}</h3>
		</template>

		<div class="groups bs-scroll">
			<GroupContainer v-for="company of companies" :key="company.id">
				<template #top-left>
					<RouterLink
						:to="{ name: 'company', params: { id: company.id } }"
					>
						{{ company.attributes.designation }}
					</RouterLink>
				</template>

				<template #top-right>
					{{
						$t("last_update", {
							time: timeToText(company.attributes.updated_at),
						})
					}}
				</template>

				<ProjectCard
					v-for="project of companyProjects(company.id)"
					:key="project.id"
					:title="project.attributes.designation"
					:lastEdit="project.attributes.updated_at"
					:image="project.attributes.image?.attributes.base64"
					:color="project.attributes.color_hex"
					:progress="{
						done: project.attributes.bugsDone,
						total: project.attributes.bugsTotal,
					}"
					actions
					@open="goToProject(company.id, project.id)"
					@edit="openEdit(project)"
					@delete="openDelete(project)"
				/>
			</GroupContainer>
		</div>
	</T2Page>

	<EditModal v-if="edit.visible" :id="edit.project_id" @close="edit.reset" />

	<DeleteModal
		v-if="deleteAction.visible"
		:text="deleteAction.text"
		:callback="deleteAction.execute"
		@close="deleteAction.reset"
	/>
</template>

<script setup lang="ts">
import timeToText from "~/util/timeToText";
import { useMainStore } from "~/stores/main";
import { Project } from "~/models/Project";

const store = useMainStore();
const router = useRouter();

const companies = computed(() => {
	return [...store.getCompanies]
		.map((r) => r[1])
		.filter((record) => record.attributes.projects?.length || 0 > 0)
		.sort((a, b) =>
			a.attributes.updated_at < b.attributes.updated_at ? 1 : -1
		);
});

const companyProjects = (id: string) => store.getCompanyProjects(id);

const goToProject = (company_id: string, project_id: string) => {
	router.push({
		name: "project",
		params: { id: company_id, project_id: project_id },
	});
};

const edit = reactive({
	visible: false,
	company_id: "",
	project_id: "",
	reset: () => {
		edit.visible = false;
		edit.company_id = "";
		edit.project_id = "";
	},
});
const openEdit = (project: Project) => {
	edit.company_id = project.attributes.company.id;
	edit.project_id = project.id;
	edit.visible = true;
};

const deleteAction = reactive({
	visible: false,
	text: "",
	execute: () => {},
	reset: () => {
		deleteAction.visible = false;
		deleteAction.text = "";
		deleteAction.execute = () => {};
	},
});
const openDelete = (project: Project) => {
	deleteAction.text = project.attributes.designation;
	deleteAction.execute = async () => {
		await store.deleteProject(project.id);
	};
	deleteAction.visible = true;
};
</script>

<style lang="scss" scoped>
h3 {
	font-weight: bold;
	padding: 1rem;
	height: 100%;
	display: flex;
	align-items: center;
}

.groups {
	width: 100%;
	height: 100%;
}
</style>

<route lang="yaml">
name: home
</route>
