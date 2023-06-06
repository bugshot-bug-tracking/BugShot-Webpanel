<template>
	<n-button round type="primary" strong @click="modal.open">
		{{ t("change_quantity") }}
	</n-button>

	<MyModal v-model="modal.show" :close="modal.close" z-10>
		<ModalTemplate @close="modal.close">
			<template #header-text> {{ licenseName }} </template>

			<div flex flex-col gap-2>
				<div flex gap-4>
					<p>{{ t("total_licenses") }}:</p>

					<p>{{ n(total_licenses) }}</p>
				</div>

				<div flex gap-4>
					<p>{{ t("used_license", 2) }}:</p>

					<p>{{ n(used_licenses) }}</p>
				</div>

				<div flex gap-4>
					<p>{{ t("available_licenses") }}:</p>

					<p>{{ n(total_licenses - used_licenses) }}</p>
				</div>

				<div my-4>
					<n-h4 m-0>
						{{ t("actions") }}
					</n-h4>

					<hr />
				</div>

				<div flex gap-4 items-center>
					<p>{{ t("update_quantity_by") }}:</p>

					<n-input-number
						v-model:value="quantity"
						button-placement="both"
						text-center
						:min="-total_licenses + 1"
						:keyboard="{
							ArrowUp: true,
							ArrowDown: true,
						}"
					/>
				</div>

				<div my-4>
					<n-h4 m-0>
						{{ t("summary") }}
					</n-h4>

					<hr />
				</div>
				<div flex gap-4>
					<p>{{ t("licenses_after_update") }}:</p>

					<p>{{ n(total_licenses + quantity) }}</p>
				</div>

				<div flex gap-4>
					<p>{{ t("price_for_extra_licenses") }}:</p>

					<p>
						{{
							n(
								(quantity > 0 ? quantity * 8 : 0) *
									(licenseInterval === "month" ? 1 : 10)
							)
						}}€
					</p>
				</div>

				<div flex gap-4>
					<p>
						{{
							licenseInterval === "month"
								? t("updated_monthly_cost")
								: t("updated_yearly_cost")
						}}:
					</p>

					<p>
						{{
							n(
								quantity * 8 +
									((total_licenses - 1) * 8 + 12) *
										(licenseInterval === "year" ? 10 : 1)
							)
						}}€
					</p>
				</div>
			</div>

			<template #footer>
				<div flex mt-8 mb-4 justify-around>
					<n-button
						type="success"
						strong
						round
						size="large"
						:disabled="quantity === 0"
						@click="nextStep"
					>
						{{ t("save_changes") }}
					</n-button>

					<n-button type="success" strong ghost round size="large" @click="modal.close">
						{{ t("cancel") }}
					</n-button>
				</div>
			</template>
		</ModalTemplate>

		<LicenseRevokeModal
			v-model="revokeModal.show"
			:quantity.number="revokeModal.quantity ?? 0"
			@submit="revokeUserLicenses"
			:items="licensedMembers"
			:loading="false"
			z-20
		>
			<template #button-text> {{ $t("continue") }} </template>
		</LicenseRevokeModal>
	</MyModal>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.clear"
		@onSuccess="modal.close"
	/>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";
import { usePaymentsStore } from "~/stores/payments";

const props = defineProps({
	total_licenses: {
		type: Number,
		required: true,
	},
	used_licenses: {
		type: Number,
		required: true,
	},
	license: {
		type: Object,
		required: true,
	},
});

const store = usePaymentsStore();
const { t, n } = useI18n();

const modal = reactive({
	show: false,
	open: () => {
		modal.show = true;
	},
	close: () => {
		modal.show = false;
		quantity.value = 0;
	},
});

const revokeModal = reactive({
	show: false,
	quantity: undefined as undefined | number,

	open: (quantity: number) => {
		revokeModal.quantity = quantity;

		if ((licensedMembers.value?.length ?? 0) > 0) revokeModal.show = true;
	},
	close: () => {
		revokeModal.show = false;
		revokeModal.quantity = undefined;
	},
});

const quantity = ref(0);

const licensedMembers = computed(() => {
	return useOrganizationStore().getMembersWithLicenses;
});

const nextStep = async () => {
	// if quantity is negative check to see if there are enough available licenses
	if (quantity.value < 0) {
		let available = props.total_licenses - props.used_licenses;

		// if there are enough available licenses just call the decrease route
		if (available + quantity.value >= 0) {
			console.log("next decrease");

			try {
				loadingModal.show = true;

				await store.decreaseLicenses({
					quantity: Math.abs(quantity.value),
					subscription_id: props.license.subscription,
					subscription_item: props.license.id,
					price_id: props.license.price.id,
				});

				props.license.quantity += quantity.value;

				loadingModal.state = 1;
				loadingModal.message = t("license_updated", 2);
			} catch (error: any) {
				console.log(error);
				let data = error.response.data;

				loadingModal.state = 2;
				loadingModal.message = data.message;
			}
		}
		// if the available licenses are less than the decrease amount show a revoke license modal
		else {
			revokeModal.open(Math.abs(available + quantity.value));
			console.log("open revoke");
		}
	}
	// if the quantity is positive call the increase route ??and redirect to payment page??
	else {
		console.log("open increase");

		try {
			loadingModal.show = true;

			await store.increaseLicenses({
				quantity: Math.abs(quantity.value),
				subscription_id: props.license.subscription,
				subscription_item: props.license.id,
				price_id: props.license.price.id,
			});

			loadingModal.state = 1;
			loadingModal.message = t("license_updated", 2);
		} catch (error: any) {
			console.log(error);
			let data = error.response.data;

			loadingModal.state = 2;
			loadingModal.message = data.message;
		}
	}
};

const loadingModal = reactive({
	show: false,
	state: 0,
	message: "",
	clear: () => {
		loadingModal.show = false;
		loadingModal.state = 0;
		loadingModal.message = "";
	},
});

const revokeUserLicenses = async (user_id: string[]) => {
	console.log(user_id);
	try {
		loadingModal.show = true;

		let result = await Promise.allSettled(
			user_id.map(async (id) => {
				return await useOrganizationStore().unassignUserLicense(
					id,
					props.license.id,
					props.license.subscription
				);
			})
		);

		console.log(result);

		await store.decreaseLicenses({
			quantity: Math.abs(quantity.value),
			subscription_id: props.license.subscription,
			subscription_item: props.license.id,
			price_id: props.license.price.id,
		});

		loadingModal.state = 1;
		loadingModal.message = t("license_updated", 2);
	} catch (error: any) {
		console.log(error);
		let data = error.response.data;

		loadingModal.state = 2;
		loadingModal.message = data.message;
	}
};

const licenseName = computed(() => {
	if (props.license === undefined) return "";

	let product = usePaymentsStore().products.find((p) => p.id === props.license.plan.product);

	return product?.attributes.name;
});

const licenseInterval = computed(() => {
	if (props.license === undefined) return "month";

	return props.license.plan.interval;
});
</script>

<style scoped></style>
