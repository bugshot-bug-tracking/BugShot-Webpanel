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

		<div absolute class="search-results" z-1 v-if="active && aggregateData != undefined">
			<n-card class="search-results-card">
				<div v-if="aggregateData">
					<n-list :show-divider="false" style="border-radius: 0.5rem">
						<n-list-item style="padding: 0; margin: 0.5rem 0">
							<SearchBarGroup
								v-model="aggregateData.bugs"
								type="bug"
								:searchString="searchTerm"
							/>
						</n-list-item>

						<n-list-item style="padding: 0; margin: 0.5rem 0">
							<SearchBarGroup
								v-model="aggregateData.projects"
								type="project"
								:searchString="searchTerm"
							/>
						</n-list-item>

						<n-list-item style="padding: 0; margin: 0.5rem 0">
							<SearchBarGroup
								v-model="aggregateData.companies"
								type="company"
								:searchString="searchTerm"
							/>
						</n-list-item>
					</n-list>
				</div>
			</n-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { SearchResult } from "~/models/search/SearchResult";
import debounce from "lodash.debounce";
import useAutoClose from "~/composables/AutoClose";

const searchTerm = ref("");
const loading = ref(false);
const aggregateData = ref(undefined as undefined | SearchResult);

const { root, active, open, close } = useAutoClose();

const executeSearch = debounce(async () => {
	try {
		if (searchTerm.value.length < 1 || searchTerm.value === "") aggregateData.value = undefined;
		if (searchTerm.value.length < 3) return console.log("search term is < 3");

		console.log(searchTerm.value);

		loading.value = true;

		let response = (
			await axios.get("/search", {
				params: {
					query: searchTerm.value,
				},
				headers: {
					"search-string": searchTerm.value,
				},
			})
		).data.data;

		aggregateData.value = response;

		console.log(response);
	} catch (error: any) {
		console.log(error);
	} finally {
		loading.value = false;
	}
}, 500);

watch(searchTerm, executeSearch);
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
