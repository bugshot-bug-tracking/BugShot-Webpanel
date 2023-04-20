<template>
	<section>
		<header v-if="false">
			<n-steps v-model:current="steps.current" :status="steps.status">
				<n-step title="Feedback" />
				<n-step title="Options" />
				<n-step title="Review" />
			</n-steps>
		</header>

		<div flex flex-col items-start justify-start py-16 style="height: 100%">
			<p mb-2>
				{{ t("cancel_headers.static") }}
			</p>

			<div v-if="steps.current === 1">
				<h5 font-bold>
					{{ t("cancel_headers.feedback") }}
				</h5>

				<n-form label-placement="top">
					<n-checkbox-group v-model:value="feedback.reasons">
						<n-space vertical class="gap-4!" my-4>
							<n-checkbox value="cancel_reasons.1_project">
								{{ t("cancel_reasons.1_project") }}
							</n-checkbox>

							<n-checkbox value="cancel_reasons.technical_issues">
								{{ t("cancel_reasons.technical_issues") }}
							</n-checkbox>

							<n-checkbox value="cancel_reasons.too_complicated">
								{{ t("cancel_reasons.too_complicated") }}
							</n-checkbox>

							<n-checkbox value="cancel_reasons.too_expensive">
								{{ t("cancel_reasons.too_expensive") }}
							</n-checkbox>

							<n-checkbox value="cancel_reasons.not_working">
								{{ t("cancel_reasons.not_working") }}
							</n-checkbox>

							<n-checkbox value="cancel_reasons.other">
								{{ t("cancel_reasons.other") }}
							</n-checkbox>

							<n-form-item label="Add your comments" path="user.name">
								<n-input
									v-model:value="feedback.comment"
									type="textarea"
									placeholder=""
									:autosize="{
										minRows: 3,
										maxRows: 5,
									}"
									max-w-100
								/>
							</n-form-item>
						</n-space>
					</n-checkbox-group>
				</n-form>
			</div>

			<div v-if="steps.current === 2">
				<h5 font-bold>
					{{ t("cancel_headers.options") }}
				</h5>
				<n-space vertical class="gap-4!" my-8>
					<n-card flex-row items-center :bordered="false" hoverable class="bs-b">
						<template #header>
							<img src="/src/assets/icons/starter.svg" alt="" w-14 h-14 />
						</template>

						<h5>
							{{ t("change_subscription_text") }}
						</h5>

						<p>
							{{ t("change_subscription_subtext") }}
						</p>
						<template #footer>
							<n-button strong type="primary">
								{{ t("change_subscription") }}
							</n-button>
						</template>
					</n-card>

					<n-card flex-row items-center :bordered="false" hoverable class="bs-b">
						<template #header>
							<img src="/src/assets/icons/enterprise.svg" alt="" w-14 h-14 />
						</template>

						<h5>
							{{ t("need_help_with_bugshot_text") }}
						</h5>

						<p>
							{{ t("need_help_with_bugshot_subtext") }}
						</p>

						<template #footer>
							<RouterLink
								:to="{
									name: 'organization-payments-subscription-cancel',
									params: { subscription_id },
								}"
							>
								<n-button strong type="success">
									{{ t("need_help_with_bugshot") }}
								</n-button>
							</RouterLink>
						</template>
					</n-card>
				</n-space>
			</div>

			<div v-if="steps.current === 3">
				<h5 font-bold>
					{{ t("cancel_headers.review") }}
				</h5>

				<br />

				<div style="font-size: 1.125rem; color: var(--bs-red)">
					<i18n-t tag="p" keypath="cancel_review.line_1" scope="global">
						<b>{{ $t("cancel_review.line_1_bold") }}</b>
					</i18n-t>

					<p>
						{{ t("cancel_review.line_2") }}
					</p>
				</div>
			</div>
		</div>

		<footer class="bs-bt">
			<RouterLink
				:to="{
					name: 'organization-payments-subscription-index',
					params: { subscription_id },
				}"
			>
				<n-button ghost strong type="tertiary">
					{{ t("cancel") }}
				</n-button>
			</RouterLink>

			<div flex gap-8>
				<n-button
					ghost
					strong
					type="success"
					@click="steps.prev"
					v-if="steps.current > 1 && false"
				>
					{{ t("previous_step") }}
				</n-button>

				<n-button strong type="primary" @click="steps.next" v-if="steps.current < 3">
					{{
						steps.current === 1
							? t("continue_cancelation")
							: steps.current === 2
							? t("i_want_to_cancel")
							: ""
					}}
				</n-button>

				<n-button strong type="error" v-else @click="modal.open">
					{{ t("confirm_cancelation") }}
				</n-button>
			</div>
		</footer>
	</section>

	<MyModal v-model="modal.show">
		<ModalTemplate noCloseButton>
			<div flex flex-col items-center>
				<img src="/src/assets/images/attention_message.png" h-70 />

				<h2 style="color: var(--bs-purple)">
					<b>
						{{ $t("cancel_modal.title") }}
					</b>
				</h2>

				<p max-w-88 text-center style="color: var(--bs-gray)">
					{{ $t("cancel_modal.sub_title") }}
				</p>

				<div mt-8 flex flex-col items-center gap-4>
					<p>{{ $t("cancel_modal.sub_sub_title") }}</p>

					<div flex justify-around w-60>
						<n-button strong type="success" ghost round @click="cancelSubscription">
							{{ $t("yes").toUpperCase() }}
						</n-button>
						<n-button strong type="success" round @click="modal.close">
							{{ $t("no").toUpperCase() }}
						</n-button>
					</div>
				</div>
			</div>
		</ModalTemplate>
	</MyModal>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.clear"
		@onSuccess="
			modal.close();
			redirect();
		"
	>
		<template #success-img>
			<img src="/src/assets/animations/deleted_items.gif" alt="Success" h-32 />
		</template>
	</LoadingModal2>
</template>

<script setup lang="ts">
import { StepsProps } from "naive-ui";
import { useOrganizationStore } from "~/stores/organization";

const props = defineProps({
	id: String,
	subscription_id: String,
});

const { t } = useI18n();

const router = useRouter();

const steps = reactive({
	current: 3 as number,
	status: "process" as StepsProps["status"],
	next: () => {
		if (steps.current < 3) steps.current++;
	},
	prev: () => {
		if (steps.current > 1) steps.current--;
	},
});

const feedback = reactive({
	reasons: [],
	comment: "",
});

const cancelSubscription = async () => {
	try {
		loadingModal.show = true;
		loadingModal.state = 0;

		let response = await useOrganizationStore().cancelSubscription(props.subscription_id);
		console.log(response);

		loadingModal.state = 1;
		loadingModal.message = t("subscription_canceled");
	} catch (error) {
		console.log(error);

		loadingModal.state = 2;
	}
};

const modal = reactive({
	show: false,
	open: () => {
		modal.show = true;
	},
	close: () => {
		modal.show = false;
	},
});

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

const redirect = () => {
	router.replace({
		name: "organization-payments-subscription-index",
		params: { id: props.id, subscription_id: props.subscription_id },
	});
};
</script>

<style scoped lang="scss">
section {
	padding: 2rem 4rem;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	text-align: left;
}

footer {
	padding: 2rem;
	display: flex;
	justify-content: space-between;
}

h5 {
	font-weight: bold;
}

:deep(.n-card) {
	padding: 2rem;
	border-radius: 0.5rem;

	.n-card__content,
	.n-card__footer {
		padding-bottom: 0;
	}
}
</style>

<route lang="yaml">
name: organization-payments-subscription-cancel
</route>
