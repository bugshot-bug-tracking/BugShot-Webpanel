<template>
	<div @click="modal.open" self-end>
		<slot name="button" v-bind="{ loading: modal.loading }">
			<a class="bs-btn purple" :class="{ loading: modal.loading }">
				<div flex items-center gap-2>
					<img
						src="/src/assets/icons/people.svg"
						alt="peoples"
						class="black-to-white"
						w-5
						h-5
					/>
					{{ $t("edit.project") }}
				</div>
			</a>
		</slot>
	</div>

	<MyModal :modelValue="modal.show" :close="modal.close" z-100>
		<ModalTemplate @close="modal.close">
			<template #header-text>{{ $t("edit.project") }}</template>

			<form class="default-form" @submit.prevent="onSubmit">
				<div class="bs-input my-3">
					<label>
						<b>{{ $t("project_name") }}</b>
					</label>

					<input
						v-model="projectParams.name"
						:placeholder="$t('enter_project_name')"
						:type="'text'"
						required
					/>
				</div>

				<div class="my-4">
					<label> <b>URL</b> </label>

					<UrlInput
						v-model="projectParams.url"
						:placeholder="t('enter_main_project_url')"
						@click:suffix="projectParams.new_urls.push('')"
						mt-2
					/>

					<div
						v-if="
							projectParams.extra_urls.length > 0 || projectParams.new_urls.length > 0
						"
						flex
						flex-col
						gap-4
						mt-4
					>
						<UrlInput
							v-for="(item, index) in projectParams.extra_urls"
							:placeholder="t('other_project_url_optional')"
							v-model="item.attributes.url"
							@update:modelValue="editExtraUrl(item)"
							@click:suffix="deleteExtraUrl(item, index)"
						>
							<template #suffix>
								<img
									src="/src/assets/icons/remove.svg"
									alt=""
									class="black-to-purple-middle"
								/>
							</template>
						</UrlInput>

						<UrlInput
							v-for="(, index) in projectParams.new_urls"
							:placeholder="t('other_project_url_optional')"
							v-model="projectParams.new_urls[index]"
							@click:suffix="projectParams.new_urls.splice(index, 1)"
						>
							<template #suffix>
								<img
									src="/src/assets/icons/remove.svg"
									alt=""
									class="black-to-purple-middle"
								/>
							</template>
						</UrlInput>
					</div>
				</div>

				<Picker
					class="my-2"
					:colorPicked="projectParams.color"
					@setImage="projectParams.setImage"
					@setColor="projectParams.setColor"
					:image="projectParams.image"
				/>

				<button class="bs-btn green mt-3 m-a">
					{{ $t("save_changes") }}
				</button>
			</form>
		</ModalTemplate>
	</MyModal>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="
			loadingModal.clear();
			modal.close();
		"
	/>
</template>

<script setup lang="ts">
import toBase64 from "~/util/toBase64";
import colors from "~/util/colors";
import { Url } from "~/models/Url";

const props = defineProps({
	name: {
		required: true,
		type: String,
	},
	color: {
		required: true,
		type: String,
	},
	image: {
		required: false,
		type: String,
		default: "",
	},
	url: {
		required: true,
		type: String,
	},
	extra_urls: {
		required: false,
		type: Array as PropType<Url[]>,
	},

	submit: {
		type: Function,
		required: true,
	},

	preOpenCall: {
		type: Function,
		required: false,
	},

	postOpenCall: {
		type: Function,
		required: false,
	},
});

const { t } = useI18n();

const modal = reactive({
	show: false,
	loading: false,
	open: async () => {
		if (modal.loading === true) return;
		modal.loading = true;
		if (props.preOpenCall) await props.preOpenCall();
		modal.show = true;
		modal.loading = false;
		projectParams.set();
		extra_urls_modified.value = undefined;
	},
	close: async () => {
		if (modal.loading === true) return;
		modal.loading = true;
		if (props.postOpenCall) await props.postOpenCall();
		modal.show = false;
		modal.loading = false;
	},
});

const projectParams = reactive({
	name: "",
	color: 3,
	image: "",
	url: "",
	extra_urls: [] as Url[],
	new_urls: [] as string[],

	set: () => {
		projectParams.name = props.name ?? "";
		projectParams.color = colors.indexOf(props.color) ?? 3;
		projectParams.image = props.image !== "" ? props.image : "";
		projectParams.url = props.url ?? "";
		projectParams.extra_urls = props.extra_urls
			? JSON.parse(JSON.stringify(props.extra_urls))
			: [];
		projectParams.new_urls = [];
	},

	setImage: async (value: File | null) => {
		// console.log("setImage", value);
		if (value != null) projectParams.image = (await toBase64(value)) as string;
		else projectParams.image = "";
	},

	setColor: (value: number) => {
		// console.log("setColor", value);
		projectParams.color = value;
	},
});

watch(props, () => {
	projectParams.set();
});

const onSubmit = async () => {
	try {
		loadingModal.show = true;

		await props.submit(
			{
				designation: projectParams.name,
				url: projectParams.url,
				color_hex: colors[projectParams.color],
				base64: projectParams.image ? btoa(projectParams.image) : null,
			},
			projectParams.new_urls,
			extra_urls_modified.value
		);

		loadingModal.state = 1;
		loadingModal.message = t("project_edited_succ");
	} catch (error: any) {
		console.log(error);

		loadingModal.state = 2;
		loadingModal.message = error.response.data.data?.message.replace(":", "");
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

const extra_urls_modified = ref<{ edited: Url[]; deleted: Url[] } | undefined>(undefined);

const editExtraUrl = (item: Url) => {
	if (extra_urls_modified.value === undefined)
		extra_urls_modified.value = { edited: [], deleted: [] };
	extra_urls_modified.value.edited.push(item);
};

const deleteExtraUrl = (item: Url, index: number) => {
	if (extra_urls_modified.value === undefined)
		extra_urls_modified.value = { edited: [], deleted: [] };
	extra_urls_modified.value.deleted.push(item);

	projectParams.extra_urls.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.wrapper {
	width: 20vw;
	min-width: 31rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 3rem;
	gap: 0.5rem;
}

.header {
	width: 95%;
	padding: 0.5rem;
	font-size: 1.25rem;
	border-bottom: 1px solid #eee5fc;
	margin-top: -1.25rem;
	margin-bottom: 1.25rem;
	font-weight: bold;
}

.label {
	font-size: 1rem;
	font-weight: bold;
	padding: 0 0.5rem;
	margin-bottom: -0.5rem;
	text-align: left;
}
</style>
