<template>
	<TSidebar>
		<template #header>
			<header>
				<div class="left">
					<h3>{{ $t("company", 2) }}</h3>

					<RouterLink
						:to="{ name: 'home' }"
						style="text-decoration: underline"
					>
						{{ $t("back_to_al_projects") }}
					</RouterLink>
				</div>

				<div class="right">
					<OrderButton
						creation
						updated
						@change="sortList"
						:selected="settingsStore.getCompaniesOrder"
					/>
				</div>
			</header>
		</template>

		<template #main>
			<div class="companies bs-scroll s-purple">
				<ul>
					<li v-for="[, company] of companies" :key="company.id">
						<div
							class="header"
							:class="{
								open:
									opened.company === company.id ||
									forceOpen.company === company.id,
							}"
							@click="collapseCompany(company.id)"
						>
							<span>{{ company.attributes.designation }}</span>

							<img src="/src/assets/icons/icn_left_arrow.svg" />
						</div>

						<div class="collapsable">
							<div
								class="header"
								:class="{
									open:
										opened.projects === company.id ||
										forceOpen.projects === company.id,
								}"
								@click="collapseProject(company.id)"
							>
								<RouterLink
									:to="{
										name: 'company',
										params: { id: company.id },
									}"
								>
									{{ $t("project", 2) }}
								</RouterLink>

								<img
									src="/src/assets/icons/icn_left_arrow.svg"
								/>
							</div>

							<div class="collapsable">
								<ul
									v-if="
										companyProjects(company.id).length > 0
									"
								>
									<li
										v-for="project of companyProjects(
											company.id
										)"
									>
										<RouterLink
											:to="{
												name: 'project',
												params: { id: project.id },
											}"
											class="route"
										>
											<div
												class="dot"
												:style="{
													'background-color': project
														.attributes.color_hex
														? project.attributes
																.color_hex
														: '#7a2de6',
												}"
											/>

											<span>
												{{
													project.attributes
														.designation
												}}
											</span>
										</RouterLink>
									</li>
								</ul>
							</div>

							<RouterLink
								:to="{
									name: 'company-settings',
									params: { id: company.id },
								}"
								class="route"
								style="font-weight: bold"
							>
								{{ $t("company_details") }}
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
import { useMainStore } from "~/stores/main";
import { useSettingsStore } from "~/stores/settings";

let store = useMainStore();
store.init();

let settingsStore = useSettingsStore();

const opened = reactive({
	company: "",
	projects: "",
});

const forceOpen = reactive({
	company: "",
	projects: "",
	clear: () => {
		forceOpen.company = "";
		forceOpen.projects = "";
	},
});

const route = useRoute();
watch(route, () => force());

const force = () => {
	if (route.name === "project") {
		if (!route.params.id) return forceOpen.clear();

		let company = store.getProjectCompany(<string>route.params.id);
		if (!company) return forceOpen.clear();

		forceOpen.company = company.id;
		forceOpen.projects = company.id;
		return;
	}

	if (route.name?.toString().includes("company")) {
		if (!route.params.id) return forceOpen.clear();

		forceOpen.company = <string>route.params.id;
		forceOpen.projects = "";
		return;
	}

	return forceOpen.clear();
};

const companies = computed(() => {
	force();
	let list = store.getCompanies;

	switch (settingsStore.getCompaniesOrder) {
		default:
		case 0: // A-Z
			return [...list.entries()].sort((a, b) => {
				return a[1].attributes.designation.localeCompare(
					b[1].attributes.designation
				);
			});
			break;

		case 1: // Z-A
			return [...list.entries()].sort((a, b) => {
				return (
					a[1].attributes.designation.localeCompare(
						b[1].attributes.designation
					) * -1
				);
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

const companyProjects = (company_id: string) =>
	store.getCompanyProjects(company_id);

const collapseCompany = (id: string) => {
	// enable toggling of collapse state for a company
	if (opened.company === id) return (opened.company = "");

	return (opened.company = id);
};

const collapseProject = (id: string) => {
	// enable toggling of collapse state for projects
	if (opened.projects === id) return (opened.projects = "");

	return (opened.projects = id);
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

	a {
		color: #7a2ee6;
		font-size: 0.875rem;
	}

	a.router-link-exact-active {
		color: #9ba5d7;
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
			align-items: center;
			justify-content: space-between;
			padding: 0.5rem;
			font-weight: bold;
			cursor: pointer;
			border-radius: 0.5rem;

			&:hover {
				background-color: hsl(263, 79%, 94%);
			}

			> img {
				transform: rotateZ(-90deg);
				transition: transform 0.2s;
				user-select: none;
			}

			&.open {
				background: hsl(158, 79%, 87%);

				> img {
					transform: rotateZ(90deg);
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
	transition: 0.5s ease-out;
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
	align-items: baseline;
	padding: 0.5rem;
	width: 100%;
	border-radius: 0.5rem;
	gap: 0.5rem;

	&:hover {
		background-color: hsl(263, 79%, 94%);
	}

	&.router-link-exact-active {
		background: hsl(158, 79%, 87%);
	}
}

.dot {
	border-radius: 100%;
	background-color: red;
	padding: 0.5rem;
	transform: translateY(0.1rem);
}
</style>
