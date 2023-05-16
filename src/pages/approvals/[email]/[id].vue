<template>
	<img
		src="/src/assets/animations/loading.svg"
		alt="loading circle"
		v-if="store.bugs == undefined"
		m-a
		style="height: 100vh; width: 9.875rem"
	/>

	<main v-else flex flex-col style="width: 100vw; height: 100vh" p-12>
		<header class="bs-bb" pb-4 flex items-center justify-between>
			<RouterLink :to="{ name: 'home' }">
				<img src="/src/assets/images/bugshot-banner.svg" />
			</RouterLink>

			<div flex gap-4 items-center>
				<n-text type="primary">
					<i18n-t keypath="total_time_estimate_s" scope="global">
						<b>{{ totalTime }}</b>
					</i18n-t>
				</n-text>

				<ResponseApprovalModal
					:submit="onSubmit"
					:list="store.users"
					:disabled="responses.size < 1"
				/>
			</div>
		</header>

		<section flex flex-col overflow-auto>
			<header my-4>
				<n-h1 mb-2> {{ $t("bug_report_approvals") }} </n-h1>
				<n-p m-0>
					{{ $t("Bug reports approvals_subtext") }}
				</n-p>
			</header>

			<ApprovalList
				:list="store.bugs"
				@totalTime="setTotalTime"
				@update:responses="handleResponses"
			/>
		</section>
	</main>
</template>

<script setup lang="ts">
import { useApprovalsStore } from "~/stores/approvals";

const props = defineProps({
	email: {
		type: String,
		required: true,
	},
	id: {
		type: String,
		required: true,
	},
});

const store = useApprovalsStore();

onMounted(() => store.init(props.email, props.id));

const totalTime = ref(0);
const setTotalTime = (value: number) => {
	totalTime.value = value;

	store.bugs
		?.filter((be) => be.attributes.bug.attributes.approval_status.id !== "1")
		.forEach(
			(b) => (totalTime.value += Number(b.attributes.bug.attributes.time_estimation ?? 0))
		);
};

const responses = ref<Map<string, "pending" | "approved" | "declined">>(new Map());
const handleResponses = (list: Map<string, "pending" | "approved" | "declined">) => {
	responses.value = list;
};

const onSubmit = async (recipients: { name: string; email: string }[]) => {
	let r: { id: string; value: string }[] = [];
	responses.value.forEach((value, key) => r.push({ id: key, value }));
	return await store.sendResponses(r, recipients);
};
</script>

<route lang="yaml">
name: approvals-root

meta:
    layout: empty
</route>
