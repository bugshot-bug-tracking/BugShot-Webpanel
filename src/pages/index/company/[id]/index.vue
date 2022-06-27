<template>
	<T2Page>
		<template #header>
			<T2Header>
				<template #l-top>
					{{ $t("project", 2) }}
				</template>

				<template #l-bottom>
					{{
						company ? company.attributes.designation : $t("loading")
					}}
				</template>

				<InviteModal :dataType="'Company'" :id="id" />

				<CreateDataModal
					:dataType="'Project'"
					:postPath="`companies/${id}/projects`"
					:aditionalBody="{
						company_id: id,
					}"
					:subTitle="`${$t('company')}: ${
						company?.attributes.designation
					}`"
				/>
				<router-link
					:to="{ name: 'company-settings', params: { id: id } }"
					class="bs-btn green empty text-capitalize"
				>
					{{ $t("company_settings") }}
				</router-link>
			</T2Header>
		</template>

		<div class="bs-scroll s-green w-100 h-100" v-if="company && projects">
			<GroupContainer>
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
					v-for="project of projects"
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
					@open="goToProject(project.id)"
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
import { Project } from "~/models/Project";
import { useMainStore } from "~/stores/main";
import timeToText from "~/util/timeToText";

const props = defineProps({
	id: {
		required: true,
		type: String,
		description: "Company ID",
	},
});

const store = useMainStore();
const router = useRouter();

const company = computed(() => store.getCompanyById(props.id));

const projects = computed(() => store.getCompanyProjects(props.id));

const goToProject = (id: string) => {
	router.push({ name: "project", params: { id: id } });
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
.groups {
	width: 100%;
	height: 100%;
}
</style>

<route lang="yaml">
name: company
</route>
