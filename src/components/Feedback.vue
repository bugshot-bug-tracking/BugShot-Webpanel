<template>
	<section class="bugshot-feedback" z-1>
		<div class="feedback-button" @click="form.toggle" :class="{ open: form.show }">
			<img src="/src/assets/icons/help.svg" alt="help" />

			<p>{{ t("feedback") }}</p>
		</div>

		<div class="feedback-form" v-if="form.show">
			<div z--1 class="full-overlay"></div>
			<form @submit.prevent="submit" @reset.prevent="cancel" class="bs-form bs-scroll">
				<div flex justify-between px-2 style="width: 100%">
					<n-h2 m-0 text-left font-bold>{{ t("feedback_form") }}</n-h2>

					<img
						src="/src/assets/icons/close_2.svg"
						alt="close"
						@click="form.close"
						cursor-pointer
					/>
				</div>

				<div class="bs-container" gap-4>
					<div class="bs-input">
						<label>
							{{ `${t("email")} (${t("optional")})` }}
						</label>

						<input
							type="email"
							:placeholder="t('email')"
							class="!pr-12"
							v-model="formData.email"
							autocomplete="email"
							minlength="1"
							maxlength="255"
						/>

						<a class="input-image">
							<img src="/src/assets/icons/mail.svg" alt="mail" />
						</a>
					</div>

					<div class="bs-input">
						<label>
							{{ t("title") }}

							<span>{{ `${formData.designation.length}/250` }}</span>
						</label>

						<input
							type="text"
							:placeholder="t('title')"
							v-model="formData.designation"
							minlength="1"
							maxlength="255"
							required
						/>
					</div>

					<div class="bs-input">
						<label>
							{{ t("description") }}
							<span>{{ `${formData.description.length}/1500` }}</span>
						</label>

						<textarea
							:placeholder="t('description')"
							v-model="formData.description"
							maxlength="1500"
						/>
					</div>
				</div>

				<AttachmentsList
					:list="formData.attachments"
					:error="attachments.error"
					@upload="attachments.upload"
					local
				>
					<template #item="{ item, index }">
						<AttachmentsItem
							:name="item.name"
							:id="index"
							@delete="attachments.delete"
							:download="false"
						/>
					</template>
				</AttachmentsList>

				<div class="form-buttons">
					<button class="bs-btn green" type="submit">
						{{ t("submit_feedback") }}
					</button>
				</div>
			</form>
		</div>
	</section>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="
			loadingModal.clear();
			form.close();
		"
	/>
</template>

<script setup lang="ts">
import axios from "axios";
import { useAuthStore } from "~/stores/auth";
import getBrowser from "~/util/getBrowser";
import getOS from "~/util/getOS";
import toBase64 from "~/util/toBase64";

const { t } = useI18n();

let user = computed(() => useAuthStore().getUser);

const formData = reactive({
	email: "",
	designation: "",
	description: "",
	attachments: [] as File[],
	clear: () => {
		formData.email = "";
		formData.designation = "";
		formData.description = "";
		formData.attachments = [];
	},
});

const attachments = reactive({
	error: "",

	upload: (files: File[]) => {
		formData.attachments = files;
	},

	delete: (index: number) => {
		formData.attachments.splice(index, 1);
	},
});

const submit = async () => {
	try {
		loadingModal.show = true;

		let browser = getBrowser();

		let att_list = await Promise.all(
			formData.attachments.map(async (x) => ({
				designation: x.name,
				base64: btoa((await toBase64(x)) as string),
			}))
		);

		await axios.post("/feedbacks", {
			designation: formData.designation,
			description: formData.description,
			url: window.location.href,
			operating_system: getOS(),
			browser: `${browser.name} ${browser.version}`,
			selector: formData.email,
			resolution: `${window.screen.width} x ${window.screen.height}`,
			attachments: att_list,
		});

		loadingModal.state = 1;
		loadingModal.message = t("tanks_feedback");
	} catch (error) {
		console.log(error);

		loadingModal.state = 2;
	}
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

const cancel = () => {};

const form = reactive({
	show: false,
	open: () => {
		form.show = true;
	},
	close: () => {
		form.show = false;
		formData.clear();
	},
	toggle: () => {
		if (form.show) form.close();
		else {
			if (user.value.id != undefined) formData.email = user.value.attributes.email;
			form.open();
		}
	},
});
</script>

<style lang="scss" scoped>
.bugshot-feedback {
	position: fixed;
	bottom: 5rem;
	right: 0;
}

.feedback-form form {
	background-color: hsl(240, 40%, 98%);
	padding: 1rem;
	box-shadow: -0.5rem 0 1.5rem hsla(231, 42%, 18%, 0.11);
	border-radius: 0.5rem;
}

form {
	position: absolute;
	bottom: 150%;
	right: 100%;
	max-height: 82vh;
}

.feedback-button {
	cursor: pointer;
	background: #1f2547;
	padding: 0.5rem 0.75rem;
	border-radius: 10rem 0 0 10rem;
	color: #18d992;
	font-size: 1.5rem;
	font-weight: bold;
	display: flex;
	align-items: center;

	p {
		max-width: 0;
		visibility: hidden;
		opacity: 0;
		transition: max-width 0.5s ease-in-out, visibility 0.2s linear 0s,
			opacity 0.25s ease-in-out 0.2s, padding 0.2s linear 0.2s;
	}

	&:hover,
	&.open {
		p {
			padding-left: 0.5rem;
			max-width: 10rem;
			visibility: visible;
			opacity: 1;
		}
	}

	img {
		width: 2.25rem;
	}
}
</style>
