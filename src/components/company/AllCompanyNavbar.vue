<template>
	<ResourceNavbar :list="resources ?? []" v-model:order="order" resource="company">
		<template #pre-header>
			<OrganizationSwitcher noLabel p-2 />
		</template>

		<template #header-text>
			{{ companyTerm }}
		</template>

		<template #item="{ item }: { item: Company }">
			<ResourceNavbarItem
				:text="item.attributes.designation"
				:to_resource="{
					name: 'company',
					params: {
						organization_id: item.attributes.organization!.id,
						company_id: item.id,
					},
				}"
				:to_settings="{
					name: 'company-settings',
					params: {
						organization_id: item.attributes.organization!.id,
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
					(item.attributes.organization?.attributes.role?.id ?? 9) < 2
				"
			>
				<template #list>
					<ul>
						<li
							v-for="project of item.attributes.projects"
							flex
							items-start
							justify-between
						>
							<RouterLink
								:to="{
									name: 'project',
									params: {
										organization_id: item.attributes.organization!.id,
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

									<n-ellipsis
										:line-clamp="2"
										:tooltip="{ contentStyle: { 'max-width': '66ch' } }"
									>
										{{ project.attributes.designation }}
									</n-ellipsis>
								</div>

								<div
									class="item-options"
									:class="{ open: optionsOpen === project.id }"
									v-if="
										user?.id === item.attributes.creator?.id ||
										(item.attributes.role?.id ?? 9) < 2 ||
										(project.attributes.role?.id ?? 9) < 2
									"
								>
									<n-dropdown
										trigger="click"
										:options="
											more(item.attributes.organization, item, project)
												.options
										"
										@clickoutside="optionsOpen = undefined"
										placement="bottom-end"
									>
										<n-button text @click.prevent="optionsOpen = project.id">
											<Icon-VerticalDots size="1.25rem" />
										</n-button>
									</n-dropdown>
								</div>
							</RouterLink>
						</li>

						<li
							v-if="
								(item.attributes.role?.id ?? 9) < 3 ||
								(item.attributes.organization?.attributes.role?.id ?? 9) < 2
							"
							flex
							items-center
							justify-center
						>
							<ProjectCreateModal :primary_button="false" :company="item" multipleURL>
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

										{{ t("create.project") }}
									</n-button>
								</template>
							</ProjectCreateModal>
						</li>
					</ul>
				</template>
			</ResourceNavbarItem>
		</template>
	</ResourceNavbar>
</template>

<script setup lang="ts">
import { useSettingsStore } from "~/stores/settings";
import { useAuthStore } from "~/stores/auth";
import { Company } from "~/models/Company";
import { COLOR } from "~/util/colors";
import { DropdownOption } from "naive-ui";
import IconSettings from "../icons/Icon-Settings.vue";
import { useMainStore } from "~/stores/main";
import IconBolt from "../icons/Icon-Bolt.vue";
import { Organization } from "~/models/Organization";
import { Project } from "~/models/Project";

const { t } = useI18n();
const router = useRouter();

const order = computed({
	get() {
		return useSettingsStore().getCompaniesOrder;
	},
	set(value) {
		useSettingsStore().setCompaniesOrder(value);
	},
});

const resources = computed(() =>
	useMainStore().getAllOrganizations?.reduce((acc, org) => {
		return acc.concat(org.attributes.companies);
	}, [] as Company[])
);

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

const companyTerm = computed(() => {
	return t("company", 2);
});

const more = (org: Organization, company: Company, proj: Project) => {
	// temp code replace with proper ?global? logic
	const isAuthorized =
		(org.attributes.role?.id ?? 9) < 2 ||
		(company.attributes.role?.id ?? 9) < 2 ||
		(proj?.attributes.role?.id ?? 9) < 2;

	return {
		options: [
			{
				label: t("project_settings"),
				key: "project_settings",
				icon: () => h(IconSettings),
				show: isAuthorized,
				props: {
					onClick: () => {
						router.push({
							name: "project-settings",
							params: {
								organization_id: org.id,
								company_id: company.id,
								project_id: proj.id,
							},
						});
					},
				},
			},
			{
				label: t("project_integrations.integration", 2),
				key: "project_integrations",
				icon: () => h(IconBolt),
				show: isAuthorized,
				props: {
					onClick: () => {
						router.push({
							name: "project-integrations",
							params: {
								organization_id: org.id,
								company_id: company.id,
								project_id: proj.id,
							},
						});
					},
				},
			},
		] as DropdownOption[],
	};
};
const optionsOpen = ref<string | undefined>(undefined);
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
