<template>
	<div class="bs-container">
		<span flex justify-between>
			<p font-bold style="font-size: 1.125rem">
				{{ t("show_ui_elements") }}
			</p>

			<p class="black-to-gray">All elements</p>
		</span>

		<hr mb4 />

		<span flex justify-between>
			<p font-bold style="font-size: 1.125rem">{{ t("notify_me_on") }}</p>

			<p class="black-to-gray">New bugs only</p>
		</span>

		<RouterLink
			:to="{ name: 'settings-advanced' }"
			self-end
			mt4
			capitalize
			font-bold
		>
			<img
				src="src/assets/icons/edit.svg"
				alt="edit"
				class="black-to-purple"
			/>

			{{ t("edit.settings") }}
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

	p {
		margin: unset;
	}
}
</style>
