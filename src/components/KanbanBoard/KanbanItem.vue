<template>
	<section class="status-column">
		<div flex>
			<div v-if="!flags.editMode" class="status-view">
				<div flex gap-2 items-center>
					<n-h6>
						<n-ellipsis
							line-clamp="2"
							style="line-height: 1.4"
							:tooltip="{ scrollable: true }"
						>
							{{ status.attributes.designation }}

							<n-text type="primary">
								{{
									(status.attributes.bugs?.length ?? 0) > 0
										? `(${status.attributes.bugs?.length})`
										: ""
								}}
							</n-text>
						</n-ellipsis>
					</n-h6>

					<img
						src="/src/assets/icons/edit.svg"
						alt="edit"
						class="black-to-gray"
						@click="startEdit"
						w-5
						cursor-pointer
					/>
				</div>

				<div v-if="flags.movable || flags.deletable" flex>
					<img
						v-if="flags.movable"
						src="/src/assets/icons/move.svg"
						alt="order"
						class="status-handle black-to-gray"
						cursor-grab
						mx-4
					/>
					<img
						v-if="flags.deletable"
						src="/src/assets/icons/remove.svg"
						alt="edit"
						class="black-to-gray"
						cursor-pointer
						@click="handleDelete"
					/>
				</div>
			</div>

			<div v-else class="status-edit">
				<n-input
					v-model:value="newStatusText"
					type="text"
					:placeholder="status.attributes.designation"
					text-left
					:disabled="loading"
					:loading="loading"
				/>

				<img
					src="/src/assets/icons/check.svg"
					alt="save"
					w-6
					@click="handleEdit"
					class="black-to-gray"
					mx-2
					:class="{ 'opacity-50': loading, 'cursor-pointer': !loading }"
				/>

				<img
					src="/src/assets/icons/close_2.svg"
					alt="cancel"
					@click="cancelEdit"
					w-6
					class="black-to-gray"
					:class="{ 'opacity-50': loading, 'cursor-pointer': !loading }"
				/>
			</div>
		</div>

		<n-scrollbar>
			<draggable
				:list="status.attributes.bugs"
				:item-key="(item:Bug) => item"
				:scroll-sensitivity="100"
				:force-fallback="true"
				:animation="200"
				@change="bugMove"
				group="tasks"
				class="drag-zone"
				ghost-class="ghost-card"
			>
				<template #item="{ element }: { element: Bug }">
					<BugCard
						:bug="element"
						:active="element.id === bugStore.bug?.id"
						:key="element.id"
						@open="openBugInfo"
						:loading="cardLoading === element.id && bugStore.loading_bug"
					/>
				</template>
			</draggable>
		</n-scrollbar>
	</section>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import { Bug } from "~/models/Bug";
import { Status } from "~/models/Status";
import { useBugStore } from "~/stores/bug";
import { useReportsStore } from "~/stores/reports";

const props = defineProps({
	status: {
		type: Object as PropType<Status>,
		required: true,
	},
});

const emit = defineEmits(["delete"]);

const store = useReportsStore();
const bugStore = useBugStore();

const loading = ref(false);

const flags = reactive({
	editMode: false,
	movable: props.status.attributes.permanent == undefined,
	deletable: props.status.attributes.permanent == undefined,
});

const newStatusText = ref("");

const startEdit = () => {
	flags.editMode = true;
	newStatusText.value = props.status.attributes.designation;
};
const cancelEdit = () => {
	flags.editMode = false;
	newStatusText.value = "";
};
const handleEdit = async () => {
	if (loading.value === true) return;

	try {
		loading.value = true;
		await store.updateStatus({
			id: props.status.id,
			changes: { designation: newStatusText.value },
		});

		cancelEdit();
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
};

const handleDelete = () => {
	emit("delete");
};

const bugMove = async (event: any) => {
	try {
		console.log(event);

		// sync only on the add and move events
		if (!(event.added || event.moved)) return;

		// unify events to get the info in one go
		let data = {} as any;
		if (event.added) data = event.added;
		if (event.moved) data = event.moved;

		store.moveBug({
			bug_id: data.element.id,
			changes: {
				status_id: props.status.id,
				order_number: data.newIndex,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

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
.status-column {
	width: 25rem;
	display: flex;
	flex-direction: column;

	:deep(.n-scrollbar-content) {
		height: auto;
		min-height: 100%;
	}
}

h6 {
	word-break: break-word;
	margin: unset;
	text-align: left;
}

.status-view,
.status-edit {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 3.5rem;
	gap: 0.5rem;
	flex: 1;
	margin: 0 1rem;
	border-bottom: 1px solid var(--bs-purple-light);
}

.drag-zone {
	flex: 1;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.ghost-card {
	opacity: 0.5;
	background: #f7fafc;
}
</style>
