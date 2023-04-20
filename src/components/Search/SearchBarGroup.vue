<template>
	<div text-left flex flex-col>
		<div v-if="type" flex items-center justify-between mx-4 py-2 class="bs-bb">
			<h6 m-0>
				<b>{{ $t(type, 2) }}</b>
			</h6>

			<n-statistic text-4 v-if="modelValue">
				<template #default>
					{{ modelValue.data.length }}
				</template>

				<template #suffix> / {{ modelValue.meta.total }} </template>
			</n-statistic>
		</div>

		<div v-if="modelValue">
			<n-list
				v-if="(modelValue.data.length ?? 0) > 0"
				:show-divider="false"
				clickable
				class="bs-scroll s-purple"
				max-h-56
			>
				<n-list-item
					v-for="item in modelValue.data"
					:key="item.id"
					style="padding: 0; margin: 0.5rem 0"
				>
					<SearchBarItem :data="item" :type="type" :searchString="searchString" />
				</n-list-item>

				<div ref="bottom" />
			</n-list>

			<n-empty v-else :description="$t('no_results')" size="small" my-4 />
		</div>

		<n-button
			v-if="modelValue && modelValue.links.next != undefined"
			@click="loadMore"
			:loading="loading"
			:disabled="loading"
			type="tertiary"
			text
			strong
			mx-a
			px-4
			h-8
		>
			{{ $t("load_more") }}
		</n-button>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { BugsSearchResult } from "~/models/search/BugsSearchResult";
import { CompaniesSearchResult } from "~/models/search/CompaniesSearchResult";
import { ProjectsSearchResult } from "~/models/search/ProjectsSearchResult";

const props = defineProps({
	modelValue: {
		type: Object as PropType<
			undefined | BugsSearchResult | ProjectsSearchResult | CompaniesSearchResult
		>,
	},
	type: {
		type: String as PropType<"bug" | "project" | "company">,
		required: true,
	},
	searchString: {
		type: String,
		required: true,
	},
});

const loading = ref(false);
const bottom = ref(null as null | HTMLDivElement);

const loadMore = async () => {
	if (props.modelValue == undefined || props.modelValue.links.next == undefined) return;

	loading.value = true;

	let response = (
		await axios.get(props.modelValue.links.next, {
			headers: {
				"search-string": props.searchString,
				resource:
					props.type === "bug"
						? "bugs"
						: props.type === "project"
						? "projects"
						: "companies",
			},
		})
	).data;

	console.log(response);

	props.modelValue.links = response.links;
	props.modelValue.meta = response.meta;
	props.modelValue.data.push(...response.data);

	loading.value = false;

	nextTick(() => {
		bottom.value?.scrollIntoView({ behavior: "smooth" });
	});
};
</script>

<style scoped lang="scss">
:deep(.n-statistic-value) {
	.n-statistic-value__content,
	.n-statistic-value__suffix {
		font-size: 1rem;
		color: var(--bs-gray);
	}
}
</style>
