<template>
	<div class="bs-container" flex flex-col gap-4>
		<div h-52 class="image">
			<img :src="values.image" alt="image" v-if="image" />
			<div v-else :style="{ color: color ?? COLOR.PURPLE }" w-120>
				<img src="/src/assets/icons/organization.svg" alt="project" />
			</div>
		</div>

		<div class="bs-input2">
			<label>
				{{ t("organization_name") }}
			</label>

			<input
				type="text"
				:placeholder="t('organization_name')"
				v-model="values.name"
				disabled
			/>
		</div>

		<OrganizationEditModal :name="name" :color="color" :image="image" :submit="editFunction">
			<template #button>
				<a mt4 cursor-pointer>
					<img src="/src/assets/icons/edit.svg" alt="edit" class="black-to-purple" />
					<b> {{ t("edit.organization") }}</b>
				</a>
			</template>
		</OrganizationEditModal>
	</div>
</template>

<script setup lang="ts">
import { COLOR } from "~/util/colors";
import OrganizationEditModal from "~/pages/organization/components/OrganizationEditModal.vue";

const { t } = useI18n();

const props = defineProps({
	name: {
		required: true,
		type: String,
	},

	image: {
		required: false,
		type: String,
		default: undefined,
	},

	color: {
		required: false,
		type: String,
		default: COLOR.PURPLE,
	},

	editFunction: {
		type: Function,
		required: true,
	},
});

const values = reactive({
	name: "",
	image: "",

	set: () => {
		values.name = props.name;
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
