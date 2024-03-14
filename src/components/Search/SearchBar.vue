<template>
	<div relative ref="root">
		<n-input
			:placeholder="$t('search_for_stuff')"
			round
			text-start
			v-model:value="searchTerm"
			size="large"
			clearable
			:loading="loading"
			@click="open"
			@keyup.esc="close"
		>
			<template #prefix>
				<img src="/src/assets/icons/search.svg" alt="Search" />
			</template>
		</n-input>

		<div
			absolute
			class="search-results"
			z-1
			v-if="
				active && (aggregateData.bugs || aggregateData.projects || aggregateData.companies)
			"
		>
			<n-card class="search-results-card">
				<div>
					<n-list :show-divider="false" flex flex-col>
						<n-list-item
							style="padding: 0; margin: 0.5rem 0"
							:class="`order-${orders.bugs}`"
							class="first-of-type:mt-0!"
						>
							<n-spin :show="aggregateData.bugsLoading">
								<SearchBarGroup
									v-model="aggregateData.bugs"
									type="bug"
									:searchString="searchTerm"
								/>
							</n-spin>
						</n-list-item>

						<n-list-item
							style="padding: 0; margin: 0.5rem 0"
							:class="`order-${orders.projects}`"
						>
							<n-spin :show="aggregateData.projectsLoading">
								<SearchBarGroup
									v-model="aggregateData.projects"
									type="project"
									:searchString="searchTerm"
								/>
							</n-spin>
						</n-list-item>

						<n-list-item
							style="padding: 0; margin: 0.5rem 0"
							:class="`order-${orders.companies}`"
						>
							<n-spin :show="aggregateData.companiesLoading">
								<SearchBarGroup
									v-model="aggregateData.companies"
									type="company"
									:searchString="searchTerm"
								/>
							</n-spin>
						</n-list-item>
					</n-list>

					<div text-end mb-2 mx-2>
						<n-button
							size="small"
							:title="$t('search_modifiers.archived')"
							text
							@click="handleModifierChange({ archived: !modifiers.archived })"
							:disabled="loading"
						>
							<template #icon>
								<IconArchive
									size="1rem"
									:color="modifiers.archived ? 'var(--bs-green)' : 'currentColor'"
								/>
							</template>
						</n-button>
					</div>
				</div>
			</n-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { useDebounceFn } from "@vueuse/core";
import useAutoClose from "~/composables/AutoClose";
import { BugsSearchResult } from "~/models/search/BugsSearchResult";
import { ProjectsSearchResult } from "~/models/search/ProjectsSearchResult";
import { CompaniesSearchResult } from "~/models/search/CompaniesSearchResult";

const props = defineProps({
	order: {
		type: String as PropType<"bpc" | "pcb" | "cpb">,
		required: false,
		default: "bpc",
	},
});

const searchTerm = ref("");
const modifiers = reactive({
	archived: false,
});
const loading = computed(
	() =>
		aggregateData.bugsLoading || aggregateData.projectsLoading || aggregateData.companiesLoading
);

const aggregateData = reactive({
	bugs: undefined as BugsSearchResult | undefined,
	bugsLoading: false,

	projects: undefined as ProjectsSearchResult | undefined,
	projectsLoading: false,

	companies: undefined as CompaniesSearchResult | undefined,
	companiesLoading: false,

	reset: () => {
		aggregateData.bugs = undefined;
		aggregateData.projects = undefined;
		aggregateData.companies = undefined;

		aggregateData.bugsLoading = false;
		aggregateData.projectsLoading = false;
		aggregateData.companiesLoading = false;
	},
});

const orders = computed(() => {
	console.log(props.order);
	switch (props.order) {
		default:
		case "bpc":
			return {
				bugs: 1,
				projects: 2,
				companies: 3,
			};

		case "pcb":
			return {
				bugs: 3,
				projects: 1,
				companies: 2,
			};
		case "cpb":
			return {
				bugs: 3,
				projects: 2,
				companies: 1,
			};
	}
});

const { root, active, open, close } = useAutoClose();

const executeSearch = useDebounceFn(() => {
	if (searchTerm.value.length < 1 || searchTerm.value === "") aggregateData.reset();
	if (searchTerm.value.length < 3) return console.log("search term is < 3");

	executeBugSearch();
	executeProjectSearch();
	executeCompanySearch();
}, 500);

watch(searchTerm, executeSearch);

const executeBugSearch = async () => {
	try {
		aggregateData.bugsLoading = true;

		let response = (
			await axios.get("/search", {
				headers: {
					resource: "bugs",
					"search-string": searchTerm.value,
					"include-archived": modifiers.archived,
				},
			})
		).data;

		console.log(response);

		aggregateData.bugs = response;
	} catch (error: any) {
		console.log(error);
	} finally {
		aggregateData.bugsLoading = false;
	}
};

const executeProjectSearch = async () => {
	try {
		aggregateData.projectsLoading = true;

		let response = (
			await axios.get("/search", {
				headers: {
					resource: "projects",
					"search-string": searchTerm.value,
					"include-archived": modifiers.archived,
				},
			})
		).data;

		console.log(response);

		aggregateData.projects = response;
	} catch (error: any) {
		console.log(error);
	} finally {
		aggregateData.projectsLoading = false;
	}
};

const executeCompanySearch = async () => {
	try {
		aggregateData.companiesLoading = true;

		let response = (
			await axios.get("/search", {
				headers: {
					resource: "companies",
					"search-string": searchTerm.value,
					"include-archived": modifiers.archived,
				},
			})
		).data;

		console.log(response);

		aggregateData.companies = response;
	} catch (error: any) {
		console.log(error);
	} finally {
		aggregateData.companiesLoading = false;
	}
};

const handleModifierChange = (change: { archived?: boolean }) => {
	if (change.archived != undefined) {
		modifiers.archived = change.archived;
		executeSearch();
	}
};
</script>

<style scoped lang="scss">
.search-results {
	width: 100%;
	padding: 0.5rem 0.5rem;

	.search-results-card {
		border-radius: 0.5rem;

		border: 1px solid var(--bs-purple-light);

		box-shadow: var(--n-box-shadow);
	}
}

:deep(.n-card) {
	.n-card__content {
		padding: 0rem;
	}
}
</style>
