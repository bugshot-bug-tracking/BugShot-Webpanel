<template>
	<n-button type="success" size="large" round @click="modal.open" v-bind="$attrs">
		<template #icon>
			<Icon-Send />
		</template>

		{{ t("send_request") }}
	</n-button>

	<MyModal :modelValue="modal.show" :close="modal.close" z-100>
		<ModalTemplate @close="modal.close">
			<template #header-text>{{ $t("request_approval") }}</template>

			<div flex flex-col>
				<n-text> {{ t("select_the_form_recipients") }} </n-text>

				<n-checkbox-group :disabled="loading">
					<n-list :show-divider="false">
						<n-list-item v-for="user in recipientsList" style="padding: 0" my-4>
							<div flex items-center gap-2>
								<n-checkbox :value="user.email" />
								<b>{{ user.name }}</b>
								({{ user.email }})
							</div>
						</n-list-item>
					</n-list>
				</n-checkbox-group>

				<n-divider style="margin-top: 1rem; margin-bottom: 1rem" />

				<div flex flex-col gap-4>
					<n-text>
						{{ t("someone_not_in_list") }} <b>{{ t("someone_not_in_list2") }}</b>
					</n-text>

					<n-input
						type="text"
						:placeholder="'Name'"
						style="width: 80%"
						v-model:value="newRecipient.name"
						size="large"
						:disabled="loading"
						:status="fieldsState.name"
					/>

					<div flex items-center gap-4>
						<n-input
							type="text"
							:placeholder="'Email'"
							style="width: 80%"
							v-model:value="newRecipient.email"
							size="large"
							:disabled="loading"
							:status="fieldsState.email"
						>
							<template #suffix>
								<Icon-Email />
							</template>
						</n-input>

						<n-button
							type="success"
							ghost
							round
							@click="addNewRecipient"
							:disabled="loading"
						>
							{{ t("add.add") }}
						</n-button>
					</div>
				</div>

				<n-button
					type="success"
					round
					mx-a
					mt-4
					:disabled="loading"
					:loading="loading"
					@click="onSubmit"
				>
					{{ t("send_form") }}
				</n-button>
			</div>
		</ModalTemplate>
	</MyModal>
</template>

<script setup lang="ts">
import { FormValidationStatus } from "naive-ui/es/form/src/interface";

const { t } = useI18n();

const modal = reactive({
	show: false,
	loading: false,
	open: async () => {
		modal.show = true;
		modal.loading = false;
	},
	close: async () => {
		modal.show = false;
		modal.loading = false;
	},
});

const onSubmit = async () => {
	try {
	} catch (error: any) {
		console.log(error);
	}
};

const recipientsList = ref([
	{
		email: "r@r.ro",
		name: "R M",
	},
]);

const newRecipient = reactive({
	name: "",
	email: "",
});

const fieldsState = reactive({
	name: undefined as FormValidationStatus | undefined,
	email: undefined as FormValidationStatus | undefined,
	clear: () => {
		fieldsState.name = undefined;
		fieldsState.email = undefined;
	},
});

const addNewRecipient = () => {
	fieldsState.clear();

	if (newRecipient.name.length < 1) return (fieldsState.name = "error");
	if (newRecipient.email.length < 3) return (fieldsState.email = "error");

	recipientsList.value.push({
		name: newRecipient.name,
		email: newRecipient.email,
	});

	newRecipient.name = "";
	newRecipient.email = "";
};

const loading = ref(false);
</script>

<style scoped lang="scss"></style>
