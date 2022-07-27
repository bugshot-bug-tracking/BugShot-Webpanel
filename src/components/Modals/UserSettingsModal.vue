<template>
	<a class="input-image" cursor-pointer @click="modal.open" v-bind="$attrs">
		<img
			src="/src/assets/icons/edit.svg"
			alt="edit"
			class="black-to-purple"
		/>
		<b> {{ t("edit.profile") }}</b>
	</a>

	<MyModal
		v-model="modal.show"
		:close="modal.close"
		@before-enter="userData.set"
		@before-leave="userData.clear"
	>
		<ModalTemplate @close="modal.close">
			<template #header-text> {{ t("edit.profile") }} </template>

			<form
				@submit.prevent="submit"
				@reset.prevent="cancel"
				class="bs-form"
			>
				<div class="form-group">
					<div class="bs-input2">
						<label>
							{{ t("first_name") }}
						</label>

						<input
							type="text"
							:placeholder="t('first_name')"
							v-model="userData.first_name"
							autocomplete="given-name"
							minlength="1"
							maxlength="255"
						/>
					</div>

					<div class="bs-input2">
						<label>
							{{ t("last_name") }}
						</label>

						<input
							type="text"
							:placeholder="t('last_name')"
							v-model="userData.last_name"
							autocomplete="family-name"
							minlength="1"
							maxlength="255"
						/>
					</div>

					<div class="bs-input2">
						<label>
							{{ t("email") }}
						</label>

						<input
							type="email"
							:placeholder="t('email')"
							class="!pr-12"
							v-model="userData.email"
							autocomplete="email"
							minlength="1"
							maxlength="255"
						/>

						<a class="input-image">
							<img src="/src/assets/icons/mail.svg" alt="mail" />
						</a>
					</div>

					<div class="bs-input2" v-if="userData.phone != ''">
						<label>
							{{ t("telephone_number") }}
						</label>

						<input
							type="text"
							placeholder="xxxx xxxx xxxx"
							disabled
							class="!pr-12"
							v-model="userData.phone"
						/>

						<a class="input-image">
							<img src="/src/assets/icons/phone.svg" alt="tel" />
						</a>
					</div>
				</div>

				<hr mt-2 />

				<div class="form-group">
					<div class="bs-input2">
						<label flex justify-between>
							{{ t("please_confirm_password") }}
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

<script lang="ts">
// use normal <script> to declare options
export default {
	inheritAttrs: false,
};
</script>

<script setup lang="ts">
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

const userData = reactive({
	first_name: "",
	last_name: "",
	email: "",
	phone: "",
	set: () => {
		userData.first_name = user.value.attributes.first_name;
		userData.last_name = user.value.attributes.last_name;
		userData.email = user.value.attributes.email;
		userData.phone = user.value.attributes.phone ?? "";
	},
	clear: () => {
		userData.first_name = "";
		userData.last_name = "";
		userData.email = "";
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

const submit = async () => {
	try {
		loadingModal.show = true;

		await store.updateUser({
			...userData,
			password: currentPassword.value,
		});

		loadingModal.state = 1;
		loadingModal.message = t("user_updated");
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
};

const cancel = () => {
	currentPassword.value = "";
	userData.clear();
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
