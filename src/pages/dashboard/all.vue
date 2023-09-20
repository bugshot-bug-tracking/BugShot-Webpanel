<template>
	<Banner />

	<main class="main-loading" v-if="loading">
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</main>

	<main class="main-grid" v-else-if="!loading && (companies?.length ?? -1) > 0">
		<section class="grid-sidebar">
			<AllCompanyNavbar />
		</section>

		<section class="grid-page">
			<T2Page>
				<template #header>
					<T3Header>
						<template #l-top>
							{{ t("all_projects") }}
						</template>

						<template #center>
							<SearchBar />
						</template>

						<template #actions>
							<OrderPopover
								v-model:value="projectOrder.orderRef.value"
								:header="t('order.porject')"
							/>
						</template>
					</T3Header>
				</template>

				<n-scrollbar flex-1>
					<TrialBanner />

					<GroupContainer v-for="company of companiesWithProjects" :key="company.id">
						<template #top-left>
							<RouterLink
								:to="{
									name: 'company',
									params: {
										organization_id: company.attributes.organization.id,
										company_id: company.id,
									},
								}"
							>
								{{ company.attributes.designation }}
							</RouterLink>
						</template>

						<template #top-right>
							{{
								t("last_update", {
									time: timeToText(company.attributes.updated_at),
								})
							}}
						</template>

						<ProjectCard
							v-for="project of companyProjects(company)"
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
								(getOrganizationRole(company)?.id ?? 9) < 2 ||
								(company.attributes.role?.id ?? 9) < 2 ||
								(project.attributes.role?.id ?? 9) < 2
							"
							@open="
								goToProject(
									company.attributes.organization.id,
									company.id,
									project.id
								)
							"
							:to_settings="{
								name: 'project-settings',
								params: {
									organization_id: company.attributes.organization.id,
									company_id: company.id,
									project_id: project.id,
								},
							}"
						/>
					</GroupContainer>
				</n-scrollbar>
			</T2Page>
		</section>

		<NoLicenseOverlay />
	</main>

	<main class="main-empty" v-else>
		<TrialBanner />

		<section>
			<OrganizationSwitcher />

			<img src="/src/assets/images/nothing_to_show.svg" alt="empty boxes" w-88 h-88 />

			<n-h2 m-0 style="color: var(--bs-purple)">{{ t("no_companies") }}</n-h2>

			<div flex gap-2 items-center>
				<p>{{ t("please_add_new_group") }}</p>

				<div>
					<InfoPopover :message="t('tooltips.company')" ml-a my-a />
				</div>
			</div>

			<CompanyCreateModal :primary_button="true" redirect />
		</section>

		<NoLicenseOverlay />
	</main>
</template>

<script setup lang="ts">
import useOrderResource from "~/composables/OrderResource";
import { Company } from "~/models/Company";
import { Project } from "~/models/Project";
import { useMainStore } from "~/stores/main";
import { useSettingsStore } from "~/stores/settings";
import timeToText from "~/util/timeToText";

const { t } = useI18n();
const router = useRouter();

const store = useMainStore();

const loading = ref(true);
const error = ref(false);

onMounted(async () => {
	try {
		loading.value = true;
		error.value = false;

		await store.initAll();
	} catch (err) {
		console.log(err);
		error.value = true;
	} finally {
		loading.value = false;
	}
});

const organizations = computed(() => store.getAllOrganizations);
const companies = computed(() =>
	organizations.value?.reduce((acc, org) => {
		return acc.concat(org.attributes.companies);
	}, [] as Company[])
);

const companiesWithProjects = computed(() =>
	companies.value
		? (companyOrder.orderedList(
				companies.value.filter((c) => (c.attributes.projects?.length ?? 0) > 0)
		  ) as Company[])
		: []
);

const companyProjects = (company: Company) =>
	projectOrder.orderedList(company.attributes.projects ?? []) as Project[];

const goToProject = (organization_id: string, company_id: string, project_id: string) => {
	router.push({
		name: "project",
		params: {
			organization_id: organization_id,
			company_id: company_id,
			project_id: project_id,
		},
	});
};

const getOrganizationRole = (company: Company) => {
	return organizations.value?.find((o) => company.attributes.organization.id === o.id)?.attributes
		.role;
};

const projectOrder = useOrderResource({
	get() {
		return useSettingsStore().getProjectsOrder;
	},
	set(value) {
		useSettingsStore().setProjectsOrder(value);
	},
});

const companyOrder = useOrderResource({
	get() {
		return useSettingsStore().getCompaniesOrder;
	},
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
name: dashboard-all
</route>
