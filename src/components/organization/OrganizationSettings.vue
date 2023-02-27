<template>
	<div class="bs-container" flex flex-col gap-4>
		<div h-52 class="image">
			<div :style="{ color: COLOR.PURPLE }" w-120>
				<img src="/src/assets/icons/organization.svg" alt="project" />
			</div>
		</div>

		<div class="bs-input">
			<label>
				{{ $t("organization_name") }}
			</label>

			<input
				type="text"
				:placeholder="$t('organization_name')"
				v-model="resource.attributes.designation"
				disabled
			/>
		</div>

		<OrganizationEditModal :name="resource.attributes.designation" :submit="editResource">
			<template #button>
				<a mt4 cursor-pointer>
					<img src="/src/assets/icons/edit.svg" alt="edit" class="black-to-purple" />
					<b> {{ $t("edit.organization") }}</b>
				</a>
			</template>
		</OrganizationEditModal>
	</div>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";
import { COLOR } from "~/util/colors";

const store = useOrganizationStore();

const resource = computed(() => store.getOrganization!);

const editResource = async (data: { designation: string }) => {
	await store.updateResource(data);
};
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
