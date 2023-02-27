<template>
	<ResourceNavbar :list="resources" :order="order" @change-order="onChangeOrder">
		<template #pre-header>
			<OrganizationSwitcher noLabel p-2 />
		</template>

		<template #header-text>
			{{ $t("company", 2) }}
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
				:owner="user.id === item.attributes.creator?.id"
				@toggle="items_opened.toggle(item.id)"
				:open="
					items_opened.secondary === item.id
						? items_opened.s_open
						: items_opened.primary === item.id
						? items_opened.p_open
						: false
				"
				:authorized="
					item.attributes.role?.id === 1 || organization?.attributes.role?.id === 1
				"
			>
				<template #list>
					<ul v-if="companyProjects(item.id).length > 0">
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

									<img
										v-if="user?.id === project.attributes.creator?.id"
										src="/src/assets/icons/my_projects.svg"
										alt="owner"
										w-6
										h-6
										:title="$t('owner')"
									/>

									<span>
										{{ project.attributes.designation }}
									</span>
								</div>

								<RouterLink
									v-if="
										user.id === item.attributes.creator?.id ||
										item.attributes.role?.id === 1 ||
										project.attributes.role?.id === 1
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
								<div
									v-else
									class="route settings"
									:style="{
										'font-weight': 'bold',
										width: 'auto',
										opacity: '0.25',
										padding: 0,
									}"
								>
									<img
										src="/src/assets/icons/gear.svg"
										alt="settings"
										w-6
										h-6
										:title="$t('unauthorized')"
									/>
								</div>
							</RouterLink>
						</li>
					</ul>
				</template>
			</ResourceNavbarItem>
		</template>

		<template #footer>
			<CompanyCreateModal :primary_button="false" redirect />
		</template>
	</ResourceNavbar>
</template>

<script setup lang="ts">
import { useSettingsStore } from "~/stores/settings";
import { useAuthStore } from "~/stores/auth";
import { useOrganizationStore } from "~/stores/organization";
import { Company } from "~/models/Company";
import { COLOR } from "~/util/colors";

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
	return useOrganizationStore().getCompanyProjects(company_id) ?? [];
};

const organization = computed(() => useOrganizationStore().getOrganization);
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
