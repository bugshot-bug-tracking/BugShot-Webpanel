<template>
	<div
		class="license-overlay"
		inset-0
		absolute
		z-1
		flex
		flex-col
		items-center
		justify-center
		style="background: hsla(0, 0%, 0%, 0.45)"
		v-if="!(isGuest || hasLicense || inTrial)"
	>
		<ModalTemplate w-116>
			<div flex flex-col gap-8>
				<h3 style="color: var(--bs-purple)">
					<b>
						{{ $t("no_license_overlay.title") }}
					</b>
				</h3>

				<hr />

				<p>
					{{ $t("no_license_overlay.line_1") }}
				</p>

				<p>
					{{ $t("no_license_overlay.line_2") }}
				</p>

				<div text-left v-if="(organizations?.length ?? 0) > 1">
					<label style="color: var(--bs-gray)">
						<b>
							{{ $t("no_license_overlay.option") }}
						</b>
					</label>

					<OrganizationSwitcher noLabel />
				</div>

				<div flex justify-around>
					<n-button
						type="success"
						@click="startTrial"
						strong
						round
						v-if="user.attributes.trial_end_date == null"
					>
						{{ $t("start_trial") }}
					</n-button>

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
				</div>
			</div>
		</ModalTemplate>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useMainStore } from "~/stores/main";
import { useOrganizationStore } from "~/stores/organization";
import { usePaymentsStore } from "~/stores/payments";

const store = useOrganizationStore();
const authStore = useAuthStore();
const organizations = computed(() => useMainStore().getOrganizations);
const organization = computed(() => store.getOrganization);
const user = computed(() => authStore.user);

const hasLicense = computed(() => {
	return authStore.getLicenses.length > 0;
});

const isGuest = computed(() => {
	return organization.value?.attributes.role?.id === 3;
});
const inTrial = computed(() => {
	const d1 = new Date(user.value.attributes.trial_end_date ?? 0);
	const d2 = new Date();

	return d1 > d2;
});

const startTrial = async () => {
	await usePaymentsStore().startTrial();
};
</script>

<style scoped></style>
