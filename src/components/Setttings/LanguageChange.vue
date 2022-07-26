<template>
	<div class="bs-container">
		<div flex justify-between items-center>
			<div text-left>
				<p>
					<span class="black-to-gray">{{ t("language_for") }}</span>
					App and web extension
				</p>

				<b>Use browser language</b>
			</div>

			<a font-bold cursor-pointer>
				<img
					src="/src/assets/icons/edit.svg"
					alt="edit"
					class="black-to-purple"
					w-6
					h-6
				/>
				{{ t("change_language") }}
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18nStore } from "~/stores/i18n";
import { useSettingsStore } from "~/stores/settings";

const { t } = useI18n();

const settings = useSettingsStore();
const language = useI18nStore();
</script>

<style lang="scss" scoped></style>
