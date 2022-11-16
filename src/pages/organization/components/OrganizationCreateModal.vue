<template>
	<CreateResourceModal
		:submit="onSubmit"
		:success_message="$t('organization_succ_created')"
		:primary_button="primary_button"
		@close="reset"
	>
		<template #button-text>
			<span uppercase font-bold>{{ $t("create.organization") }}</span>
		</template>

		<template #modal-header>
			<span capitalize>{{ $t("create.organization") }}</span>
		</template>

		<template #modal-form>
			<div class="bs-input2">
				<label>
					{{ $t("organization_name") }}
				</label>

				<input
					type="text"
					:placeholder="$t('organization_name')"
					required
					minlength="1"
					maxlength="255"
					v-model="data.designation"
				/>
			</div>
		</template>

		<template #modal-submit_button>
			<span capitalize>{{ $t("create.organization") }}</span>
		</template>
	</CreateResourceModal>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";

defineProps({
	primary_button: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const data = reactive({
	designation: "",
});

const reset = () => {
	data.designation = "";
};

const onSubmit = async () => {
	await useOrganizationStore().createOrganization(data);

	reset();
};
</script>

<style lang="scss" scoped></style>
