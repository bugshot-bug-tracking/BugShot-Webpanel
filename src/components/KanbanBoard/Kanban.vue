<template>
	<article>
		<n-scrollbar x-scrollable>
			<draggable
				:list="statuses"
				:item-key="(item:Status) => item.id"
				:scroll-sensitivity="100"
				:force-fallback="true"
				:animation="200"
				group="statuses"
				class="status-list"
				handle=".status-handle"
				@change="statusMove"
			>
				<template #header v-if="store.getBacklogStatus">
					<KanbanItem :status="store.getBacklogStatus" />
				</template>

				<template #item="status: { element: Status }">
					<KanbanItem
						:status="status.element"
						@delete="deleteModal.open(status.element.id)"
					/>
				</template>

				<template #footer v-if="store.getDoneStatus">
					<KanbanItem :status="store.getDoneStatus" />
				</template>
			</draggable>
		</n-scrollbar>
	</article>

	<StatusDeleteModal v-if="deleteModal.show" :id="deleteModal.id" @close="deleteModal.close" />
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import { Status } from "~/models/Status";
import { useReportsStore } from "~/stores/reports";

const store = useReportsStore();

const statuses = computed(() => store.statuses?.filter((s) => s.attributes.permanent == undefined));

const statusMove = (event: any) => {
	try {
		// console.log("event: ", event);
		const element = event.moved.element;
		// console.log("element: ", element);

		// +1 because the list starts at the second element and that one has index 0; happens because of the backlog was removed from statuses
		store.updateStatus({
			id: element.id,
			changes: {
				order_number: event.moved.newIndex + 1,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

const deleteModal = reactive({
	show: false,
	id: undefined as string | undefined,
	open: (id: string) => {
		deleteModal.show = true;
		deleteModal.id = id;
	},
	close: () => {
		deleteModal.show = false;
		deleteModal.id = undefined;
	},
});
</script>

<style scoped lang="scss">
article {
	width: 100%;
	height: 100%;
	display: flex;
}

.status-list {
	display: flex;
	flex: 1;

	section {
		border-right: 1px solid var(--bs-purple-light);

		&:last-of-type {
			border-right: unset;
		}
	}
}
:deep(.n-scrollbar-content) {
	display: flex;
	padding-bottom: 1rem;
	height: 100%;
}
</style>
