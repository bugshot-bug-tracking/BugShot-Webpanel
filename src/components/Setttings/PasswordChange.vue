<template>
	<div class="bs-container">
		<div class="bs-input2">
			<label>{{ t("current_password") }}</label>

			<input
				type="password"
				placeholder="**********"
				disabled
				class="!pr-44"
			/>

			<a class="input-image" cursor-pointer>
				<img
					src="src/assets/icons/edit.svg"
					alt="edit"
					class="black-to-purple"
				/>
				<b>{{ t("change_password") }}</b>
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const { t } = useI18n();

const store = useAuthStore();

const user = computed(() => store.getUser);
</script>

<style lang="scss" scoped></style>
