<template>
	<div class="bs-container" flex flex-col gap-4>
		<div h-52 class="image">
			<img :src="c_image" alt="image" v-if="c_image" />
			<div v-else :style="{ color: color ?? COLOR.PURPLE }" w-120>
				<img src="/src/assets/icons/company.svg" alt="project" />
			</div>
		</div>

		<div class="bs-input" @click="modalOpen = true">
			<label>
				{{ t("company_name") }}
			</label>

			<input type="text" :placeholder="t('company_name')" :value="company_name" disabled />
		</div>

		<div class="bs-input" @click="modalOpen = true">
			<label>
				{{ t("organization_name") }}
			</label>

			<input
				type="text"
				:placeholder="t('organization')"
				:value="organization_name"
				disabled
			/>
		</div>

		<CompanyEditModal
			:name="company_name"
			:color="color"
			:image="image"
			:submit="editFunction"
			v-model:open="modalOpen"
		>
			<template #button>
				<a mt4 cursor-pointer>
					<img src="/src/assets/icons/edit.svg" alt="edit" class="black-to-purple" />
					<b> {{ t("edit.company") }}</b>
				</a>
			</template>
		</CompanyEditModal>
	</div>
</template>

<script setup lang="ts">
import { COLOR } from "~/util/colors";
import { useCompanyStore } from "~/stores/company";

const { t } = useI18n();

const props = defineProps({
	company_name: {
		required: true,
		type: String,
	},

	organization_name: {
		required: true,
		type: String,
	},

	image: {
		required: false,
		type: String,
		default: "",
	},

	color: {
		required: true,
		type: String,
		default: COLOR.PURPLE,
	},
});

const editFunction = async (data: { designation: string; color_hex: string; base64: string }) => {
	await useCompanyStore().updateResource(data);
};

const c_image = computed(() => props.image);

const modalOpen = ref(false);
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
