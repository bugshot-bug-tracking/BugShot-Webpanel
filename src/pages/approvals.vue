<template>
	<img
		src="/src/assets/animations/loading.svg"
		alt="loading circle"
		v-if="store.user == undefined"
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

				<n-button type="success" round>
					<template #icon>
						<Icon-Send />
					</template>

					{{ $t("send_response") }}
				</n-button>
			</div>
		</header>

		<section flex flex-col overflow-auto>
			<header my-4>
				<n-h1 mb-2> {{ $t("bug_report_approvals") }} </n-h1>
				<n-p m-0>
					{{ $t("Bug reports approvals_subtext") }}
				</n-p>
			</header>

			<ApprovalList :list="store.bugs" @totalTime="setTotalTime" />
		</section>
	</main>
</template>

<script setup lang="ts">
import { useApprovalsStore } from "~/stores/approvals";

const route = useRoute();

const store = useApprovalsStore();

const params = reactive({
	token: route.params.token as string,
});

onMounted(() => store.init(params.token));

const totalTime = ref(0);
const setTotalTime = (value: number) => {
	totalTime.value = value;
};
</script>

<route lang="yaml">
name: approvals-root

meta:
    layout: empty
</route>
