<template>
	<Layout>
		<template v-slot:title>{{ project?.attributes.designation }}</template>

		<template v-slot:sub-title v-if="project">
			{{
				projectCompany(project.attributes.company_id).attributes
					.designation
			}}
			<!-- {{ project?.attributes.company.designation }} -->
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
import axios from "axios";

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
			type: String,
			desciption: "Project ID",
		},
	},
	setup(props) {
		const project = computed(() => {
			const match = store.getters.getProjectById(props.id);

			if (match != null && match.statuses === null)
				store.dispatch("fetchBugs", match.id);

			return match;
		});

		const projectCompany = (company_id) => {
			return store.getters.getCompanyById(company_id);
		};

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

		const bugMove = async (event) => {
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

			resource.bug.attributes.status_id = resource.status_id;
			resource.bug.attributes.order_number = resource.order;

			await axios.put(
				`statuses/${resource.status.id}/bugs/${resource.bug.id}`,
				{
					project_id: resource.bug.attributes.project_id,
					designation: resource.bug.attributes.designation,
					description: resource.bug.attributes.desciption,
					url: resource.bug.attributes.url,
					status_id: resource.status.id,
					order_number: resource.order,
					priority_id: resource.bug.attributes.priority.id,
					operating_system: resource.bug.attributes.operating_system,
					browser: resource.bug.attributes.browser,
					selector: resource.bug.attributes.selector,
					resolution: resource.bug.attributes.resolution,
					deadline: resource.bug.attributes.deadline,
				}
			);
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
			projectCompany,
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
</style>
