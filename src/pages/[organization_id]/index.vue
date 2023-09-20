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

				<template #actions>
					<OrderPopover v-model:value="orderRef" :header="$t('order.porject')" />
				</template>
			</T3Header>
		</template>

		<n-scrollbar flex-1>
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
					:image="project.attributes.image?.attributes.url"
					:color="project.attributes.color_hex"
					:progress="{
						done: project.attributes.bugsDone,
						total: project.attributes.bugsTotal,
					}"
					:actions="
						(useOrganizationStore().getUserRole?.id ?? 9) < 2 ||
						(company.attributes.role?.id ?? 9) < 2 ||
						(project.attributes.role?.id ?? 9) < 2
					"
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
		</n-scrollbar>
	</T2Page>
</template>

<script setup lang="ts">
import timeToText from "~/util/timeToText";
import { useOrganizationStore } from "~/stores/organization";
import useOrderResource from "~/composables/OrderResource";
import { useSettingsStore } from "~/stores/settings";
import { Project } from "~/models/Project";

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

const companyProjects = (id: string) => {
	return orderedList(store.getCompanyProjects(id) ?? []) as Project[];
};

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

const { orderRef, orderedList } = useOrderResource();

onMounted(() => {
	orderRef.value = useSettingsStore().getProjectsOrder;
});

watch(orderRef, () => {
	useSettingsStore().setProjectsOrder(orderRef.value);
});
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
