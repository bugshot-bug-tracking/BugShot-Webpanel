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

		return {
			project,
			statuses,
			bugs,
		};
	},
};
</script>

<style></style>
