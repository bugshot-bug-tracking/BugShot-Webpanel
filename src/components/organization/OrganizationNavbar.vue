<template>
	<ResourceNavbar :list="organizations" :order="order" @change-order="onChangeOrder">
		<template> </template>

		<template #header-text>
			{{ $t("organization", 2) }}
		</template>

		<template #order-text>
			{{ $t("order_organizations") }}
		</template>

		<template #item="{ item }: { item: Organization }">
			<ResourceNavbarItem
				:text="item.attributes.designation"
				:to_resource="{ name: 'organization', params: { id: item.id } }"
				:owner="user.id === item.attributes.creator.id"
				@toggle="items_opened.toggle(item.id)"
				:open="
					items_opened.secondary === item.id
						? items_opened.s_open
						: items_opened.primary === item.id
						? items_opened.p_open
						: false
				"
			>
				<template #list>
					<RouterLink
						:to="{ name: 'organization', params: { id: item.id } }"
						class="route"
						:style="{
							'font-weight': 'bold',
							width: 'auto',
						}"
					>
						<img
							src="/src/assets/icons/gear.svg"
							alt="settings"
							w-6
							h-6
							:title="$t('overview')"
						/>
						{{ $t("overview") }}
					</RouterLink>

					<RouterLink
						:to="{ name: 'organization-users', params: { id: item.id } }"
						class="route"
						:style="{
							'font-weight': 'bold',
							width: 'auto',
						}"
						v-if="false"
					>
						<img
							src="/src/assets/icons/people.svg"
							alt="memers"
							w-6
							h-6
							p-1
							:title="$t('team_members')"
						/>
						{{ $t("team_members") }}
					</RouterLink>

					<RouterLink
						:to="{ name: 'organization-payments', params: { id: item.id } }"
						class="route"
						:style="{
							'font-weight': 'bold',
							width: 'auto',
						}"
						v-if="false"
					>
						<img
							src="/src/assets/icons/euro.svg"
							alt="settings"
							w-6
							h-6
							p-1
							:title="$t('payments_and_plans')"
						/>
						{{ $t("payments_and_plans") }}
					</RouterLink>
				</template>
			</ResourceNavbarItem>
		</template>

		<template #footer>
			<OrganizationCreateModal :primary_button="false" />
		</template>
	</ResourceNavbar>
</template>

<script setup lang="ts">
import OrganizationCreateModal from "./OrganizationCreateModal.vue";
import { useSettingsStore } from "~/stores/settings";
import { useMainStore } from "~/stores/main";
import { Organization } from "~/models/Organization";
import { useAuthStore } from "~/stores/auth";

const order = computed(() => useSettingsStore().getOrganizationsOrder);

const onChangeOrder = (value: number) => {
	useSettingsStore().setOrganizationsOrder(value);
};

const organizations = computed(() => useMainStore().getMyOrganizations);

const user = computed(() => useAuthStore().getUser);

//TODO somehow move the logic bellow vvvvv in the ResourceNavbar or ResourceNavbarItem

const items_opened = reactive({
	// used for identifying the item to manually toggle
	primary: "",
	// used for identifying the item that is related to the page
	secondary: "",

	p_open: false,
	s_open: false,

	toggle: (id: string) => {
		// in case the page item is toggled ignore the primary item
		if (items_opened.secondary === id) return (items_opened.s_open = !items_opened.s_open);

		// in case the toggle is on the same element change only the open value
		if (items_opened.primary === id) return (items_opened.p_open = !items_opened.p_open);
		// otherwise set the primary and open to true
		else {
			items_opened.primary = id;
			items_opened.p_open = true;
			return;
		}
	},
});

const route = useRoute();
watch(route, () => setOpen());

const setOpen = () => {
	if (!route.params.id) return;

	// check to see if the page is related to a organization (ex. settings, invoices, plans...) and set the appropriate state
	if (route.name?.toString().includes("organization")) {
		items_opened.secondary = route.params.id as string;
		items_opened.s_open = true;
		return; // leave here to have a predictable exit
	}
};

setOpen();
</script>

<style lang="scss" scoped></style>
