<template>
	<div
		m-4
		p-2
		style="background: #ffc400; border-radius: 0.5rem"
		v-if="!hasLicense && timeLeft > 0"
	>
		<p>
			{{ t("trial_expires_in_n_days", timeLeft) }}
			<span underline cursor-pointer @click="modal.open">
				<b>
					{{ t("upgrade_now") }}
				</b>
			</span>
		</p>
	</div>

	<MyModal :modelValue="modal.show" :close="modal.close" z-2>
		<ModalTemplate @close="modal.close">
			<template #header-text> {{ t("info") }} </template>

			<div flex flex-col gap-8 items-center max-w-128 text-center>
				<h3 style="color: var(--bs-purple)">
					<b>
						{{ $t("upgrade_now_modal.title") }}
					</b>
				</h3>

				<div flex flex-col gap-4>
					<p>
						{{ $t("upgrade_now_modal.line_1") }}
					</p>
					<p>
						{{ $t("upgrade_now_modal.line_2") }}
					</p>
					<p v-if="otherOrganizations">
						{{ $t("upgrade_now_modal.line_3") }}
					</p>
				</div>

				<div flex justify-around>
					<RouterLink
						:to="{
							name: 'organization-payments',
							params: { id: organization.id },
						}"
						v-if="organization?.attributes.creator.id === user.id"
					>
						<n-button strong round type="primary">
							{{ $t("buy_a_subscription") }}
						</n-button>
					</RouterLink>

					<RouterLink
						:to="{
							name: 'organization-index',
						}"
						v-else
					>
						<n-button strong round type="primary">
							{{ $t("buy_a_subscription") }}
						</n-button>
					</RouterLink>
				</div>
			</div>
		</ModalTemplate>
	</MyModal>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useMainStore } from "~/stores/main";
import { useOrganizationStore } from "~/stores/organization";

const { t } = useI18n();

const store = useOrganizationStore();
const authStore = useAuthStore();
const organizations = computed(() => useMainStore().getOrganizations);
const organization = computed(() => store.getOrganization);
const user = computed(() => authStore.getUser);

const timeLeft = computed(() => {
	let now = new Date();
	let then = new Date(user.value.attributes.trial_end_date ?? 0);

	if (then <= now) return 0;

	// calculate the difference between the dates in milliseconds
	var difference = then.getTime() - now.getTime();

	// convert the difference to days
	var daysBetween = Math.ceil(difference / (1000 * 3600 * 24));

	return daysBetween;
});

const modal = reactive({
	show: false,
	open: () => {
		modal.show = true;
	},
	close: () => {
		modal.show = false;
	},
});

const otherOrganizations = computed(() =>
	organizations.value?.some((o) => o.attributes.creator.id !== user.value.id)
);

const hasLicense = computed(() => {
	return authStore.getLicenses.length > 0;
});
</script>

<style scoped lang="scss">
p {
	font-size: 1.125rem;
}
</style>
