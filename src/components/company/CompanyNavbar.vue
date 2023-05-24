<template>
	<ResourceNavbar :list="resources" :order="order" @change-order="onChangeOrder">
		<template #pre-header>
			<OrganizationSwitcher noLabel p-2 />
		</template>

		<template #header-text v-if="!headerEdit">
			{{ companyTerm }}

			<Icon-Edit
				size="0.875rem"
				color="var(--bs-gray)"
				v-if="useFlagsStore().canEditCompanyTerm"
				@click="startEditTerm"
				ml-1
				button
			/>
		</template>

		<template #header-content v-else>
			<div flex items-center gap-2 mb-2>
				<n-input
					type="text"
					size="large"
					:placeholder="t('company', 2)"
					:default-value="companyTerm"
					v-model:value="termValue"
					:disabled="updateTermLoading"
					:loading="updateTermLoading"
				/>

				<Icon-Check button @click="saveEditTerm" :disabled="updateTermLoading" />
				<Icon-X button @click="cancelEditTerm" :disabled="updateTermLoading" />
			</div>
		</template>

		<template #order-text>
			{{ $t("order_companies") }}
		</template>

		<template #item="{ item }: { item: Company }">
			<ResourceNavbarItem
				:text="item.attributes.designation"
				:to_resource="{
					name: 'company',
					params: {
						organization_id: organization!.id,
						company_id: item.id,
					},
				}"
				:to_settings="{
					name: 'company-settings',
					params: {
						organization_id: organization!.id,
						company_id: item.id,
					},
				}"
				:owner="user?.id === item.attributes.creator?.id"
				@toggle="items_opened.toggle(item.id)"
				:open="
					items_opened.secondary === item.id
						? items_opened.s_open
						: items_opened.primary === item.id
						? items_opened.p_open
						: false
				"
				:authorized="
					(item.attributes.role?.id ?? 9) < 2 ||
					(organization?.attributes.role?.id ?? 9) < 2
				"
			>
				<template #list>
					<ul>
						<li
							v-for="project of companyProjects(item.id)"
							flex
							items-start
							justify-between
						>
							<RouterLink
								:to="{
									name: 'project',
									params: {
										organization_id: organization!.id,
										company_id: item.id,
										project_id: project.id,
									},
								}"
								class="route"
								justify-between
							>
								<div flex gap-2>
									<div
										class="dot"
										:style="{
											'background-color':
												project.attributes.color_hex ?? COLOR.PURPLE,
										}"
										v-if="false"
									/>

									<span>
										{{ project.attributes.designation }}
									</span>
								</div>

								<RouterLink
									v-if="
										user?.id === item.attributes.creator?.id ||
										(item.attributes.role?.id ?? 9) < 2 ||
										(project.attributes.role?.id ?? 9) < 2
									"
									:to="{
										name: 'project-settings',
										params: {
											organization_id: organization!.id,
											company_id: item.id,
											project_id: project.id,
										},
									}"
									class="route settings"
									:style="{
										'font-weight': 'bold',
										width: 'auto',
										padding: 0,
									}"
								>
									<img
										src="/src/assets/icons/gear.svg"
										alt="settings"
										w-6
										h-6
										:title="$t('project_settings')"
									/>
								</RouterLink>
							</RouterLink>
						</li>

						<li
							v-if="
								(item.attributes.role?.id ?? 9) < 3 ||
								(organization?.attributes.role?.id ?? 9) < 2
							"
							flex
							items-center
							justify-center
						>
							<ProjectCreateModal :primary_button="false" :company="item">
								<template #button>
									<n-button
										type="success"
										quaternary
										round
										strong
										p-4
										class="quaternary"
									>
										<template #icon>
											<img
												src="/src/assets/icons/add.svg"
												alt="project"
												w-5
												h-5
												class="black-to-green"
											/>
										</template>

										{{ $t("create.project") }}
									</n-button>
								</template>
							</ProjectCreateModal>
						</li>
					</ul>
				</template>
			</ResourceNavbarItem>
		</template>

		<template #footer v-if="(useOrganizationStore().getUserRole?.id ?? 9) < 3">
			<CompanyCreateModal :primary_button="false" redirect />
		</template>
	</ResourceNavbar>
</template>

<script setup lang="ts">
import { useSettingsStore } from "~/stores/settings";
import { useAuthStore } from "~/stores/auth";
import { useFlagsStore } from "~/stores/flags";
import { useOrganizationStore } from "~/stores/organization";
import { Company } from "~/models/Company";
import { COLOR } from "~/util/colors";

const { t } = useI18n();

const order = computed(() => useSettingsStore().getCompaniesOrder);

const onChangeOrder = (value: number) => {
	useSettingsStore().setCompaniesOrder(value);
};

const resources = computed(() => useOrganizationStore().getCompanies);

const user = computed(() => useAuthStore().getUser);

//TODO somehow move the logic bellow vvvvv in the ResourceNavbar or ResourceNavbarItem

const items_opened = reactive({
	// used for identifying the item to manually toggle
	primary: "",
	// used for identifying the item that is related to the page
	secondary: "",

	p_open: false,
	s_open: false,

	toggle: (id: string) => {
		// in case the page item is toggled ignore the primary item
		if (items_opened.secondary === id) return (items_opened.s_open = !items_opened.s_open);

		// in case the toggle is on the same element change only the open value
		if (items_opened.primary === id) return (items_opened.p_open = !items_opened.p_open);
		// otherwise set the primary and open to true
		else {
			items_opened.primary = id;
			items_opened.p_open = true;
			return;
		}
	},
});

const route = useRoute();
watch(route, () => setOpen());

const setOpen = () => {
	if (!route.params.company_id) return;

	// check to see if the page is related to a company (ex. settings, invoices, plans...) and set the appropriate state
	if (route.name?.toString().includes("company") || route.name?.toString().includes("project")) {
		items_opened.secondary = route.params.company_id as string;
		items_opened.s_open = true;
		return; // leave here to have a predictable exit
	}
};

setOpen();

const companyProjects = (company_id: string) => {
	return (
		useOrganizationStore()
			.getCompanyProjects(company_id)
			?.sort((a, b) => a.attributes.designation.localeCompare(b.attributes.designation)) ?? []
	);
};

const organization = computed(() => useOrganizationStore().getOrganization);

const headerEdit = ref(false);
const termValue = ref("");

const companyTerm = computed(() => {
	const orgTerm = useOrganizationStore().organization?.attributes.companyTerm;
	if (orgTerm != undefined) return orgTerm;
	else return t("company", 2);
});

const updateTermLoading = ref(false);

const startEditTerm = () => {
	headerEdit.value = true;
	termValue.value = companyTerm.value;
};

const saveEditTerm = async () => {
	try {
		updateTermLoading.value = true;
		await useOrganizationStore().changeCompanyTerm(termValue.value);

		cancelEditTerm();
	} catch (error) {
		console.log(error);
	} finally {
		updateTermLoading.value = false;
	}
};

const cancelEditTerm = () => {
	headerEdit.value = false;
	termValue.value = "";
};
</script>

<style lang="scss" scoped>
ul {
	list-style-type: none;
	padding: 0.5rem;
	text-align: left;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
</style>
