<template>
	<Layout>
		<template v-slot:title>All Projects</template>

		<!-- <template v-slot:top>
			<Search />
		</template> -->

		<GroupContainer
			v-for="item of companies"
			:key="item.id"
			:mainText="item.attributes.designation"
		>
			<Card
				v-for="project of companyProjects(item.id)"
				:key="project.id"
				:id="project.id"
				:title="project.attributes.designation"
				:mainText="'Task Overview'"
				:secondText="
					bugsStats(
						project.attributes.bugsDone,
						project.attributes.bugsTotal
					)
				"
				:color="
					project.attributes.color_hex
						? project.attributes.color_hex
						: '#7A2EE6'
				"
				:image="project.attributes.image"
				:routeTo="{ name: 'Project', params: { id: project.id } }"
			/>
		</GroupContainer>
	</Layout>
</template>

<script>
import { computed } from "@vue/reactivity";
import Card from "../../../components/Card.vue";
import GroupContainer from "../../../components/GroupContainer.vue";
import Layout from "../Layout.vue";
import store from "../../../store";
import Search from "../../../components/Search.vue";

export default {
	components: {
		Layout,
		GroupContainer,
		Card,
		Search,
	},
	name: "AllProjects",
	setup() {
		const companies = computed(() => {
			return store.getters.getCompanyWithProjects;
		});

		const companyProjects = (company_id) => {
			return store.getters.getCompanyProjects(company_id);
		};

		const bugsStats = (done, total) => {
			let str = "";
			str += done ? done : "0";
			str += " / ";
			str += total ? total : "0";
			return str;
		};

		return {
			companies,
			companyProjects,
			bugsStats,
		};
	},
};
</script>
