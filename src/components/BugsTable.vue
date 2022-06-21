<template>
	<div class="bugs-table bs-scroll s-purple" v-if="statuses">
		<draggable
			:list="statuses"
			:item-key="(item) => item.id"
			@change="statusMove($event)"
			:animation="200"
			group="statuses"
			class="d-flex w-100 h-100 bs-scroll s-purple"
			:scroll-sensitivity="100"
			:force-fallback="true"
			handle=".handle"
			ref="end"
		>
			<template #item="status">
				<Column class="column">
					<template v-slot:header>
						<StatusTableHeader
							:id="status.element.id"
							:text="status.element.attributes.designation"
							@edit="editStatus"
							@delete="openDeleteModal"
							:movable="!status.element.attributes.permanent"
							:deletable="!status.element.attributes.permanent"
						/>
					</template>

					<draggable
						:list="bugs(status.element.id)"
						:item-key="(item) => item"
						@change="bugMove(status.element.id, $event)"
						:animation="200"
						ghost-class="ghost-card"
						group="tasks"
						class="drag-zone"
						:scroll-sensitivity="100"
						:force-fallback="true"
					>
						<template #item="{ element }">
							<BugCard
								:id="element.id"
								:title="
									getBug(element.id).attributes.designation
								"
								:deadline="
									getBug(element.id).attributes.deadline
										? getBug(element.id).attributes.deadline
										: ''
								"
								:priority="
									getBug(element.id).attributes.priority.id
								"
								:active="infoTab.id === element.id"
								@info="info(element.id)"
							/>
						</template>
					</draggable>
				</Column>
			</template>
		</draggable>

		<div class="extras" v-if="!newStatus.form">
			<a @click="toggleForm">
				{{ $t("add_new_column") }}
				<img
					src="/src/assets/icons/add.svg"
					alt="add"
					class="black-to-gray"
				/>
			</a>
		</div>

		<Column class="column p-0 w-auto" v-if="newStatus.form">
			<div class="bs-input">
				<input
					type="text"
					:placeholder="$t('enter_column_name')"
					v-model="newStatus.name"
				/>
			</div>

			<div class="actions my-4">
				<a class="bs-btn green" @click="addStatus">
					{{ $t("add.column") }}
				</a>
				<a @click="toggleForm" class="black-to-gray btn">
					<img src="/src/assets/icons/round_x.svg" alt="collapse" />
				</a>
			</div>
		</Column>
	</div>

	<BugTab v-if="infoTab.show" :id="infoTab.id" @close="close" />

	<StatusDeleteModal
		:show="deleteModal.show"
		:id="deleteModal.id"
		:text="deleteModal.text"
		@delete="deleteStatus"
		@close="deleteModal.show = false"
	/>

	<LoadingModal
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.show = false"
	>
		<template #success-img>
			<img
				src="/src/assets/gif/delete.gif"
				alt="success"
				class="h-50 w-auto"
			/>
		</template>
	</LoadingModal>
</template>

<script setup>
import { useProjectStore } from "~/stores/project";
import draggable from "vuedraggable";

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
});

const store = useProjectStore();

const statuses = computed(() => store.getStatuses);

const statusData = (id) => store.getStatusById(id);

const bugs = (value) => store.getBugsByStatusId(value);

const getBug = (value) => store.getBugById(value);

const bugMove = async (id, event) => {
	// sync only on the add and move events
	if (!(event.added || event.moved)) return;

	// unify events to get the info in one go
	let data = {};
	if (event.added) data = event.added;
	if (event.moved) data = event.moved;

	store.syncBug({
		id: data.element.id,
		changes: {
			status_id: id,
			order_number: data.newIndex,
		},
	});
};

const infoTab = reactive({
	show: false,
	id: -1,
});

const info = (value) => {
	infoTab.show = true;
	infoTab.id = value;
};

const close = () => {
	infoTab.show = false;
	infoTab.id = -1;
};

const newStatus = reactive({
	form: false,
	name: "",
});

const end = ref(null);
const toggleForm = () => {
	newStatus.form = !newStatus.form;
};

const addStatus = async () => {
	await store.createStatus({
		designation: newStatus.name,
		order_number: 0,
	});

	newStatus.form = false;
	newStatus.name = "";

	nextTick(() => {
		end.value.targetDomElement.children[
			end.value.targetDomElement.children.length - 1
		].scrollIntoView();
	});
};

const statusMove = (event) => {
	console.log("event: ", event);
	const element = event.moved.element;
	console.log("element: ", element);

	store.syncStatus({
		id: element.id,
		changes: {
			order_number: event.moved.newIndex,
		},
	});
};

const editStatus = (payload) => {
	store.syncStatus({
		id: payload.id,
		changes: {
			designation: payload.text,
		},
	});
};

const openDeleteModal = (id) => {
	deleteModal.show = true;
	deleteModal.id = id;
	deleteModal.text = statusData(id).attributes.designation;
};

const deleteStatus = async (payload) => {
	try {
		loadingModal.show = true;
		loadingModal.state = 0;
		loadingModal.message = null;

		await store.deleteStatus({
			id: payload.id,
			move: payload.move,
		});

		loadingModal.state = 1;
		loadingModal.message = "Status deleted successfully.";

		setTimeout(() => {
			deleteModal.show = false;
			loadingModal.show = false;
			loadingModal.state = 0;
			loadingModal.message = null;
		}, 4000);
	} catch (error) {
		loadingModal.state = 2;
		loadingModal.message = null;

		console.log(error);

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
			loadingModal.message = null;
		}, 4000);
	}
};

const deleteModal = reactive({
	show: false,
	id: "",
	text: "",
});

const loadingModal = reactive({
	show: false,
	state: 0,
	message: null,
});
</script>

<style lang="scss" scoped>
.bugs-table {
	width: 100%;
	height: 100%;
	position: relative;
	padding: 30px;
	display: flex;
}

.ghost-card {
	opacity: 0.5;
	background: #f7fafc;
}

.drag-zone {
	min-height: 100%;
	overflow: hidden;
}

.column {
	min-width: 365px;
	max-width: 400px;
}

.extras {
	padding: 4px;

	a {
		writing-mode: vertical-lr;
		transform: rotate(180deg);
		display: flex;
		align-items: center;
		gap: 6px;
		background-color: #edeef7;
		padding: 8px;
		border-radius: 8px;
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
