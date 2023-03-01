<template>
	<section>
		<header flex gap-8>
			<n-button
				strong
				:ghost="showUsed ? false : true"
				:type="showUsed ? 'primary' : 'tertiary'"
				size="large"
				@click="showUsed = true"
			>
				{{ $t("used_license", 2) }}
			</n-button>

			<n-button
				strong
				:ghost="showUsed ? true : false"
				:type="!showUsed ? 'primary' : 'tertiary'"
				size="large"
				@click="showUsed = false"
			>
				{{ $t("unused_license", 2) }}
			</n-button>
		</header>

		<n-list v-if="showUsed" class="bs-scroll s-purple" pr-2 :show-divider="false">
			<template #header>
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

			<n-checkbox-group v-model:value="checkbox">
				<n-list-item v-for="user in license_users" :key="user.id">
					<LicenseCard
						:license_name="user.license_name"
						:user_name="user.user_name"
						:user_email="user.user_email"
						:assigned_on="user.assigned_on"
						:available_until="user.available_until"
						:id="user.id"
						@unassign="unassign"
					/>
				</n-list-item>
			</n-checkbox-group>
		</n-list>

		<n-list v-else class="bs-scroll s-purple" pr-2 :show-divider="false">
			<n-list-item v-for="user in available_licenses" :key="user.id">
				<LicenseCard
					:license_name="user.license_name"
					:available_until="user.available_until"
					:quantity="user.quantity"
					:id="user.id"
					@submit="modal.open"
					:show_checkbox="false"
				/>
			</n-list-item>
		</n-list>

		<LicenseAssignModal
			v-model="modal.show"
			:license_name="'Starter'"
			@submit="col"
			:items="unlicensedUsers"
		>
		</LicenseAssignModal>
	</section>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";

const store = useOrganizationStore();

const unlicensedUsers = computed(() => store.getUserWithoutLicenses);
const showUsed = ref(true);

const checkbox = ref([]);

const unassign = () => {};

const selectAll = (value: boolean) => {
	if (value) license_users.value.forEach((u) => checkbox.value.push(u.id));
	else checkbox.value = [];
};

const license_users = computed(() => {
	return [
		{
			license_name: "Starter",
			user_name: "Poky",
			user_email: "poky@pok.go",
			assigned_on: "15.25.2555",
			available_until: "25.22.2124",
			id: "1",
		},
		{
			license_name: "Starter",
			user_name: "Poky",
			user_email: "poky@pok.go",
			assigned_on: "15.25.2555",
			available_until: "25.22.2124",
			id: "2",
		},
		{
			license_name: "Starter",
			user_name: "Poky",
			user_email: "poky@pok.go",
			assigned_on: "15.25.2555",
			available_until: "25.22.2124",
			id: "3",
		},
		{
			license_name: "Starter",
			user_name: "Poky",
			user_email: "poky@pok.go",
			assigned_on: "15.25.2555",
			available_until: "25.22.2124",
			id: "4",
		},
		{
			license_name: "Starter",
			user_name: "Poky",
			user_email: "poky@pok.go",
			assigned_on: "15.25.2555",
			available_until: "25.22.2124",
			id: "5",
		},
		{
			license_name: "Starter",
			user_name: "Poky",
			user_email: "poky@pok.go",
			assigned_on: "15.25.2555",
			available_until: "25.22.2124",
			id: "6",
		},
	];
});

const available_licenses = computed(() => {
	return [
		{
			license_name: "Starter",
			quantity: 5,
			available_until: "25.22.2124",
			id: "1",
		},
		{
			license_name: "Starter",
			quantity: 10,
			available_until: "25.22.2124",
			id: "2",
		},
		{
			license_name: "Starter",
			quantity: 15,
			available_until: "25.22.2124",
			id: "3",
		},
	];
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

const col = (value: any) => {
	console.log(value);
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
