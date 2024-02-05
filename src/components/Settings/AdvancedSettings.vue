<template>
	<div class="bs-container">
		<span>
			<p font-bold>
				{{ t("user_settings.main_page.advanced.show_ui_elements") }}
			</p>

			<p class="black-to-gray text-3.5">
				{{ t("user_settings.main_page.advanced.ui_elements_options.all_elements") }}
			</p>
		</span>

		<hr mb4 />

		<span>
			<p font-bold>{{ t("user_settings.main_page.advanced.notify_on") }}</p>

			<p class="black-to-gray text-3.5">
				{{ t("user_settings.main_page.advanced.notify_option.everything") }}
			</p>
		</span>

		<RouterLink :to="{ name: 'settings-advanced' }" self-end mt-4 font-bold>
			<img src="/src/assets/icons/edit.svg" alt="edit" class="black-to-purple" />

			{{ t("user_settings.main_page.advanced.edit_settings") }}
		</RouterLink>
	</div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style lang="scss" scoped>
span {
	width: 100%;
	padding: 0.5rem 0;
	display: flex;
	justify-content: space-between;

	p {
		margin: unset;
	}
}
</style>
