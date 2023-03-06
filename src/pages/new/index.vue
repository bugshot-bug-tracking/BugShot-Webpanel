<template>
	<n-layout :style="{ padding: '2rem', height: '100% ' }">
		<n-layout-content content-style="padding: 1rem;" position="absolute">
			<div gap-8 flex flex-col>
				<h1>{{ $t("first_page.welcome") }}</h1>

				<p>{{ $t("first_page.line_1") }}</p>
				<p>{{ $t("first_page.line_2") }}</p>
				<p>{{ $t("first_page.line_3") }}</p>
			</div>

			<div flex gap-16>
				<n-button
					type="success"
					@click="startTrial"
					mt-16
					strong
					v-if="user.attributes.trial_end_date == null"
				>
					{{ $t("start_trial") }}
				</n-button>

				<n-button type="primary" @click="openPersonal" mt-16 strong>
					{{ $t("continue") }}
				</n-button>
			</div>
		</n-layout-content>
	</n-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { usePaymentsStore } from "~/stores/payments";

const user = computed(() => useAuthStore().getUser);

const router = useRouter();

const openPersonal = () => {
	router.push({ name: "new-plans" });
};

const startTrial = async () => {
	await usePaymentsStore().startTrial();

	router.push({ name: "organization-index" });
};
</script>

<style lang="scss" scoped>
:deep(.n-layout-scroll-container) {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>
