<template>
	<div class="bs-container">
		<div v-if="token">
			<n-form-item :label="token.attributes.description">
				<n-input
					type="text"
					size="large"
					:placeholder="t('token')"
					:value="token.attributes.access_token"
					readonly
				>
					<template #suffix>
						<Icon-Clipboard-Copy
							@click="copyToClipboard"
							color="var(--bs-black)"
							v-if="copyIconState === 'copy'"
							:title="t('copy')"
							cursor-copy
						/>
						<Icon-Clipboard-Success
							color="var(--bs-green-dark)"
							v-else-if="copyIconState === 'success'"
							:title="t('success')"
							cursor-default
						/>
						<Icon-Clipboard-Error
							color="var(--bs-red)"
							v-else-if="copyIconState === 'error'"
							:title="t('error')"
							cursor-default
						/>
					</template>
				</n-input>
			</n-form-item>
		</div>

		<n-button type="success" round mx-a @click="modal = true" my-a>
			{{ t("project_page.settings.manage_tokens") }}
		</n-button>
	</div>

	<GuestTokenModal
		v-model:show="modal"
		:list="store.accessTokens"
		:onAdd="store.generateToken"
		:onChange="store.updateToken"
		:onDelete="store.deleteToken"
	/>
</template>

<script setup lang="ts">
import { useDiscreteApi } from "~/composables/DiscreteApi";
import { useProjectStore } from "~/stores/project";

const { t } = useI18n();
const { message } = useDiscreteApi();

const store = useProjectStore();

const token = computed(() => {
	const list = store.accessTokens;
	if (list === undefined || list.length < 1) return undefined;

	return list[0];
});

const copyIconState = ref<"copy" | "success" | "error">("copy");
const copyToClipboard = () => {
	if (token.value)
		try {
			navigator.clipboard.writeText(token.value.attributes.access_token);
			console.log("Text is copied!");
			message.success(t("messages.text_to_clipboard"));

			copyIconState.value = "success";
		} catch (error) {
			console.error("Could not copy text: ", error);
			message.success(t("messages.text_to_clipboard_error"));

			copyIconState.value = "error";
		} finally {
			setTimeout(() => {
				copyIconState.value = "copy";
			}, 1500);
		}
};

const modal = ref(false);
</script>

<style lang="scss" scoped>
.page-loading {
	display: flex;
	width: 100%;
	height: 100%;
	margin: auto;

	img {
		margin: auto;
		width: 5rem;
	}
}

.bs-container {
	min-width: 20rem;
	min-height: 10rem;
}

.generate-state {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	margin: auto;
}
</style>
