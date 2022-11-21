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

				<input type="text" :placeholder="$t('token')" v-model="code.token" disabled />
			</div>

			<button class="bs-btn red" mx-a mt-4>
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
			<button class="bs-btn green">
				{{ $t("generate_token") }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";

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
const code = ref(undefined as undefined | Object);
const error = ref(false);

const tokens = ref(undefined as undefined | []);

const actions = reactive({
	get: async () => {
		try {
			loading.value = true;
			error.value = false;

			let type = "";

			switch (props.type) {
				case "Company":
					type = "companies";
					break;

				case "Project":
					type = "projects";
					break;
			}

			let response = await axios.get(`${type}/${props.id}/api-tokens`);

			console.log(response);

			tokens.value = response.data.data;

			code.value = tokens.value?.at(0);
		} catch (err) {
			error.value = true;
			console.log(err);
		} finally {
			loading.value = false;
		}
	},

	update: () => {},

	delete: async (value: number) => {
		try {
			loading.value = true;
			error.value = false;

			let type = "";

			switch (props.type) {
				case "Company":
					type = "companies";
					break;

				case "Project":
					type = "projects";
					break;
			}

			let response = await axios.delete(`${type}/${props.id}/api-tokens/${value}`);

			console.log(response);
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
}
</style>
