<template>
	<div flex gap-4 items-center :style="{ width: '100%' }">
		<label v-if="!noLabel" class="black-to-purple" text-6 m-0>{{ $t("organization") }}:</label>

		<v-select
			:options="organizations"
			:placeholder="$t('please_choose') + '...'"
			:get-option-label="(option:Organization) => option.attributes.designation"
			:reduce="(option:Organization) => option.id"
			v-model="organization"
			:clearable="false"
			style="width: 16rem; flex-grow: 1"
			text-left
		>
			<template #open-indicator="{ attributes }">
				<img
					class="black-to-purple"
					style="background-color: unset; cursor: pointer"
					v-bind="attributes"
					src="/src/assets/icons/caret_down.svg"
				/>
			</template>

			<template v-slot:option="option">
				<n-ellipsis style="max-width: 100%">
					{{ option.attributes.designation }}

					<template #tooltip>
						{{ option.attributes.designation }}
					</template>
				</n-ellipsis>
			</template>

			<template v-slot:selected-option="option">
				<n-ellipsis style="width: 10rem; max-width: 10rem">
					{{ option.attributes.designation }}

					<template #tooltip>
						{{ option.attributes.designation }}
					</template>
				</n-ellipsis>
			</template>
		</v-select>
	</div>
</template>

<script setup lang="ts">
import { Organization } from "~/models/Organization";
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

const organizations = computed(() => store.getOrganizations);

// this should  be the active organization
const organization = computed({
	get() {
		return useOrganizationStore().getOrganization;
	},
	set(id: string) {
		router.push({ name: "organization-home", params: { organization_id: id } });
	},
});
</script>
