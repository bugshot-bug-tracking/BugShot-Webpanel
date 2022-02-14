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
			:secondText="passedTime(item.attributes.updated_at) + ' ago'"
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
				:lastEdit="
					project.attributes.updated_at
						? project.attributes.updated_at
						: null
				"
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
			return store.getters.getCompanyWithProjects.sort((a, b) =>
				a.attributes.updated_at < b.attributes.updated_at ? 1 : -1
			);
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

		const passedTime = (lastEdit) => {
			if (!(lastEdit && lastEdit != "")) return `some time`;

			let now = new Date();
			let then = new Date(lastEdit);

			// get total seconds between the times
			var delta = Math.abs(then - now) / 1000;

			// calculate (and subtract) whole days
			var days = Math.floor(delta / 86400);
			delta -= days * 86400;
			if (days > 0) return `${days} days`;

			// calculate (and subtract) whole hours
			var hours = Math.floor(delta / 3600) % 24;
			delta -= hours * 3600;
			if (hours > 0) return `${hours} hours`;

			// calculate (and subtract) whole minutes
			var minutes = Math.floor(delta / 60) % 60;
			delta -= minutes * 60;
			if (minutes > 0) return `${minutes} minutes`;

			// what's left is seconds
			var seconds = Math.floor(delta % 60); // in theory the modulus is not required
			if (seconds > 0) return `${seconds} seconds`;

			// just to have something in case no prior return was triggered
			return `some time`;
		};

		return {
			companies,
			companyProjects,
			bugsStats,
			passedTime,
		};
	},
};
</script>
