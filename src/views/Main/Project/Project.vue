<template>
	<Layout>
		<template v-slot:title>{{ project?.attributes.designation }}</template>

		<template v-slot:sub-title>
			{{ project?.attributes.company.designation }}
		</template>

		<template v-slot:top>
			<button>Project Settings</button>
		</template>

		<BugsTable v-if="project?.statuses">
			<Column
				v-for="status of statuses(project.id)"
				:key="'s' + status.id"
			>
				<template v-slot:header>
					{{ status.attributes.designation }}
				</template>

				<BugCard
					v-for="bug in bugs(status.id)"
					:key="'b' + bug.id"
					:id="bug.id"
					:title="bug.attributes.designation"
					:deadline="
						bug.attributes.deadline ? bug.attributes.deadline : ''
					"
					:priority="bug.attributes.priority.id"
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

export default {
	components: {
		Layout,
		BugsTable,
		Column,
		BugCard,
		BugInfo,
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

		return {
			project,
			statuses,
			bugs,
			bugInfo,
			info,
			close,
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
