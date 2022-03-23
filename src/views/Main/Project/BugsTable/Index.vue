<template>
	<div class="bugs-table bs-scroll s-purple" v-if="ready">
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
		>
			<template #item="status">
				<Column class="column">
			<template v-slot:header>
						{{ status.attributes.designation }}
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
						:id="element"
						:title="getBug(element).attributes.designation"
						:deadline="
							getBug(element).attributes.deadline
								? getBug(element).attributes.deadline
								: ''
						"
								:priority="
									getBug(element).attributes.priority.id
								"
						@info="info(element)"
					/>
				</template>
			</draggable>
		</Column>
			</template>
		</draggable>

		<div class="extras" v-if="!newStatus.form">
			<a @click="toggleForm">
				Add New Column
				<img
					src="../../../../assets/icons/add.svg"
					alt="add"
					class="bs-to-gray"
				/>
			</a>
		</div>

		<Column class="column p-0" v-if="newStatus.form">
			<div class="bs-input">
				<input
					type="text"
					placeholder="Enter Column Name"
					v-model="newStatus.name"
				/>
			</div>

			<div class="actions my-4">
				<a class="btn bs bf-green" @click="addStatus">Add column</a>
				<a @click="toggleForm" class="bs-to-gray btn">
					<img
						src="../../../../assets/icons/round_x.svg"
						alt="collapse"
					/>
				</a>
			</div>
			<div ref="end" />
		</Column>
	</div>

	<BugInfo v-if="infoTab.show" :id="infoTab.id" @close="close" />
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import { computed, nextTick, watch } from "@vue/runtime-core";
import store from "../../../../store";
import Column from "./Column.vue";
import draggable from "vuedraggable";
import BugCard from "../../../../components/BugCard.vue";
import BugInfo from "../../../../components/BugInfo.vue";

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
});

const ready = ref(false);
store
	.dispatch("kanban/setProjectId", props.id)
	.then(() => (ready.value = true));

watch(props, () => {
	ready.value = false;

	store
		.dispatch("kanban/setProjectId", props.id)
		.then(() => (ready.value = true));
});

const statuses = computed(() => store.getters["kanban/getStatuses"]);

// const getStatus = (value) => store.getters["kanban/getStatusById"](value);
const bugs = (value) => store.getters["kanban/getBugsByStatusId"](value);
const getBug = (value) => store.getters["kanban/getBugById"](value);

const bugMove = async (id, event) => {
	// sync only on the add and move events
	if (!(event.added || event.moved)) return;

	// unify events to get the info in one go
	let data = {};
	if (event.added) data = event.added;
	if (event.moved) data = event.moved;

	store.dispatch("kanban/syncBug", {
		id: data.element,
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
	console.log(end);

	nextTick(() => {
		end.value.scrollIntoView();
	});
};

const addStatus = async () => {
	await store.dispatch("kanban/createStatus", {
		designation: newStatus.name,
		order_number: 0,
	});

	newStatus.form = false;
	newStatus.name = "";
};

const statusMove = (event) => {
	console.log("event: ", event);
	const element = event.moved.element;
	console.log("element: ", element);

	store.dispatch("kanban/syncStatus", {
		id: element.id,
		changes: {
			order_number: event.moved.newIndex,
		},
	});
};

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
	min-width: 250px;
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
