<template>
	<div class="bugs-table bs-scroll">
		<draggable
			:list="statuses"
			:item-key="(item:Status) => item.id"
			@change="statusMove"
			:animation="200"
			group="statuses"
			class="status-list bs-scroll"
			:scroll-sensitivity="100"
			:force-fallback="true"
			handle=".handle"
			ref="end"
		>
			<template #item="status: { element: Status }">
				<Column class="column">
					<template v-slot:header>
						<StatusTableHeader
							:id="status.element.id"
							:text="status.element.attributes.designation"
							@edit="editStatus"
							@delete="deleteModal.open"
							:movable="!status.element.attributes.permanent"
							:deletable="!status.element.attributes.permanent"
						/>
					</template>

					<draggable
						:list="bugs(status.element.id)"
						:item-key="(item:Bug) => item"
						@change="bugMove(status.element.id, $event)"
						:animation="200"
						ghost-class="ghost-card"
						group="tasks"
						class="drag-zone"
						:scroll-sensitivity="100"
						:force-fallback="true"
					>
						<template #item="{ element }: { element: Bug }">
							<BugCard
								:title="element.attributes.designation"
								:deadline="
									element.attributes.deadline
										? $d(
												new Date(dateFix(element.attributes.deadline)),
												'short'
										  )
										: $t('no_deadline')
								"
								:priority="element.attributes.priority.id"
								:active="infoTab.id === element.id"
								@info="infoTab.open(element.id)"
							/>
						</template>
					</draggable>
				</Column>
			</template>
		</draggable>

		<div class="extras" v-if="!newStatus.form">
			<a @click="newStatus.toggleForm">
				{{ $t("add_new_column") }}
				<img src="/src/assets/icons/add.svg" alt="add" class="black-to-gray" />
			</a>
		</div>

		<Column
			class="column p-0 w-auto"
			style="box-shadow: -20px 0px 30px -27px"
			v-if="newStatus.form"
		>
			<div class="bs-input">
				<label>
					{{ $t("enter_column_name") }}
				</label>

				<input
					type="text"
					:placeholder="$t('enter_column_name')"
					minlength="1"
					v-model="newStatus.name"
				/>
			</div>

			<div class="actions my-4">
				<a class="bs-btn green" @click="addStatus">
					{{ $t("add.column") }}
				</a>
				<a @click="newStatus.toggleForm" class="black-to-gray">
					<img
						src="/src/assets/icons/close_1.svg"
						style="width: 1.5rem; height: 1.5rem; cursor: pointer"
						alt="collapse"
					/>
				</a>
			</div>
		</Column>
	</div>

	<BugTab v-if="infoTab.show" :id="infoTab.id" @close="infoTab.close" />

	<StatusDeleteModal v-if="deleteModal.show" :id="deleteModal.id" @close="deleteModal.close" />
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import dateFix from "~/util/dateFixISO";
import { useReportsStore } from "~/stores/reports";
import { Status } from "~/models/Status";
import { Bug } from "~/models/Bug";

const store = useReportsStore();

const statuses = computed(() => store.getStatuses);

const bugs = (id: string) => store.getBugsByStatusId(id);

const bugMove = async (status_id: string, event: any) => {
	try {
		// sync only on the add and move events
		if (!(event.added || event.moved)) return;

		// unify events to get the info in one go
		let data = {} as any;
		if (event.added) data = event.added;
		if (event.moved) data = event.moved;

		store.moveBug({
			bug_id: data.element.id,
			changes: {
				status_id: status_id,
				order_number: data.newIndex,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

const infoTab = reactive({
	show: false,
	id: undefined as string | undefined,
	open: (value: string) => {
		infoTab.show = true;
		infoTab.id = value;
	},
	close: () => {
		infoTab.show = false;
		infoTab.id = undefined;
	},
});

const newStatus = reactive({
	form: false,
	name: "",
	toggleForm: () => {
		newStatus.form = !newStatus.form;
	},
	clear: () => {
		newStatus.form = false;
		newStatus.name = "";
	},
});

const end = ref<any | null>(null);

const addStatus = async () => {
	await store.createStatus({ designation: newStatus.name });

	newStatus.clear();

	nextTick(() => {
		end.value?.targetDomElement.children[
			end.value.targetDomElement.children.length - 1
		].scrollIntoView();
	});
};

const statusMove = (event: any) => {
	try {
		// console.log("event: ", event);
		const element = event.moved.element;
		// console.log("element: ", element);

		store.updateStatus({
			id: element.id,
			changes: {
				order_number: event.moved.newIndex,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

const editStatus = (payload: {
	id: string;
	changes: { order_number?: number; designation?: string };
}) => {
	store.updateStatus(payload);
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

<style lang="scss" scoped>
.bugs-table {
	width: 100%;
	height: 100%;
	position: relative;
	padding: 2rem;
	display: flex;
	justify-content: space-between;
}

.status-list {
	display: flex;
	width: 100%;
	max-width: 100%;
	height: 100%;
	max-height: 100%;
	overflow-x: auto;
}

.ghost-card {
	opacity: 0.5;
	background: #f7fafc;
}

.drag-zone {
	min-height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding-bottom: 0.5rem;
}

.column {
	min-width: 23rem;
	max-width: 25rem;
}

.extras {
	padding: 0.25rem;

	a {
		writing-mode: vertical-lr;
		transform: rotate(180deg);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background-color: #edeef7;
		padding: 0.5rem;
		border-radius: 0.5rem;
		font-weight: bold;
		user-select: none;
		cursor: pointer;
		text-decoration: none;
		color: rgb(155, 165, 215);

		&:hover {
			color: rgb(155, 165, 215);
			filter: saturate(2.5);
		}

		img {
			width: 1.5rem;
			height: 1.5rem;
		}
	}
}

.actions {
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-between;
}
</style>
