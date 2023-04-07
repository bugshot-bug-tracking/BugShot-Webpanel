<template>
	<div v-if="loading" class="loading" m-a>
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</div>

	<div v-else-if="error">
		<img src="/src/assets/animations/error_bug.gif" alt="error" />
	</div>

	<n-empty v-else-if="(bugs?.length ?? 0) < 1" m-a size="huge"> No archived bugs {{}} </n-empty>

	<article v-else>
		<n-scrollbar>
			<ul>
				<li v-for="bug in bugs" :key="bug.id">
					<NewBugCard
						:title="bug.attributes.designation"
						:deadline="
							bug.attributes.deadline
								? $d(new Date(dateFix(bug.attributes.deadline)), 'short')
								: $t('no_deadline')
						"
						:priority="bug.attributes.priority.id"
						:badge="bug.attributes.deleted_at != undefined ? 'delete' : 'archive'"
						:active="useBugStore().bug?.id === bug.id"
						@info="infoTab.open(bug.id, bug.attributes.status_id)"
					/>
				</li>
			</ul>
		</n-scrollbar>

		<n-pagination v-model:page="page" :page-count="100" mx-a my-4 size="large" v-if="false" />
	</article>
</template>

<script setup lang="ts">
import { useBugStore } from "~/stores/bug";
import { useReportsStore } from "~/stores/reports";
import dateFix from "~/util/dateFixISO";

const store = useReportsStore();

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
