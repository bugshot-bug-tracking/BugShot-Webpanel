<template>
	<Layout>
		<template v-slot:title>{{ project?.attributes.designation }}</template>

		<template v-slot:sub-title>
			{{ project?.attributes.company.designation }}
		</template>

		<template v-slot:top>
			<InviteModal :dataType="'Project'" :id="id" />

			<router-link
				:to="{ name: 'ProjectSettings', params: { id: id } }"
				class="btn bs be-green"
			>
				Project Settings
			</router-link>
		</template>

		<BugsTable v-if="project?.statuses">
			<Column v-for="status of project.statuses" :key="status">
				<template v-slot:header>
					{{ statusData(status).attributes.designation }}
				</template>

				<draggable
					:list="statusData(status).bugs"
					:animation="200"
					ghost-class="ghost-card"
					group="tasks"
					:item-key="(item) => item"
					@change="bugMove"
					class="drag-zone"
					@move="setStatusKey"
				>
					<template #item="{ element }">
						<BugCard
							:id="bugData(element).id"
							:title="bugData(element).attributes.designation"
							:deadline="
								bugData(element).attributes.deadline
									? bugData(element).attributes.deadline
									: ''
							"
							:priority="bugData(element).attributes.priority.id"
							@info="bugInfo"
						/>
					</template>
				</draggable>
			</Column>
		</BugsTable>

		<div class="bug-info" v-if="info.show">
			<BugInfo :bug_id="info.id" @close="close" />
		</div>
	</Layout>
</template>

<script>
import { computed, reactive, ref } from "@vue/reactivity";
import Layout from "../Layout.vue";
import store from "../../../store";
import BugsTable from "./BugsTable/Index.vue";
import Column from "./BugsTable/Column.vue";
import BugCard from "../../../components/BugCard.vue";
import BugInfo from "../../../components/BugInfo.vue";
import InviteModal from "../../../components/InviteModal.vue";

import draggable from "vuedraggable";

export default {
	components: {
		Layout,
		BugsTable,
		Column,
		BugCard,
		BugInfo,
		InviteModal,
		draggable,
	},
	props: {
		id: {
			required: true,
		},
	},
	setup(props) {
		const project = computed(() => {
			//!!!!!!!!!!!!!!!!! !TODO! update after UUID Changes

			const match = store.getters.getProjectById(parseInt(props.id));

			if (match != null && match.statuses === null)
				store.dispatch("fetchBugs", match.id);

			return match;
		});

		const statuses = (project_id) => {
			return store.getters.getProjectStatuses(project_id);
		};

		const bugs = (status_id) => {
			return store.getters.getStatusBugs(status_id);
		};

		const info = reactive({
			show: false,
			id: -1,
		});

		const bugInfo = (value) => {
			info.show = true;
			info.id = value;

			store.dispatch("fetchScreenshots", value);
			store.dispatch("fetchAttachments", value);
			store.dispatch("fetchComments", value);
		};

		const close = () => {
			info.show = false;
			info.id = -1;
		};

		const statusKey = ref("");

		const setStatusKey = (event) => {
			// take the status id from the vue node key attribute
			statusKey.value =
				event.to.parentNode.parentNode.__vueParentComponent.vnode.key;
		};

		const bugMove = (event) => {
			// sync only on the add and move events
			if (!(event.added || event.moved)) return;

			// unify events to get the info in one go
			let data = {};
			if (event.added) data = event.added;
			if (event.moved) data = event.moved;

			let resource = {
				bug_id: data.element,
				status_id: statusKey.value,
				bug: store.getters.getBugById(data.element),
				status: store.getters.getStatusById(statusKey.value),
				order: data.newIndex,
			};

			resource.bug.attributes.status = {
				id: resource.status.id,
				designation: resource.status.attributes.designation,
			};

			console.log("resource", resource);
		};

		const statusData = (value) => {
			return store.state.data.statuses.get(value);
		};

		const bugData = (value) => {
			return store.state.data.bugs.get(value);
		};

		return {
			project,
			statuses,
			bugs,
			bugInfo,
			info,
			close,
			setStatusKey,
			bugMove,
			statusData,
			bugData,
		};
	},
};
</script>

<style lang="scss" scoped>
.bug-info {
	position: absolute;
	z-index: 1;
	top: 0;
	right: 0;
	box-shadow: -16px 0px 24px #1a20403d;
}

.ghost-card {
	opacity: 0.5;
	background: #f7fafc;
}

.drag-zone {
	min-height: 50px;
	padding-bottom: 50px;
	overflow: hidden;
}
</style>
