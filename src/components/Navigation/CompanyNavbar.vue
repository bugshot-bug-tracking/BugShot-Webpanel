<template>
	<TSidebar>
		<template #header>
			<header>
				<div>
					<h3>{{ $t("company", 2) }}</h3>

					<RouterLink
						:to="{ name: 'home' }"
						:style="{
							'text-decoration': 'underline',
							color: '#7a2ee6',
							'font-size': '0.875rem',
						}"
					>
						{{ $t("back_to_al_projects") }}
					</RouterLink>
				</div>

				<div>
					<OrderButton
						creation
						updated
						@change="sortList"
						:selected="settingsStore.getCompaniesOrder"
					>
						<template #header>
							{{ $t("order_companies") }}
						</template>
					</OrderButton>
				</div>
			</header>
		</template>

		<template #main>
			<div class="companies bs-scroll">
				<ul v-if="companies.length > 0">
					<li v-for="[, company] of companies" :key="company.id">
						<RouterLink
							:to="{
								name: 'company',
								params: { id: company.id },
							}"
							class="header"
							:class="{
								open:
									autoOpen.company === company.id
										? autoOpen.c_open
										: manualOpen.company === company.id && manualOpen.c_open,
							}"
						>
							<div flex gap-2>
								<img
									v-if="user?.id === company.attributes.creator?.id"
									src="/src/assets/icons/my_projects.svg"
									alt="owner"
									w-6
									h-6
									:title="$t('owner')"
								/>

								{{ company.attributes.designation }}
							</div>

							<div flex gap-2>
								<RouterLink
									v-if="
										user.id === company.attributes.creator?.id ||
										company.attributes.role?.id === 1
									"
									:to="{
										name: 'company-settings',
										params: { id: company.id },
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
										:title="$t('company_settings')"
									/>
								</RouterLink>
								<div
									v-else
									class="route settings disabled"
									:style="{
										'font-weight': 'bold',
										width: 'auto',
										padding: 0,
									}"
									@click.prevent=""
								>
									<img
										src="/src/assets/icons/gear.svg"
										alt="settings"
										w-6
										h-6
										:title="$t('unauthorized')"
									/>
								</div>

								<img
									src="/src/assets/icons/arrow_down.svg"
									class="arrow"
									@click.prevent="collapseCompany(company.id)"
								/>
							</div>
						</RouterLink>

						<div class="collapsable">
							<ul v-if="companyProjects(company.id).length > 0">
								<li
									v-for="project of companyProjects(company.id)"
									flex
									items-start
									justify-between
								>
									<RouterLink
										:to="{
											name: 'project',
											params: {
												id: company?.id,
												project_id: project.id,
											},
										}"
										class="route"
									>
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
									</RouterLink>

									<RouterLink
										v-if="
											user.id === company.attributes.creator?.id ||
											company.attributes.role?.id === 1 ||
											project.attributes.role?.id === 1
										"
										:to="{
											name: 'project-settings',
											params: {
												id: company.id,
												project_id: project.id,
											},
										}"
										class="route settings"
										:style="{
											'font-weight': 'bold',
											width: 'auto',
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
										class="route settings disabled"
										:style="{
											'font-weight': 'bold',
											width: 'auto',
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
								</li>
							</ul>

							<RouterLink
								:to="{
									name: 'company-settings',
									params: { id: company.id },
								}"
								class="route"
								style="font-weight: bold"
								v-if="false"
							>
								{{ $t("invoice", 2) }}
							</RouterLink>

							<RouterLink
								:to="{
									name: 'company-settings',
									params: { id: company.id },
								}"
								class="route"
								style="font-weight: bold"
								v-if="false"
							>
								{{ $t("plan", 2) }}
							</RouterLink>
						</div>

						<hr />
					</li>
				</ul>
			</div>
		</template>

		<template #footer>
			<CreateDataModal :dataType="'Company'" :postPath="'companies'" />
		</template>
	</TSidebar>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useMainStore } from "~/stores/main";
import { useSettingsStore } from "~/stores/settings";
import { COLOR } from "~/util/colors";

let store = useMainStore();
let settingsStore = useSettingsStore();

let user = computed(() => useAuthStore().getUser);

store.init();

// control the manual clicking of dropdowns to only have 1 dropdown open at a time (company + projects)
const manualOpen = reactive({
	//* used to identify which dropdown group to control
	company: "",
	//*

	//** handle the state of that dropdown
	c_open: false,
	p_open: false,
	//**
});

// control one dropdown independently (company + projects) based on the page opened
const autoOpen = reactive({
	//* used to identify which dropdown group to control
	company: "",
	//*

	//** handle the state of that dropdown
	c_open: false,
	p_open: false,
	//**

	//*** used when the page is changed to not have data leaks between pages
	clear: () => {
		autoOpen.company = "";
		autoOpen.c_open = false;
		autoOpen.p_open = false;
	},
	//***
});

const route = useRoute();
watch(route, () => force());

// handle the event when a page is changed and set the properties to identify the dropdown related to it
const force = () => {
	// clear the autoOpen state to not have leaks and be set later in a proper way
	autoOpen.clear();

	// if the page does not contain an id (either project or company) that should be there it's not of concern for this component
	if (!route.params.id) return;

	// check to see if the page is related to a project and set the appropriate state to autoOpen
	if (route.name === "project" || route.name === "project-settings") {
		autoOpen.company = route.params.id as string;
		autoOpen.c_open = true;
		autoOpen.p_open = true;
		return; // leave here to have a predictable exit
	}

	// check to see if the page is related to a company (ex. company settings, invoices, plans...) and set the appropriate state to autoOpen
	if (route.name?.toString().includes("company")) {
		autoOpen.company = route.params.id as string;
		autoOpen.c_open = true;
		autoOpen.p_open = false;
		return; // leave here to have a predictable exit
	}
};

const companies = computed(() => {
	// when the companies are updated set the navbar accordingly
	force();

	let list = store.getCompanies;

	// handle the ordering of companies
	switch (settingsStore.getCompaniesOrder) {
		// default case fallthrough to case 0
		default:
		case 0: // A-Z
			return [...list.entries()].sort((a, b) => {
				return a[1].attributes.designation.localeCompare(b[1].attributes.designation);
			});
			break;

		case 1: // Z-A
			return [...list.entries()].sort((a, b) => {
				return a[1].attributes.designation.localeCompare(b[1].attributes.designation) * -1;
			});
			break;

		case 2: //  Creation newest
			return [...list.entries()].sort((a, b) => {
				return (
					(new Date(a[1].attributes.created_at).getTime() -
						new Date(b[1].attributes.created_at).getTime()) *
					-1
				);
			});
			break;

		case 3: // Creation oldest
			return [...list.entries()].sort((a, b) => {
				return (
					new Date(a[1].attributes.created_at).getTime() -
					new Date(b[1].attributes.created_at).getTime()
				);
			});
			break;

		case 4: // Last edit ascending
			return [...list.entries()].sort((a, b) => {
				return (
					(new Date(a[1].attributes.updated_at).getTime() -
						new Date(b[1].attributes.updated_at).getTime()) *
					-1
				);
			});
			break;

		case 5: // Last edit descending
			return [...list.entries()].sort((a, b) => {
				return (
					new Date(a[1].attributes.updated_at).getTime() -
					new Date(b[1].attributes.updated_at).getTime()
				);
			});
			break;
	}
});

// useful to separate the way projects are obtained in case data changes
const companyProjects = (company_id: string) => store.getCompanyProjects(company_id);

// handle the collapsing of companies
const collapseCompany = (id: string) => {
	// in case the page is related to a company use the autoOpen variable to handle the dropdown state independently from the manual one
	if (autoOpen.company === id) return (autoOpen.c_open = !autoOpen.c_open);

	// handle the case when switching between companies
	if (manualOpen.company === id) {
		// toggle if it's the same
		manualOpen.c_open = !manualOpen.c_open;
	} else {
		// else set the reference to the new one and make it be open
		manualOpen.company = id;
		manualOpen.c_open = true;
		manualOpen.p_open = false;
	}
};

// handle the collapsing of company projects dropdown
const collapseProject = (id: string) => {
	// in case the page is related to a company use the autoOpen variable to handle the dropdown state independently from the manual one
	if (autoOpen.company === id) return (autoOpen.p_open = !autoOpen.p_open);

	// toggle the company projects dropdown state
	if (manualOpen.company === id) manualOpen.p_open = !manualOpen.p_open;
};

const sortList = (sortMode: number) => {
	settingsStore.setCompaniesOrder(sortMode);
};
</script>

<style lang="scss" scoped>
header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	text-align: left;
	padding: 1rem;

	a.router-link-exact-active {
		color: #9ba5d7 !important;
	}
}

ul {
	list-style-type: none;
	padding: 0.5rem;
	text-align: left;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	li {
		.header {
			width: 100%;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			padding: 0.5rem;
			font-weight: bold;
			cursor: pointer;
			border-radius: 0.5rem;
			line-height: 1.5;

			&:hover {
				background-color: hsl(263, 79%, 94%);
			}

			.arrow {
				transform: rotateZ(-90deg);
				transition: transform 0.2s;
				user-select: none;
				width: 1.5rem;
				height: 1.5rem;
				line-height: 1.5;
			}

			&.open {
				background: hsl(158, 79%, 87%);

				> div img {
					transform: rotateZ(0deg);
				}

				+ .collapsable {
					visibility: visible;
					max-height: 10000px;
					transition: 0.5s ease-in;
				}
			}
		}

		&:last-of-type {
			hr {
				display: none;
			}
		}
	}
}

.collapsable {
	display: flex;
	visibility: collapse;
	max-height: 0;
	flex-direction: column;
	margin: 0.5rem 0 0.5rem 0.5rem;
	transition: 0.2s ease-out;
	overflow: hidden;

	ul {
		padding: 0;
	}
}

.companies {
	padding: 0.5rem;
	padding-right: 0;
	height: 100%;
	width: 100%;
}

.route {
	display: inline-flex;
	align-items: flex-start;
	padding: 0.5rem;
	width: 100%;
	border-radius: 0.5rem;
	gap: 0.5rem;

	&:hover {
		background-color: hsl(263, 79%, 94%);
	}

	&.router-link-exact-active {
		background: hsl(158, 79%, 87%);

		&.settings img {
			color: #7a2ee6;
			filter: brightness(0) saturate(1) invert(18%) sepia(72%) saturate(5384%)
				hue-rotate(263deg) brightness(94%) contrast(92%);
		}
	}
}

.dot {
	border-radius: 100%;
	background-color: red;
	padding: 0.5rem;
	transform: translateY(0.1rem);
}
</style>
