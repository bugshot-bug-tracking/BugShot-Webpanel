<template>
	<T2Page>
		<template #header>
			<T3Header>
				<template #l-top>
					{{ $t("all_projects") }}
				</template>

				<template #l-bottom>
					{{ resource?.attributes.designation }}
				</template>

				<template #center>
					<SearchBar />
				</template>
			</T3Header>
		</template>

		<div class="groups bs-scroll">
			<TrialBanner />

			<GroupContainer v-for="company of companies" :key="company.id">
				<template #top-left>
					<RouterLink
						:to="{
							name: 'company',
							params: { organization_id: organization_id, company_id: company.id },
						}"
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
					:to_settings="{
						name: 'project-settings',
						params: {
							organization_id: organization_id,
							company_id: company.id,
							project_id: project.id,
						},
					}"
				/>
			</GroupContainer>
		</div>
	</T2Page>
</template>

<script setup lang="ts">
import timeToText from "~/util/timeToText";
import { useOrganizationStore } from "~/stores/organization";

const props = defineProps({
	organization_id: {
		type: String,
		required: true,
		description: "Organization ID",
	},
});

const store = useOrganizationStore();
const router = useRouter();

const resource = computed(() => store.getOrganization);

const companies = computed(() => {
	return [...(store.getCompanies ?? [])]
		.filter((record) => record.attributes.projects?.length || 0 > 0)
		.sort((a, b) => (a.attributes.updated_at < b.attributes.updated_at ? 1 : -1));
});

const companyProjects = (id: string) => store.getCompanyProjects(id);

const goToProject = (company_id: string, project_id: string) => {
	router.push({
		name: "project",
		params: {
			organization_id: props.organization_id,
			company_id: company_id,
			project_id: project_id,
		},
	});
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
name: organization-home
</route>
