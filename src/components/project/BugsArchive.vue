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
						:key="bug.id"
						@open="openBugInfo"
						:loading="cardLoading === bug.id && bugStore.loading_bug"
					/>
				</li>
			</ul>
		</n-scrollbar>

		<n-pagination v-model:page="page" :page-count="100" mx-a my-4 size="large" v-if="false" />
	</article>
</template>

<script setup lang="ts">
import { useArchivedBugStore } from "~/stores/archivedBug";
import { useBugStore } from "~/stores/bug";
import { useReportsStore } from "~/stores/reports";

const { t } = useI18n();

const store = useReportsStore();
const bugStore = useArchivedBugStore();

const bugs = computed(() =>
	store.getArchivedBugs?.sort((a, b) =>
		a.attributes.archived_at < b.attributes.archived_at ? 1 : -1
	)
);

const page = ref(1);

const loading = ref(false);
const error = ref(false);

const init = async () => {
	try {
		error.value = false;
		loading.value = true;

		await store.fetchArchivedBugs();
	} catch (err: any) {
		console.log(err);
		error.value = true;
	} finally {
		loading.value = false;
	}
};

onMounted(init);

const infoTab = reactive({
	show: false,
	id: undefined as string | undefined,
	open: (bug_id: string, status_id: string) => {
		infoTab.show = true;
		infoTab.id = bug_id;
		useBugStore().init(bug_id, status_id);
	},
	close: () => {
		infoTab.show = false;
		infoTab.id = undefined;
	},
});

const cardLoading = ref(undefined as string | undefined);
const openBugInfo = async (bug_id: string, status_id: string) => {
	if (cardLoading.value != undefined) return;

	try {
		cardLoading.value = bug_id;

		let r = await bugStore.init(bug_id, status_id);
		console.log(r);
	} catch (error: any) {
		console.log(error);
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
