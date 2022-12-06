<template>
	<div class="bs-container" flex flex-col gap-4>
		<div class="bs-input">
			<label>
				{{ t("first_name") }}
			</label>

			<input
				type="text"
				:placeholder="t('first_name')"
				disabled
				v-model="user.attributes.first_name"
			/>
		</div>

		<div class="bs-input">
			<label>
				{{ t("last_name") }}
			</label>

			<input
				type="text"
				:placeholder="t('last_name')"
				disabled
				v-model="user.attributes.last_name"
			/>
		</div>

		<div class="bs-input">
			<label>
				{{ t("email") }}
			</label>

			<input
				type="email"
				:placeholder="t('email')"
				disabled
				class="!pr-12"
				v-model="user.attributes.email"
			/>

			<a class="input-image">
				<img src="/src/assets/icons/mail.svg" alt="mail" />
			</a>
		</div>

		<div class="bs-input" v-if="user.attributes.phone">
			<label>
				{{ t("telephone_number") }}
			</label>

			<input
				type="text"
				placeholder="xxxx xxxx xxxx"
				disabled
				class="!pr-12"
				v-model="user.attributes.phone"
			/>

			<a class="input-image">
				<img src="/src/assets/icons/phone.svg" alt="tel" />
			</a>
		</div>

		<UserSettingsModal self-end mt4 />
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const { t } = useI18n();

const store = useAuthStore();

const user = computed(() => store.getUser);
</script>

<style lang="scss" scoped></style>
