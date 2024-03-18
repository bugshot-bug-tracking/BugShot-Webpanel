<template>
	<section>
		<header flex gap-8>
			<n-button
				strong
				:ghost="showUsed ? false : true"
				:type="showUsed ? 'primary' : 'tertiary'"
				@click="showUsed = true"
			>
				{{ $t("used_license", 2) }}
			</n-button>

			<n-button
				strong
				:ghost="showUsed ? true : false"
				:type="!showUsed ? 'primary' : 'tertiary'"
				@click="showUsed = false"
			>
				{{ $t("unused_license", 2) }}
			</n-button>
		</header>

		<n-list v-if="showUsed" :show-divider="false" flex flex-col>
			<template #header v-if="false">
				<div flex justify-between px-2>
					<n-checkbox @update:checked="selectAll">
						<b>{{ $t("select_all") }}</b>
					</n-checkbox>
					<div>
						<n-button strong text type="error" :disabled="(checkbox.length ?? 0) < 1">
							<template #icon>
								<img
									src="/src/assets/icons/delete.svg"
									alt="trash can"
									w-5
									h-5
									class="black-to-red"
								/>
							</template>
							{{ $t("unassign_member", 2) }}
						</n-button>
					</div>
				</div>
			</template>

			<n-checkbox-group
				v-model:value="checkbox"
				v-if="(authUser.attributes.subscriptions?.length ?? 0) > 0"
			>
				<n-list-item v-for="sub in authUser.attributes.subscriptions" :key="sub.id">
					<LicenseCard
						:license_name="authUserLicenseData(sub).license_name"
						:user_name="authUserLicenseData(sub).user_name"
						:user_email="authUserLicenseData(sub).user_email"
						:assigned_on="authUserLicenseData(sub).assigned_on"
						:available_until="authUserLicenseData(sub).available_until"
						:id="`${authUser.id}`"
						@unassign="deleteModal.open(authUser, sub)"
						:external="
							sub.subscription?.attributes.subscription?.attributes.billable
								.billing_addressable_id !== id
						"
						:show_checkbox="false"
					>
						<template #button>
							<div
								v-if="
									sub.subscription?.attributes.subscription?.attributes.billable
										.billing_addressable_id !== id
								"
							></div>
						</template>
					</LicenseCard>
				</n-list-item>

				<n-list-item v-for="user in licensedMembers" :key="user.id">
					<LicenseCard
						:license_name="userLicenseData(user).license_name"
						:user_name="userLicenseData(user).user_name"
						:user_email="userLicenseData(user).user_email"
						:assigned_on="userLicenseData(user).assigned_on"
						:available_until="userLicenseData(user).available_until"
						:id="`${user.id}`"
						@unassign="deleteModal.open(user)"
						:show_checkbox="false"
						:external="isExternalUserLicense(user.subscription)"
					/>
				</n-list-item>
			</n-checkbox-group>

			<n-empty v-else size="large" :description="$t('no licenses_assigned')" m-a> </n-empty>
		</n-list>

		<n-list v-else :show-divider="false">
			<n-list-item v-for="lic in available_licenses" :key="lic.id">
				<LicenseCard
					:license_name="getLicenseName(lic)"
					:available_until="getLicenseAvailability(lic)"
					:quantity="lic.quantity - lic.assigned"
					:id="lic.id"
					@submit="modal.open(lic)"
					:show_checkbox="false"
				>
					<template #button-extra>
						<ChangeLicenseModal
							:total_licenses="lic.quantity"
							:used_licenses="lic.assigned ?? 0"
							:license="lic"
						/>
					</template>
				</LicenseCard>
			</n-list-item>
		</n-list>

		<LicenseAssignModal
			v-model="modal.show"
			:license_name="licenseName(modal.license)"
			@submit="assignLicense"
			:items="unlicensedMembers"
			:loading="loading"
			z-20
		/>
	</section>

	<DeleteModal2
		:show="deleteModal.show"
		:header="deleteModal.header"
		:text="deleteModal.text"
		@close="deleteModal.clear"
		@delete="!deleteModal.owner ? unassignLicense() : unassignAuthUserLicense()"
	/>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.clear"
	/>
</template>

<script setup lang="ts">
import { User } from "~/models/User";
import { useAuthStore } from "~/stores/auth";
import { useOrganizationStore } from "~/stores/organization";
import { usePaymentsStore } from "~/stores/payments";

const props = defineProps({
	id: {
		type: String,
		required: true,
	},

	subscription_id: {
		type: String,
		required: true,
	},
});

const authUser = computed(() => {
	return useAuthStore().getUser;
});

console.log(props);

const store = useOrganizationStore();

const showUsed = ref(true);

const checkbox = ref([]);

const selectAll = (value: boolean) => {
	return;
	// if (value) license_users.value.forEach((u) => checkbox.value.push(u.id));
	// else checkbox.value = [];
};

const available_licenses = computed(() => {
	let s = store.getSubscriptionLicenses(props.subscription_id);
	console.log("s:", s);
	return s;
});

const modal = reactive({
	show: false,
	license: undefined,
	open: (license: any) => {
		modal.show = true;
		modal.license = license;
	},
	close: () => {
		modal.show = false;
		modal.license = undefined;
	},
});

const licensedMembers = computed(() => {
	let m = store.getMembersWithLicenses;
	console.log("m:", m);
	return m;
});
const unlicensedMembers = computed(() => {
	let members = store.getMembersWithoutLicenses;

	let owner = authUser.value?.attributes.subscriptions?.find((s) => {
		let ss =
			s.subscription?.attributes.subscription?.attributes.billable.billing_addressable_id ===
			props.id;
		console.log(ss);
		return ss;
	});
	console.log("owner", owner);

	if (!owner) return [authUser.value, ...(members ?? [])];

	return members;
});

const assignLicense = async (user: User) => {
	try {
		loading.value = true;
		let response = await store.assignUserLicense(
			user.id,
			modal.license.id,
			modal.license.subscription
		);
		console.log(response);
		store.refresh();

		if (user.id === authUser.value.id) useAuthStore().refresh();
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
		modal.close();
	}
};

const getLicenseAvailability = (license: any) => {
	let subscription = store.getSubscriptionById(license.subscription);
	let end = subscription.attributes.cancel_at;

	if (end) return new Date(end * 1000).toLocaleDateString();

	return "∞";
};
const getLicenseName = (license: any) => {
	let id = license.plan.product;

	let product = usePaymentsStore().products.find((p) => p.id === id);

	return product?.attributes.name;
};

const loading = ref(false);

const userLicenseData = (user: User) => {
	return {
		license_name: usePaymentsStore().products.find(
			(p) => p.id === user.subscription.attributes.stripe_product
		)?.attributes.name,

		user_name: user.attributes.first_name + " " + user.attributes.last_name,
		user_email: user.attributes.email,
		assigned_on: new Date(user.subscription.attributes.created_at).toLocaleDateString(),
		available_until: user.subscription.attributes.subscription.attributes.end_at
			? new Date(
					user.subscription.attributes.subscription.attributes.end_at * 1000
			  ).toLocaleDateString()
			: "∞",
	};
};

const unassignLicense = async () => {
	let user = deleteModal.entity;
	console.log(user);

	try {
		loadingModal.show = true;

		let response = await store.unassignUserLicense(
			user.id,
			user.subscription.attributes.stripe_id,
			user.subscription.attributes.subscription.attributes.stripe_id
		);

		loadingModal.state = 1;
		loadingModal.message = t("license_removed");

		store.refresh();

		useAuthStore().refresh();
	} catch (error: any) {
		console.log(error);

		loadingModal.state = 2;
	}
};

const unassignAuthUserLicense = async () => {
	let user = deleteModal.entity;
	let sub = deleteModal.owner;

	console.log(user, sub);

	try {
		loadingModal.show = true;

		let response = await store.unassignUserLicense(
			user.id,
			sub.subscription.attributes.stripe_id,
			sub.subscription.attributes.subscription.attributes.stripe_id
		);

		loadingModal.state = 1;
		loadingModal.message = t("license_removed");

		store.refresh();

		useAuthStore().refresh();
	} catch (error: any) {
		console.log(error);

		loadingModal.state = 2;
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

const { t } = useI18n();

const deleteModal = reactive({
	show: false,
	text: "[PH]",
	header: t("want_to_remove_user_license"),
	callback: null,
	entity: {} as User | undefined | any, //a place to store the data object for after the modal confirmation

	owner: undefined as undefined | any,

	open: (user: User, owner?: any) => {
		deleteModal.show = true;

		deleteModal.text = `${user.attributes.first_name} ${user.attributes.last_name}`;

		deleteModal.entity = user as User;

		deleteModal.owner = owner;
	},

	clear: () => {
		deleteModal.show = false;
		deleteModal.text = "";
		deleteModal.callback = null;
		deleteModal.entity = undefined;
		deleteModal.owner = undefined;
	},
});

const authUserLicenseData = (sub: any) => {
	return {
		license_name: usePaymentsStore().products.find(
			(p) => p.id === sub.subscription.attributes.stripe_product
		)?.attributes.name,

		user_name: authUser.value.attributes.first_name + " " + authUser.value.attributes.last_name,
		user_email: authUser.value.attributes.email,
		assigned_on: new Date(sub.subscription?.attributes.created_at).toLocaleDateString(),
		available_until: sub.subscription?.attributes.subscription?.attributes.end_at
			? new Date(
					sub.subscription?.attributes.subscription?.attributes.end_at * 1000
			  ).toLocaleDateString()
			: "∞",
	};
};

const isExternalUserLicense = (user_subscription: any) => {
	if (
		user_subscription.attributes.subscription.attributes.billable.billing_addressable_id ===
		props.id
	)
		return false;
	return true;
};

const licenseName = (license: any) => {
	if (license === undefined) return "";

	let product = usePaymentsStore().products.find((p) => p.id === license.plan.product);

	return product?.attributes.name;
};
</script>

<style scoped lang="scss">
section {
	padding: 3rem;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

:deep(.n-list) {
	height: 100%;
	background: transparent;
}
</style>

<route lang="yaml">
name: organization-payments-subscription-licenses
</route>
