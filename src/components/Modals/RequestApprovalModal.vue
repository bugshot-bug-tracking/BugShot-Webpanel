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

				<n-scrollbar trigger="none" pr-4 max-h-80>
					<n-checkbox-group v-model:value="userList" :disabled="loading" :max="1">
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
				</n-scrollbar>

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
					:disabled="loading || disableSubmit"
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
import { useDiscreteApi } from "~/composables/DiscreteApi";
import { User } from "~/models/User";

const props = defineProps({
	list: {
		type: Array as PropType<User[]>,
		required: false,
		default: undefined,
	},

	submit: {
		type: Function,
		required: false,
		default: undefined,
	},
});

const { t } = useI18n();

const { message } = useDiscreteApi();

const modal = reactive({
	show: false,
	loading: false,
	open: async () => {
		modal.show = true;
		modal.loading = false;

		recipientsList.value = [];

		props.list?.forEach((u) =>
			recipientsList.value.push({
				name: `${u.attributes.first_name} ${u.attributes.last_name}`,
				email: u.attributes.email,
			})
		);
	},
	close: async () => {
		modal.show = false;
		modal.loading = false;
	},
});

const onSubmit = async () => {
	try {
		loading.value = true;

		let users = recipientsList.value.filter((u) => userList.value.some((e) => e === u.email));

		if (props.submit != undefined) await props.submit(users);

		message.success(t("approval_form_sent"));
		modal.close();
	} catch (error: any) {
		console.log(error);
	} finally {
		loading.value = false;
	}
};
const recipientsList = ref<{ name: string; email: string }[]>([]);

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

const disableSubmit = computed(() => {
	if (userList.value.length < 1) return true;
	return false;
});

const userList = ref<string[]>([]);
</script>
