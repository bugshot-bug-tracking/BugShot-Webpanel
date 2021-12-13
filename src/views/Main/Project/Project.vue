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
			</Column>
		</BugsTable>

		<div class="bug-info" v-if="info.show">
			<BugInfo :bug_id="info.id" @close="close" />
		</div>
	</Layout>
</template>

<script>
import { computed, reactive } from "@vue/reactivity";
import Layout from "../Layout.vue";
import store from "../../../store";
import BugsTable from "./BugsTable/Index.vue";
import Column from "./BugsTable/Column.vue";
import BugCard from "../../../components/BugCard.vue";
import BugInfo from "../../../components/BugInfo.vue";
import InviteModal from "../../../components/InviteModal.vue";


export default {
	components: {
		Layout,
		BugsTable,
		Column,
		BugCard,
		BugInfo,
		InviteModal,
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
}
</style>
