<template>
	<div class="bs-container" flex flex-col gap-4>
		<div h-52 class="image">
			<img :src="values.image" alt="image" v-if="image" />
			<div v-else :style="{ color: color ?? COLOR.PURPLE }">
				<img src="/src/assets/icons/projects.svg" alt="project" />
			</div>
		</div>

		<div class="bs-input2">
			<label>
				{{ t("project_name") }}
			</label>

			<input
				type="text"
				:placeholder="t('project_name')"
				v-model="values.p_name"
				disabled
			/>
		</div>

		<div class="bs-input2">
			<label>
				{{ t("company") }}
			</label>

			<input
				type="text"
				:placeholder="t('company')"
				v-model="values.c_name"
				disabled
			/>
		</div>

		<div class="bs-input2">
			<label>
				{{ t("url") }}
			</label>

			<input
				type="text"
				:placeholder="'http(s)://'"
				v-model="values.url"
				disabled
			/>
		</div>

		<ProjectEditModal
			:name="project_name"
			:color="color"
			:image="image"
			:url="url"
			:submit="editFunction"
		>
			<template #button>
				<a mt4 cursor-pointer>
					<img
						src="/src/assets/icons/edit.svg"
						alt="edit"
						class="black-to-purple"
					/>
					<b> {{ t("edit.project") }}</b>
				</a>
			</template>
		</ProjectEditModal>
	</div>
</template>

<script setup lang="ts">
import { COLOR } from "~/util/colors";

const { t } = useI18n();

const props = defineProps({
	project_name: {
		required: true,
		type: String,
	},

	company_name: {
		required: true,
		type: String,
	},

	url: {
		required: true,
		type: String,
	},

	image: {
		required: false,
		type: String,
		default: undefined,
	},

	color: {
		required: true,
		type: String,
		default: COLOR.PURPLE,
	},

	editFunction: {
		required: true,
	},
});

const values = reactive({
	p_name: "",
	c_name: "",
	url: "",
	image: "",

	set: () => {
		values.p_name = props.project_name;
		values.c_name = props.company_name;
		values.url = props.url;
		values.image = atob(props.image ?? "");
	},
});

values.set();
watch(props, () => {
	values.set();
});
</script>

<style lang="scss" scoped>
.image {
	overflow: hidden;
	margin: -1.25rem -1.25rem 0 -1.25rem;
	border-radius: 0.5rem 0.5rem 0 0;
	display: flex;
	align-items: center;

	img {
		min-width: 100%;
		min-height: 100%;
		max-width: 100%;
	}

	div {
		min-width: 100%;
		min-height: 100%;
		background-color: currentColor;
		display: flex;
		align-items: center;
		justify-content: center;

		img {
			width: 10rem;
			height: 10rem;
		}
	}
}
</style>
