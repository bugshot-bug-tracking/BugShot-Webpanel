<template>
	<ResourceCreateModal
		:submit="onSubmit"
		:success_message="$t('project_succ_created')"
		:primary_button="primary_button"
		@close="reset"
		:rules="rules"
	>
		<template #button-text>
			<span>{{ $t("create.project") }}</span>
		</template>

		<template #modal-header>
			<span>{{ $t("create.project") }}</span>
		</template>

		<template #modal-form>
			<n-form-item :label="t('project_name')" path="designation">
				<n-input
					v-model:value="data.designation"
					type="text"
					:minlength="1"
					:maxlength="255"
					:placeholder="t('project_name')"
					:disabled="loading"
					required
				/>
			</n-form-item>

			<n-form-item :label="t('project_url')" path="url">
				<UrlInput
					v-model="data.url"
					:disabled="loading"
					:placeholder="t('enter_main_project_url')"
					@click:suffix="data.urlList.push('')"
					noWildcard
					onlyOrigin
					:noActions="!multipleURL"
				/>
			</n-form-item>

			<div v-if="multipleURL">
				<n-form-item
					v-for="(item, index) in data.urlList"
					:label="t('other_project_url_optional')"
				>
					<UrlInput
						:placeholder="t('enter_project_url')"
						v-model="data.urlList[index]"
						:disabled="loading"
						@click:suffix="data.urlList.splice(index, 1)"
						noWildcard
					>
						<template #suffix>
							<img
								src="/src/assets/icons/remove.svg"
								alt=""
								class="black-to-purple-middle"
							/>
						</template>
					</UrlInput>
				</n-form-item>
			</div>

			<Picker
				:colorPicked="data.color"
				@setImage="data.setImage"
				@setColor="data.setColor"
				my-2
			/>

			<AddMembers @change="data.setInviteMembers" infoKey="tooltips.project_roles" />
		</template>

		<template #button v-if="$slots['button']">
			<slot name="button" />
		</template>

		<template #modal-submit_button>
			<span>{{ $t("create.project") }}</span>
		</template>
	</ResourceCreateModal>
</template>

<script setup lang="ts">
import { FormRules } from "naive-ui";
import { Company } from "~/models/Company";
import { useCompanyStore } from "~/stores/company";
import { useProjectStore } from "~/stores/project";
import colors from "~/util/colors";
import toBase64 from "~/util/toBase64";

const props = defineProps({
	primary_button: {
		type: Boolean,
		required: false,
		default: false,
	},

	company: {
		type: Object as PropType<Company>,
		required: false,
		default: undefined,
	},

	multipleURL: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const { t } = useI18n();

const data = reactive({
	designation: "",
	url: undefined as undefined | string,
	image: undefined as File | undefined,
	color: 3,
	memberList: [] as { email: string; role_id: number }[],
	urlList: [] as string[],

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
	data.urlList = [];
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
		company_id: props.company?.id,
		urlList: data.urlList,
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

const loading = ref(false);

const rules: FormRules = reactive({
	designation: {
		required: true,
		min: 1,
		renderMessage: () => t("rules.designation_required"),
	},
});
</script>
