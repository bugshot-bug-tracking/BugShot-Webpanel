<template>
	<T2Page>
		<template #header>
			<T2Header v-if="record">
				<template #l-top>
					{{ $t("general_settings") }}
				</template>

				<template #l-bottom>
					{{ record?.attributes.designation }}
				</template>
			</T2Header>
		</template>

		<div class="settings-table" v-if="record">
			<Column class="general">
				<div class="body">
					<Container>
						<form
							class="wrapper default-form"
							@submit.prevent="saveChanges"
						>
							<div class="bs-input my-3">
								<input
									v-model="companyParams.name"
									:placeholder="record.attributes.designation"
									:type="'text'"
								/>
							</div>

							<!-- change color Picked to the record color -->
							<Picker
								:colorPicked="companyParams.color"
								@setImage="setImage"
								@setColor="setColor"
								:image="companyParams.image"
								v-if="imageFlag"
							/>

							<button class="bs-btn green mt-3">
								{{ $t("save_changes") }}
							</button>
						</form>
					</Container>

					<div v-if="!canEdit" class="disabled-overlay" />
				</div>

				<div class="d-flex flex-column" v-if="canDelete">
					<a class="text-danger" @click.prevent="showDelete = true">
						{{ $t("delete_company_and_projects") }}
					</a>

					{{ "(" + $t("cant_be_reverted") + ")" }}
				</div>
			</Column>

			<Column class="members">
				<template v-slot:header>
					<div class="bold">{{ $t("team_members") }}</div>
				</template>

				<div class="body">
					<TeamTable :company_id="id" />

					<div v-if="!canEdit" class="disabled-overlay" />
				</div>
			</Column>

			<Column class="plan" v-if="false">
				<template v-slot:header>
					<div class="bold">Plan Details</div>
				</template>

				<div class="body"></div>
			</Column>
		</div>
	</T2Page>

	<DeleteModal
		v-if="showDelete"
		:text="record.attributes.designation"
		@delete="deleteCompany"
		@close="showDelete = false"
	/>

	<LoadingModal
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.show = false"
	/>
</template>

<script setup>
import { useMainStore } from "~/stores/main";

import axios from "axios";

import { useI18n } from "vue-i18n";
import toBase64 from "~/util/toBase64";
import colors from "~/util/colors";
import { useAuthStore } from "~/stores/auth";

const props = defineProps({
	id: {
		required: true,
		type: String,
		description: "Company ID",
	},
});

const store = useMainStore();

const companyParams = reactive({
	name: "",
	color: 0,
	image: null,
});
const imageFlag = ref(false);

const user = computed(() => {
	return useAuthStore().getUser;
});

const canEdit = computed(() => {
	if (!user.value || !record.value || !record.value.attributes.creator)
		return false;

	return user.value.id === record.value.attributes.creator.id;
});

const canDelete = computed(() => {
	if (!user.value || !record.value || !record.value.attributes.creator)
		return false;

	return user.value.id === record.value.attributes.creator.id;
});

const record = computed(() => {
	let company = store.getCompanyById(props.id);
	imageFlag.value = false;

	if (company) {
		companyParams.name = company.attributes.designation;

		companyParams.color = company.attributes.color_hex
			? colors.findIndex((x) => x === company.attributes.color_hex)
			: 3;

		try {
			axios.get(`companies/${company.id}/image`).then((response) => {
				if (response.data.data.attributes)
					companyParams.image = atob(
						response.data.data.attributes.base64
					);
				else {
					companyParams.image = null;
				}
				imageFlag.value = true;
			});
		} catch (error) {
			console.log(error);
		}
	}

	return company;
});

const setImage = async (value) => {
	// console.log("setImage", value);
	if (value != null) companyParams.image = await toBase64(value);
	else companyParams.image = null;
};

const setColor = (value) => {
	// console.log("setImage", value);
	companyParams.color = value;
};

const { t } = useI18n({ useScope: "global" });

const saveChanges = async () => {
	let data = {
		id: props.id,
		designation: companyParams.name,
		color_hex: colors[companyParams.color],
		base64: companyParams.image ? btoa(companyParams.image) : null,
	};

	try {
		loadingModal.show = true;
		loadingModal.state = 0;
		loadingModal.message = null;

		await store.updateCompany(data);

		loadingModal.state = 1;
		loadingModal.message = t("company_edit_success");

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
			loadingModal.message = null;
		}, 4000);
	} catch (error) {
		console.log(error);
		loadingModal.state = 2;

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
		}, 4000);
	}
};

const deleteCompany = async () => {
	if (!canDelete.value) return;

	try {
		showDelete.value = false;
		loadingModal.show = true;
		loadingModal.state = 0;
		loadingModal.message = null;

		await store.deleteCompany(record.value.id);

		loadingModal.state = 1;
		loadingModal.message = t("company_delete_success");

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
			loadingModal.message = null;
		}, 4000);
	} catch (error) {
		loadingModal.state = 2;

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
		}, 4000);
	}
};

const showDelete = ref(false);
const loadingModal = reactive({
	show: false,
	state: 0,
	message: null,
});
</script>

<style lang="scss" scoped>
.settings-table {
	width: 100%;
	height: 100%;
	display: flex;
	position: relative;
	padding: 2rem;

	.general {
		width: 31rem;
		min-width: 31rem;

		.body {
			position: relative;
		}
	}

	.members {
		max-width: 40%;

		.body {
			position: relative;
		}
	}

	.plan {
		width: 31rem;
		min-width: 31rem;
	}

	.column {
		display: flex;
		position: relative;
		flex-direction: column;
		height: 100%;
		padding: 1rem;
		width: 100%;
		border-right: 1px solid #ede4fc;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
}

.bold {
	font-weight: bold;
}

.text-danger {
	cursor: pointer;

	&:hover {
		font-weight: bold;
	}
}
</style>

<route lang="yaml">
name: company-settings
</route>
