<template>
	<div class="bs-container">
		<div v-if="loading" class="page-loading">
			<img src="/src/assets/animations/loading.svg" alt="loading circle" />
		</div>

		<div v-else-if="!loading && code">
			<div class="bs-input2">
				<label>
					{{ $t("token") }}
				</label>

				<input
					type="text"
					:placeholder="$t('token')"
					v-model="code.attributes.token"
					disabled
				/>
			</div>

			<button class="bs-btn red" mx-a mt-4 @click.prevent="actions.delete(code?.id)">
				{{ $t("delete_token") }}
			</button>
		</div>

		<div v-else-if="!loading && error" flex flex-col gap-4>
			<b text-8 class="black-to-red">{{ $t("error") }}!</b>

			<button class="bs-btn purple" @click.prevent="actions.get">
				{{ $t("refresh") }}
			</button>
		</div>

		<div v-else class="generate-state">
			<button class="bs-btn green" @click.prevent="actions.update">
				{{ $t("generate_token") }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ApiToken } from "~/models/ApiToken";

const props = defineProps({
	type: {
		required: true,
		type: String,
	},
	id: {
		required: true,
		type: String,
		description: "Resource id",
	},
});

const loading = ref(true);
const code = ref(undefined as ApiToken | undefined);
const error = ref(false);

const tokens = ref(undefined as undefined | []);

const actions = reactive({
	get: async () => {
		try {
			loading.value = true;
			error.value = false;

			let response = await axios.get(
				`${props.type.toLocaleLowerCase()}/${props.id}/api-tokens`
			);

			tokens.value = response.data.data;

			code.value = tokens.value?.at(0);
		} catch (err) {
			error.value = true;
			console.log(err);
		} finally {
			loading.value = false;
		}
	},

	update: async () => {
		try {
			loading.value = true;
			error.value = false;

			await axios.post(`${props.type.toLocaleLowerCase()}/${props.id}/api-tokens`);
		} catch (err) {
			error.value = true;
			console.log(err);
		} finally {
			loading.value = false;
		}

		actions.get();
	},

	delete: async (value: number | undefined) => {
		if (value === undefined) return;

		try {
			loading.value = true;
			error.value = false;

			await axios.delete(`${props.type.toLocaleLowerCase()}/${props.id}/api-tokens/${value}`);
		} catch (err) {
			error.value = true;
			console.log(err);
		} finally {
			loading.value = false;
		}

		actions.get();
	},
});

onMounted(() => {
	actions.get();
});
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
