<template>
	<div flex items-center gap-4 class="sh-organization-switcher">
		<p v-if="!noLabel" class="black-to-purple" text-6 m-0>{{ t("organization") }}:</p>

		<n-select v-model:value="organization" filterable :options="options" text-left>
			<template #arrow>
				<img class="black-to-purple" src="/src/assets/icons/caret_down.svg" />
			</template>
		</n-select>
	</div>
</template>

<script setup lang="ts">
import { SelectMixedOption } from "naive-ui/es/select/src/interface";
import { useMainStore } from "~/stores/main";
import { useOrganizationStore } from "~/stores/organization";

defineProps({
	noLabel: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const store = useMainStore();
const router = useRouter();

const { t } = useI18n();

// this should  be the active organization
const organization = computed({
	get() {
		if (router.currentRoute.value.name === "dashboard-all") return "0";

		let storeOrg = useOrganizationStore().getOrganization?.id;

		if (storeOrg) return storeOrg;

		return "";
	},
	set(value: string) {
		if (value === "0") router.push({ name: "dashboard-all" });
		else router.push({ name: "organization-home", params: { organization_id: value } });
	},
});

const options = computed(() => {
	let owned = {
		type: "group",
		label: t("owned"),
		key: "Owned Group",
		children: store.getMyOrganizations?.map((org) => ({
			label: org.attributes.designation,
			value: org.id,
			disabled: false,
			class: "select-option",
		})),
	};

	let external = {
		type: "group",
		label: t("other", 2),
		key: "External Group",
		children: store.getExternalOrganizations?.map((org) => ({
			label: org.attributes.designation,
			value: org.id,
			disabled: false,
			class: "select-option",
		})),
	};

	return [
		{
			label: t("organization_switcher.all_organizations"),
			value: "0",
			disabled: false,
			class: "select-option",
		},
		...(owned.children?.length ? [owned] : []),
		...(external.children?.length ? [external] : []),
	] as SelectMixedOption[];
});
</script>

<style scoped lang="scss">
:deep(.n-base-icon) {
	display: flex;
	justify-content: center;
	align-items: center;
}

img {
	width: 1.5rem;
	height: 1.5rem;
}
</style>

<style lang="scss">
.select-option {
	.n-base-select-option__check {
		display: none;
	}
}
</style>
