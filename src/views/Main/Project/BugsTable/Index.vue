<template>
	<div class="bugs-table bs-scroll s-purple" v-if="ready">
		<Column v-for="status of statuses" :key="status" class="column">
			<template v-slot:header>
				{{ status.attributes.designation }}
			</template>

			<draggable
				:list="bugs(status.id)"
				:item-key="(item) => item"
				@change="bugMove(status.id, $event)"
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
						:priority="getBug(element).attributes.priority.id"
						@info="info(element)"
					/>
				</template>
			</draggable>
		</Column>
	</div>

	<BugInfo v-if="infoTab.show" :id="infoTab.id" @close="close" />
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import { computed, onUnmounted } from "@vue/runtime-core";
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
</script>

<style lang="scss" scoped>
.bugs-table {
	width: 100%;
	height: 100%;
	position: relative;
	padding: 30px;
	display: flex;
}

.bug-info {
	position: absolute;
	z-index: 1;
	top: 0;
	right: 0;
	box-shadow: -10px 0px 24px hsla(231, 42%, 18%, 0.11);
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
</style>
