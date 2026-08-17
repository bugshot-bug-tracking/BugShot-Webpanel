<template>
	<div v-if="loading" class="loading" m-a>
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</div>

	<div v-else-if="error">
		<img src="/src/assets/animations/error_bug.gif" alt="error" />
	</div>

	<n-empty v-else-if="(bugs?.length ?? 0) < 1" m-a size="huge">
		{{ t("no_bugs_archived") }}
	</n-empty>

	<article v-else>
		<n-scrollbar>
			<ul>
				<li v-for="bug in bugs" :key="bug.id">
					<BugCard
						:bug="bug"
						:active="bug.id === bugStore.bug?.id"
						@open="openBugInfo"
						:loading="cardLoading === bug.id && bugStore.loading_bug"
					/>
				</li>
			</ul>
		</n-scrollbar>
	</article>
</template>

<script setup lang="ts">
import { useArchivedBugStore } from "~/stores/archivedBug";
import { useReportsStore } from "~/stores/reports";

const { t } = useI18n();

const store = useReportsStore();
const bugStore = useArchivedBugStore();

const loading = ref(false);
const error = ref(false);
const cardLoading = ref<string | undefined>(undefined);

// Create a sorted copy only when the source data changes, not on every access
const bugs = computed(() => {
	const archivedBugs = store.getArchivedBugs;
	if (!archivedBugs) return [];

	// Create a new sorted array without mutating the original
	return [...archivedBugs].sort((a, b) =>
		a.attributes.archived_at < b.attributes.archived_at ? 1 : -1,
	);
});

const init = async () => {
	try {
		error.value = false;
		loading.value = true;

		await store.fetchArchivedBugs();
	} catch (err: any) {
		console.error(err);
		error.value = true;
	} finally {
		loading.value = false;
	}
};

onMounted(init);

const openBugInfo = async (bug_id: string, status_id: string) => {
	if (cardLoading.value) return;

	try {
		cardLoading.value = bug_id;
		await bugStore.init(bug_id, status_id);
	} catch (error: any) {
		console.error(error);
	} finally {
		cardLoading.value = undefined;
	}
};
</script>

<style scoped lang="scss">
article {
	width: 100%;
	display: flex;
	flex-direction: column;
}

ul {
	display: grid;
	grid-template-columns: repeat(auto-fit, 20rem);
	grid-gap: 1.25rem;

	padding: 1rem 2rem 0 0;
}
</style>
