<template>
	<div class="bs-container">
		<div v-if="token">
			<n-form-item :label="t('project_page.settings.guest_token')">
				<n-input type="text" size="large" :placeholder="t('token')" :value="token" disabled>
					<template #suffix>
						<Icon-Clipboard-Copy
							@click="copyToClipboard"
							color="var(--bs-black)"
							v-if="copyIconState === 'copy'"
							:title="t('copy')"
						/>
						<Icon-Clipboard-Success
							color="var(--bs-green-dark)"
							v-else-if="copyIconState === 'success'"
						/>
						<Icon-Clipboard-Error
							color="var(--bs-red)"
							v-else-if="copyIconState === 'error'"
						/>
					</template>
				</n-input>
			</n-form-item>

			<n-button type="error" round mx-a @click.prevent="generateToken" :loading="loading">
				{{ t("project_page.settings.regenerate_token") }}
			</n-button>
		</div>

		<div v-else class="generate-state">
			<n-button type="success" round mx-a @click.prevent="generateToken" :loading="loading">
				{{ t("project_page.settings.generate_token") }}
			</n-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useDiscreteApi } from "~/composables/DiscreteApi";
import { useProjectStore } from "~/stores/project";

const { t } = useI18n();
const { message } = useDiscreteApi();

const store = useProjectStore();

const token = computed(() => store.getProject?.attributes.access_token);

const loading = ref(false);
const generateToken = async () => {
	try {
		loading.value = true;
		await store.generateToken();
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
};

const copyIconState = ref<"copy" | "success" | "error">("copy");
const copyToClipboard = () => {
	if (token.value)
		try {
			navigator.clipboard.writeText(token.value);
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
