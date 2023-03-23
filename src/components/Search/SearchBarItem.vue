<template>
	<RouterLink :to="redirectObject" class="result-item" flex flex-col>
		<p v-html="highlightedTexts.designation" />

		<div v-if="highlightMatch.url_match" style="color: var(--bs-gray)" flex gap-2 text-3>
			<b style="white-space: nowrap">{{ $t("url") }}: </b>

			<n-ellipsis :line-clamp="1">
				<p v-html="highlightedTexts.url" />

				<template #tooltip>
					<p v-html="highlightedTexts.url" />
				</template>
			</n-ellipsis>
		</div>

		<div
			v-if="highlightMatch.description_match"
			style="color: var(--bs-gray)"
			flex
			gap-2
			text-3
		>
			<b style="white-space: nowrap">{{ $t("description") }}: </b>

			<n-ellipsis :line-clamp="1">
				<p v-html="highlightedTexts.description" />

				<template #tooltip>
					<p v-html="highlightedTexts.description" />
				</template>
			</n-ellipsis>
		</div>
	</RouterLink>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from "vue-router";
import { BugSearchData } from "~/models/search/BugSearchData";
import { CompaniesSearchData } from "~/models/search/CompaniesSearchData";
import { ProjectSearchData } from "~/models/search/ProjectSearchData";
import escapeHTML from "~/util/escapeHTML";

const props = defineProps({
	data: {
		type: Object as PropType<BugSearchData | ProjectSearchData | CompaniesSearchData>,
		required: true,
	},

	type: {
		type: String as PropType<undefined | "bug" | "project" | "company">,
		required: true,
	},

	searchString: {
		type: String,
		required: true,
	},
});

const highlightMatch = computed(() => {
	const regex = new RegExp(`(.*)(${props.searchString})(.*)`, "i");

	const matches = {
		designation_match: false as boolean,

		description_match: false as boolean,

		url_match: false as boolean,
	};

	if ("designation" in props.data) {
		matches.designation_match = !!props.data.designation?.match(regex);
	}

	if ("description" in props.data) {
		matches.description_match = !!props.data.description?.match(regex);
	}

	if ("url" in props.data) {
		matches.url_match = !!props.data.url?.match(regex);
	}

	return matches;
});

const highlightedTexts = computed(() => {
	const texts = {
		designation: undefined as undefined | string,
		description: undefined as undefined | string,
		url: undefined as undefined | string,
	};

	if ("designation" in props.data) {
		texts.designation = highlightText(props.data.designation);
	}

	if ("description" in props.data) {
		texts.description = highlightText(props.data.description);
	}

	if ("url" in props.data) {
		texts.url = highlightText(props.data.url);
	}

	return texts;
});

const redirectObject = computed((): RouteLocationRaw => {
	switch (props.type) {
		case "bug":
			let item = props.data as BugSearchData;

			return {
				name: "project",
				params: {
					organization_id: item.organization_id ?? "a",
					company_id: item.company_id ?? "a",
					project_id: item.project_id,
				},
				query: {
					b: item.id,
				},
			};

		case "project":
			let item2 = props.data as ProjectSearchData;

			return {
				name: "project",
				params: {
					organization_id: item2.organization_id ?? "a",
					company_id: item2.company_id,
					project_id: item2.id,
				},
			};

		case "company":
			let item3 = props.data as CompaniesSearchData;

			return {
				name: "company",
				params: {
					organization_id: item3.organization_id,
					company_id: item3.id,
				},
			};
	}

	return {};
});

const highlightText = (text: string) => {
	// console.log(text);

	if (text == undefined) return "";

	const regex = new RegExp(`(.*)(${props.searchString})(.*)`, "i");
	// console.log(regex);

	let match = text.match(regex);
	// console.log("match:", match);

	if (match) {
		let aggregateString = `${escapeHTML(
			match[1]
		)}${`<strong style="color: var(--bs-purple)">${match[2]}</strong>`}${escapeHTML(match[3])}`;

		// console.log(aggregateString);

		return aggregateString;
	}

	return text;
};
</script>

<style scoped lang="scss">
.result-item {
	padding: 0.5rem 1rem;

	&:hover {
		background: var(--bs-gray-light);
	}
}
</style>
