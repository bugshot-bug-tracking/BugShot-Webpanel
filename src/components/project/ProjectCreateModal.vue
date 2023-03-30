<template>
	<CreateResourceModal
		:submit="onSubmit"
		:success_message="$t('project_succ_created')"
		:primary_button="primary_button"
		@close="reset"
	>
		<template #button-text>
			<span font-bold>{{ $t("create.project") }}</span>
		</template>

		<template #modal-header>
			<span>{{ $t("create.project") }}</span>
		</template>

		<template #modal-form>
			<div class="bs-input">
				<label>
					{{ $t("project_name") }}
				</label>

				<input
					type="text"
					:placeholder="$t('project_name')"
					required
					minlength="1"
					maxlength="255"
					v-model="data.designation"
				/>
			</div>

			<div class="bs-input">
				<label>
					{{ $t("project_url") }}
				</label>

				<input
					type="text"
					:placeholder="$t('enter_project_url')"
					maxlength="65000"
					v-model="data.url"
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
			<span>{{ $t("create.project") }}</span>
		</template>
	</CreateResourceModal>
</template>

<script setup lang="ts">
import { useCompanyStore } from "~/stores/company";
import { useProjectStore } from "~/stores/project";
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
	url: undefined as undefined | string,
	image: undefined as File | undefined,
	color: 3,
	memberList: [] as { email: string; role_id: number }[],

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
	data.url = undefined;
	data.image = undefined;
	data.color = 3;
};

const onSubmit = async () => {
	let image = undefined;

	if (data.image != null && data.image instanceof File) {
		image = btoa((await toBase64(data.image)) as string);
	}

	let response = await useCompanyStore().createProject({
		designation: data.designation,
		url: data.url,
		color_hex: colors[data.color],
		base64: image,
	});

	if (data.memberList) {
		await Promise.all(
			data.memberList.map(async (x) => {
				return await useProjectStore().sendInvitationSpecific(response.id, {
					email: x.email,
					role_id: x.role_id,
				});
			})
		);
	}

	reset();
};
</script>
