<template>
	<div class="bs-container" flex flex-col gap-4>
		<div h-52 class="image">
			<img :src="image" alt="image" v-if="image" />
			<div v-else :style="{ color: color ?? COLOR.PURPLE }" w-120>
				<img src="/src/assets/icons/projects.svg" alt="project" />
			</div>
		</div>

		<div class="bs-input">
			<label>
				{{ t("project_name") }}
			</label>

			<input type="text" :placeholder="t('project_name')" :value="project_name" disabled />
		</div>

		<div class="bs-input">
			<label>
				{{ t("company") }}
			</label>

			<input type="text" :placeholder="t('company')" :value="company_name" disabled />
		</div>

		<div class="bs-input">
			<label>
				{{ t("url") }}
			</label>

			<input type="text" :placeholder="'http(s)://'" :value="url" disabled />
		</div>

		<ProjectEditModal
			:name="project_name"
			:color="color"
			:image="image"
			:url="url"
			:extra_urls="extra_urls"
			:submit="editFunction"
		>
			<template #button>
				<a mt4 cursor-pointer>
					<img src="/src/assets/icons/edit.svg" alt="edit" class="black-to-purple" />
					<b> {{ t("edit.project") }}</b>
				</a>
			</template>
		</ProjectEditModal>
	</div>
</template>

<script setup lang="ts">
import { Url } from "~/models/Url";
import { useProjectStore } from "~/stores/project";
import { COLOR } from "~/util/colors";

const { t } = useI18n();

defineProps({
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

	extra_urls: {
		required: false,
		type: Array as PropType<Url[]>,
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

const editFunction = async (
	data: {
		designation: string;
		url: string;
		color_hex: string;
		base64: string;
	},
	new_urls: string[],
	extra_urls_modified?: { edited: Url[]; deleted: Url[] }
) => {
	await useProjectStore().updateResource(data);

	if (new_urls && (new_urls.length ?? 0) > 0) {
		await Promise.allSettled(
			new_urls.map(async (url) => await useProjectStore().addExtraUrl(url))
		);
	}

	if (
		extra_urls_modified &&
		(extra_urls_modified.edited.length ?? 0) + (extra_urls_modified.deleted.length ?? 0) > 0
	) {
		if ((extra_urls_modified.edited.length ?? 0) > 0) {
			await Promise.allSettled(
				extra_urls_modified.edited.map(
					async (url) => await useProjectStore().updateExtraUrl(url)
				)
			);
		}

		if ((extra_urls_modified.deleted.length ?? 0) > 0) {
			await Promise.allSettled(
				extra_urls_modified.deleted.map(
					async (url) => await useProjectStore().deleteExtraUrl(url)
				)
			);
		}
	}

	await useProjectStore().fetchProjectUrls();
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
