<template>
	<div class="bs-container">
		<div flex justify-between items-center gap-4>
			<div text-left>
				<p>
					<span class="black-to-gray">{{ $t("language_for") }}</span>
					{{ $t("language_for_app_and_web") }}
				</p>

				<b>{{ $t(`location.${locale}`) }}</b>
			</div>

			<LanguageChangeModal />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18nStore } from "~/stores/i18n";

const language = useI18nStore();

const locale = computed(() => language.getLocale);
</script>

<style lang="scss" scoped></style>
