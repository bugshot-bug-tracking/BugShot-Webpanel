<template>
	<CreateResourceModal
		:submit="onSubmit"
		:success_message="$t('company_succ_created')"
		:primary_button="primary_button"
		@close="reset"
	>
		<template #button-text>
			<span uppercase font-bold>{{ $t("create.company") }}</span>
		</template>

		<template #modal-header>
			<span capitalize>{{ $t("create.company") }}</span>
		</template>

		<template #modal-form>
			<div class="bs-input2">
				<label>
					{{ $t("company_name") }}
				</label>

				<input
					type="text"
					:placeholder="$t('company_name')"
					required
					minlength="1"
					maxlength="255"
					v-model="data.designation"
				/>
			</div>

			<Picker
				class="my-2"
				:colorPicked="data.color"
				@setImage="data.setImage"
				@setColor="data.setColor"
			/>

			<AddMembers @change="data.setInviteMembers" />
		</template>

		<template #modal-submit_button>
			<span capitalize>{{ $t("create.company") }}</span>
		</template>
	</CreateResourceModal>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";
import { useCompanyStore } from "~/stores/company";
import colors from "~/util/colors";
import toBase64 from "~/util/toBase64";

defineProps({
	primary_button: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const data = reactive({
	designation: "",
	image: undefined as File | undefined,
	color: 3,
	memberList: [] as { email: string; role: number }[],

	setColor: (value: number) => {
		data.color = value;
	},
	setImage: (value: File) => {
		data.image = value;
	},

	setInviteMembers: (value: []) => {
		data.memberList = value;
	},
});

const reset = () => {
	data.designation = "";
	data.image = undefined;
	data.color = 3;
};

const onSubmit = async () => {
	let image = undefined;

	if (data.image != null && data.image instanceof File) {
		image = btoa((await toBase64(data.image)) as string);
	}

	let response = await useOrganizationStore().createCompany({
		designation: data.designation,
		color_hex: colors[data.color],
		base64: image,
	});

	if (data.memberList) {
		await Promise.all(
			data.memberList.map(async (x) => {
				return await useCompanyStore().sendInvitationSpecific(response.id, {
					email: x.email,
					role_id: x.role,
				});
			})
		);
	}

	reset();
};
</script>
