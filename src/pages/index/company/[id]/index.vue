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

		<div v-if="areProjects">
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

<script setup>
import Card from "../../../components/Card.vue";
import GroupContainer from "../../../components/GroupContainer.vue";
import Layout from "../Layout.vue";
import { useMainStore } from "src/stores/main";
import Search from "../../../components/Search.vue";
import CreateDataModal from "../../../components/CreateDataModal.vue";
import InviteModal from "../../../components/InviteModal.vue";
import timeToText from "../../../util/timeToText";

const props = defineProps({
	id: {
		required: true,
		type: String,
		description: "Company ID",
	},
});

const store = useMainStore();

const record = computed(() => {
	return store.getCompanyById(props.id);
});

const companyProjects = computed(() => {
	return store.getCompanyProjects(props.id);
});

const areProjects = computed(() => {
	if (!record.value) return false;
	if (!record.value.attributes.projects) return false;
	if (!record.value.attributes.projects.length > 0) return false;
	return true;
});

const bugsStats = (done, total) => {
	let str = "";
	str += done ? done : "0";
	str += " / ";
	str += total ? total : "0";
	return str;
};

const passedTime = (lastEdit) => {
	return timeToText(lastEdit);
};
</script>
