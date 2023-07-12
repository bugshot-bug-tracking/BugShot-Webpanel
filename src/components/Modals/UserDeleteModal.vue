<template>
	<div @click="modal.open" v-bind="$attrs">
		<n-button text round strong type="error">
			<template #icon>
				<Icon-Bin color="var(--bs-red)" />
			</template>

			{{ t("delete.account") }}
		</n-button>
	</div>

	<MyModal v-model="modal.show" :close="modal.close" z-100>
		<ModalTemplate @close="modal.close">
			<template #header-text>
				{{ t("delete.account") }}
			</template>

			<div max-w-66ch flex flex-col gap-4 items-center text-center>
				<n-text type="error" strong>
					{{ t("user_delete_modal.line_1") }}
				</n-text>

				<n-text>
					{{ t("user_delete_modal.line_2") }}
				</n-text>

				<n-text>
					{{ t("user_delete_modal.line_3") }}
				</n-text>

				<n-text>
					<i18n-t keypath="user_delete_modal.line_4" scope="global">
						<n-button
							type="primary"
							text
							tag="a"
							href="mailto:tech@bugshot.de"
							style="user-select: auto"
						>
							hello@bugshot.de
						</n-button>
					</i18n-t>
				</n-text>
			</div>

			<div flex flex-1 items-center justify-evenly mt-8>
				<n-button
					type="success"
					ghost
					round
					size="large"
					:disabled="loading"
					@click="modal.close"
				>
					{{ t("cancel") }}
				</n-button>

				<n-button
					type="error"
					round
					size="large"
					@click="submit"
					:disabled="!enable_action_ref || loading"
					:loading="loading"
					class="confirm_button"
				>
					<template #icon>
						<n-countdown
							:duration="countdown"
							@finish="enable_action"
							:render="renderCountdown"
							v-if="enable_action_ref === false"
						/>
					</template>
					{{ t("confirm") }}
				</n-button>
			</div>
		</ModalTemplate>
	</MyModal>
</template>

<script setup lang="ts">
import { CountdownProps, NProgress, ProgressProps } from "naive-ui";
import { useDiscreteApi } from "~/composables/DiscreteApi";
import { useAuthStore } from "~/stores/auth";

const store = useAuthStore();

const { t } = useI18n();

const modal = reactive({
	show: false,
	open: () => {
		modal.show = true;
		enable_action_ref.value = false;
		countdown.value = 10000;
	},
	close: () => {
		modal.show = false;
	},
});

const enable_action_ref = ref(false);

const enable_action = () => {
	enable_action_ref.value = true;
};

const loading = ref(false);

const submit = async () => {
	try {
		loading.value = true;
		await store.deleteUser();

		const { message } = useDiscreteApi();
		message.success(t("messages.account_deleted_successfully"));
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
};

const countdown = ref(10000);

const renderCountdown: CountdownProps["render"] = ({ seconds }) => [
	h(
		NProgress,
		{
			type: "circle",
			percentage: 100 - seconds * 10,
			offsetDegree: 180,
		} as ProgressProps,
		() => h("span", { style: { "font-size": "0.875rem" } }, [String(seconds).padStart(2, "0")])
	),
];
</script>

<style scoped lang="scss">
.confirm_button {
	--n-icon-size: 1.625rem;
}
</style>
