<template>
	<div flex items-center gap-4>
		<p v-if="!noLabel" class="black-to-purple" text-6 m-0>{{ $t("organization") }}:</p>

		<n-select v-model:value="organization" filterable :options="options" :key="key" text-left>
			<template #arrow>
				<img class="black-to-purple" src="/src/assets/icons/caret_down.svg" />
			</template>
		</n-select>
	</div>
</template>

<script setup lang="ts">
import { SelectGroupOption, SelectOption } from "naive-ui";
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
		return useOrganizationStore().getOrganization?.id ?? "";
	},
	set(id: string) {
		router.push({ name: "organization-home", params: { organization_id: id } });
	},
});

const ownedGroup = computed(
	(): SelectGroupOption => ({
		type: "group",
		label: t("owned"),
		key: "Owned Group",
		children: store.getMyOrganizations?.map(
			(org): SelectOption => ({
				label: org.attributes.designation,
				value: org.id,
				disabled: false,
				class: "select-option",
			})
		),
	})
);

const externalGroup = computed(
	(): SelectGroupOption => ({
		type: "group",
		label: t("other", 2),
		key: "External Group",
		children: store.getExternalOrganizations?.map(
			(org): SelectOption => ({
				label: org.attributes.designation,
				value: org.id,
				disabled: false,
				class: "select-option",
			})
		),
	})
);

const options: SelectGroupOption[] = [];

// this code is to make the options reactive ---vvvvv
let key = ref(Math.random());

watchEffect(() => {
	options[0] = ownedGroup.value;

	// this forces the rerender of the component
	key.value = Math.random();
});

watchEffect(() => {
	if ((externalGroup.value.children?.length ?? 0) < 0) options.splice(1, 1);
	else options[1] = externalGroup.value;

	// this forces the rerender of the component
	key.value = Math.random();
});
// -------------------------------------------------
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
