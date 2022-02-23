<template>
	<Layout>
		<template v-slot:title>{{ $t("project", 2) }}</template>

		<template v-slot:sub-title>
			{{ record ? record.attributes.designation : $t("loading") }}
		</template>

		<template v-slot:top>
			<InviteModal :dataType="'Company'" :id="id" />

			<CreateDataModal
				:dataType="'Project'"
				:postPath="`companies/${id}/projects`"
				:aditionalBody="{
					company_id: id,
				}"
				:subTitle="`${$t('company')}: ${
					record?.attributes.designation
				}`"
			/>

			<router-link
				:to="{ name: 'CompanySettings', params: { id: id } }"
				class="btn bs be-green text-capitalize"
			>
				{{ $t("company_settings") }}
			</router-link>
		</template>

		<div v-if="arePojects">
			<GroupContainer
				:mainText="record.attributes.designation"
				:secondText="
					$t('last_update', {
						time: passedTime(record.attributes.updated_at),
					})
				"
			>
				<Card
					v-for="project of companyProjects"
					:key="project.id"
					:id="project.id"
					:title="project.attributes.designation"
					:mainText="$t('task_overview')"
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
					:image="
						project.attributes.image
							? project.attributes.image
							: null
					"
					:lastEdit="
						project.attributes.updated_at
							? project.attributes.updated_at
							: null
					"
					:routeTo="{ name: 'Project', params: { id: project.id } }"
				/>
			</GroupContainer>
		</div>
	</Layout>
</template>

<script>
import { computed } from "@vue/reactivity";
import Card from "../../../components/Card.vue";
import GroupContainer from "../../../components/GroupContainer.vue";
import Layout from "../Layout.vue";
import store from "../../../store";
import Search from "../../../components/Search.vue";
import CreateDataModal from "../../../components/CreateDataModal.vue";
import InviteModal from "../../../components/InviteModal.vue";

export default {
	components: {
		Layout,
		GroupContainer,
		Card,
		Search,
		CreateDataModal,
		InviteModal,
	},
	name: "CompanyProjects",
	props: {
		id: {
			required: true,
			type: String,
			description: "Company ID",
		},
	},
	setup(props) {
		const record = computed(() => {
			return store.getters.getCompanyById(props.id);
		});

		const companyProjects = computed(() => {
			return store.getters.getCompanyProjects(props.id);
		});

		const arePojects = computed(() => {
			if (!record.value) return false;
			if (!record.value.projects) return false;
			if (!record.value.projects.length > 0) return false;
			return true;
		});

		const bugsStats = (done, total) => {
			let str = "";
			str += done ? done : "0";
			str += " / ";
			str += total ? total : "0";
			return str;
		};

		//! TODO translate time marks
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
			record,
			arePojects,
			companyProjects,
			bugsStats,
			passedTime,
		};
	},
};
</script>
