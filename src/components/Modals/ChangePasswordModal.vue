<template>
	<a class="input-image" cursor-pointer @click="modal.open">
		<img
			src="src/assets/icons/edit.svg"
			alt="edit"
			class="black-to-purple"
		/>
		<b>{{ t("change_password") }}</b>
	</a>

	<MyModal v-model="modal.show" :close="modal.close">
		<ModalTemplate @close="modal.close">
			<template #header-text> {{ t("change_password") }} </template>

			<form
				@submit.prevent="submit"
				@reset.prevent="cancel"
				class="bs-form"
			>
				<p>{{ t("password_change_on") }} {{ user.attributes.email }}</p>
				<div class="form-group">
					<div class="bs-input2">
						<label flex justify-between>
							{{ t("current_password") }}
						</label>

						<input
							v-model="currentPassword.value"
							:placeholder="t('current_password')"
							:type="currentPassword.show ? 'text' : 'password'"
							autocomplete="password"
							required
							minlength="8"
							maxlength="255"
							class="!pr-12"
							:class="{ error: currentPassword.error }"
							@focus.prevent="currentPassword.clear"
						/>

						<img
							v-show="currentPassword.show"
							src="/src/assets/icons/password_view.svg"
							alt="hide"
							class="input-image"
							cursor-pointer
							@click="currentPassword.toggle"
						/>

						<img
							v-show="!currentPassword.show"
							src="/src/assets/icons/password_hide.svg"
							alt="show"
							class="input-image"
							cursor-pointer
							@click="currentPassword.toggle"
						/>
					</div>

					<span text-red text-end v-if="currentPassword.error">
						{{ currentPassword.errorMessage }}
					</span>
				</div>

				<div class="form-group" gap-0>
					<h5>{{ t("chose_new_password") }}</h5>

					<div class="bs-input2">
						<label> {{ t("new_password") }} </label>

						<input
							v-model="newPassword.value"
							:placeholder="t('new_password')"
							:type="newPassword.show ? 'text' : 'password'"
							autocomplete="new-password"
							required
							minlength="8"
							maxlength="255"
							class="!pr-12"
							:class="{ error: newPassword.error }"
							@focus.prevent="
								(newPassword.showValidate = true),
									(newPassword.error = false)
							"
							@blur.prevent="newPassword.showValidate = false"
						/>

						<img
							v-show="newPassword.show"
							src="/src/assets/icons/password_view.svg"
							alt="hide"
							class="input-image"
							cursor-pointer
							@click="newPassword.toggle"
						/>

						<img
							v-show="!newPassword.show"
							src="/src/assets/icons/password_hide.svg"
							alt="show"
							class="input-image"
							cursor-pointer
							@click="newPassword.toggle"
						/>
					</div>

					<div class="password-rules">
						<ul
							:class="{
								...newPassword.validate,
								open: newPassword.showValidate,
							}"
						>
							<li class="min-chars">
								{{ t("limits.min_chars", { x: 8 }) }}
							</li>

							<li class="letters">
								{{ t("limits.letters") }}
							</li>

							<li class="numbers">
								{{ t("limits.numbers") }}
							</li>
						</ul>
					</div>

					<div class="bs-input2">
						<label> {{ t("confirm_password") }} </label>

						<input
							v-model="newPassword.confirm"
							:placeholder="t('confirm_password')"
							:type="newPassword.show ? 'text' : 'password'"
							autocomplete="new-password"
							required
							minlength="8"
							maxlength="255"
							class="!pr-12"
							:class="{ error: newPassword.confirmError }"
							@focus.prevent="
								(newPassword.showConfirmValidate = true),
									(newPassword.confirmError = false)
							"
							@blur.prevent="
								newPassword.showConfirmValidate = false
							"
						/>

						<img
							v-show="newPassword.show"
							src="/src/assets/icons/password_view.svg"
							alt="hide"
							class="input-image"
							cursor-pointer
							@click="newPassword.toggle"
						/>

						<img
							v-show="!newPassword.show"
							src="/src/assets/icons/password_hide.svg"
							alt="show"
							class="input-image"
							cursor-pointer
							@click="newPassword.toggle"
						/>
					</div>

					<div class="password-rules">
						<ul
							:class="{
								...newPassword.confirmValidate,
								open: newPassword.showConfirmValidate,
							}"
						>
							<li class="same">
								{{ t("limits.passwords_match") }}
							</li>

							<li class="min-chars">
								{{ t("limits.min_chars", { x: 8 }) }}
							</li>

							<li class="letters">
								{{ t("limits.letters") }}
							</li>

							<li class="numbers">
								{{ t("limits.numbers") }}
							</li>
						</ul>
					</div>
				</div>

				<div class="form-buttons">
					<button class="bs-btn green" type="submit">
						{{ t("save") }}
					</button>

					<button class="bs-btn green empty" type="reset">
						{{ t("cancel") }}
					</button>
				</div>
			</form>
		</ModalTemplate>
	</MyModal>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
	/>
</template>

<script setup lang="ts">
import axios from "axios";
import { useAuthStore } from "~/stores/auth";

const store = useAuthStore();

const user = computed(() => store.getUser);

const { t } = useI18n();

const modal = reactive({
	show: false,
	open: () => {
		modal.show = true;
	},
	close: () => {
		modal.show = false;
	},
});

const currentPassword = reactive({
	value: "",
	show: false,
	error: false,
	errorMessage: "",
	toggle: () => {
		currentPassword.show = !currentPassword.show;
	},
	clear: () => {
		currentPassword.error = false;
		currentPassword.errorMessage = "";
	},
});

const newPassword = reactive({
	value: "",
	confirm: "",
	show: false,
	error: false,
	confirmError: false,
	toggle: () => {
		newPassword.show = !newPassword.show;
	},
	showValidate: false,
	showConfirmValidate: false,
	validate: computed(
		(): { "min-chars": boolean; letters: boolean; numbers: boolean } => {
			return {
				"min-chars": newPassword.value.length >= 8,
				letters: !!newPassword.value.match(/[a-zA-Z]/g),
				numbers: !!newPassword.value.match(/[0-9]/g),
			};
		}
	),
	confirmValidate: computed(
		(): {
			"min-chars": boolean;
			letters: boolean;
			numbers: boolean;
			same: boolean;
		} => {
			return {
				"min-chars": newPassword.confirm.length >= 8,
				letters: !!newPassword.confirm.match(/[a-zA-Z]/g),
				numbers: !!newPassword.confirm.match(/[0-9]/g),
				same: newPassword.confirm === newPassword.value,
			};
		}
	),
});

const submit = async () => {
	for (const rule of Object.entries(newPassword.validate))
		if (!rule[1])
			return (
				(newPassword.error = true), (newPassword.showValidate = true)
			);

	for (const rule of Object.entries(newPassword.confirmValidate))
		if (!rule[1])
			return (
				(newPassword.confirmError = true),
				(newPassword.showConfirmValidate = true)
			);

	try {
		loadingModal.show = true;

		await axios.put(`/users/${user.value.id}`, {
			first_name: user.value.attributes.first_name,
			last_name: user.value.attributes.last_name,
			email: user.value.attributes.email,

			old_password: currentPassword.value,

			password: newPassword.value,
			password_confirmation: newPassword.confirm,
		});

		loadingModal.state = 1;
		loadingModal.message = t("password_changed");
	} catch (error: any) {
		// console.log(error);

		let data = error.response.data;

		loadingModal.state = 2;
		loadingModal.message = data.message;

		if (data.errors["old_password"]) {
			currentPassword.error = true;
			currentPassword.errorMessage = data.errors["old_password"][0];
		}
	} finally {
		setTimeout(() => {
			if (loadingModal.state === 1) modal.close();
			loadingModal.clear();
		}, 2500);
	}

	return;
};

const cancel = () => {
	currentPassword.value = "";
	newPassword.value = "";
	newPassword.confirm = "";
	modal.close();
};

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
</script>

<style scoped lang="scss"></style>
