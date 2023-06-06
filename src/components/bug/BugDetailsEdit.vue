<template>
	<n-card class="n-card-container">
		<n-form :show-feedback="false" :disabled="loading">
			<div flex flex-col gap-4>
				<n-form-item :label="t('edit.designation')" flex-1>
					<n-input
						v-model:value="data.designation"
						type="text"
						placeholder=""
						maxlength="70"
						show-count
					/>
				</n-form-item>

				<n-form-item :label="t('edit.url')" flex-1>
					<n-input v-model:value="data.url" type="text" placeholder="" />
				</n-form-item>

				<n-form-item :label="t('edit.description')" flex-1>
					<n-input
						v-model:value="data.description"
						type="textarea"
						maxlength="1500"
						show-count
						placeholder=""
						:rows="8"
					/>
				</n-form-item>

				<div grid style="grid-template-columns: 1fr 2fr 1fr 2fr">
					<n-h6>{{ t("priority") + ":" }}</n-h6>

					<DropdownButton
						@select="changePriority"
						:list="priorities"
						:color="priorities[data.priority - 1].color"
						m-a
						:disabled="loading"
					>
						<template #text>
							{{ priorities[data.priority - 1].text }}
						</template>

						<template #item="{ item }">
							<div flex items-center gap-2>
								<div
									class="dot"
									:style="{
										background: item.color,
									}"
								/>

								{{ item.text }}
							</div>
						</template>
					</DropdownButton>

					<n-h6>{{ t("status") + ":" }}</n-h6>

					<DropdownButton
						@select="changeStatus"
						:list="store.statuses"
						:text="store.getStatusByID(data.status)?.attributes.designation ?? '?'"
						m-a
						:disabled="loading"
					>
						<template #item="{ item }">
							<n-ellipsis style="max-width: 7rem" :tooltip="{ scrollable: true }">
								{{ item.attributes.designation }}
							</n-ellipsis>
						</template>
					</DropdownButton>
				</div>

				<div flex items-center gap-2>
					<n-h6>
						{{ t("deadline") + ":" }}
					</n-h6>

					<n-date-picker
						v-model:value="data.deadline"
						type="datetime"
						clearable
						:placeholder="t('no_deadline')"
						flex-1
						:disabled="loading"
					/>
				</div>

				<div flex items-center gap-2 py-4 v-if="useFlagsStore().canSeeEverything">
					<n-h6 style="white-space: nowrap">
						{{ t("time_estimate") + ":" }}
					</n-h6>

					<n-input-group>
						<n-input-number
							clearable
							:min="0"
							v-model:value="data.time_estimation"
							:disabled="loading"
						/>
						<n-input-group-label>{{ t("minutes") }}</n-input-group-label>
					</n-input-group>
				</div>
			</div>
		</n-form>
	</n-card>
</template>

<script setup lang="ts">
import { Status } from "~/models/Status.js";
import { useBugStore } from "~/stores/bug";
import { useFlagsStore } from "~/stores/flags";
const props = defineProps({
	data: {
		type: Object as PropType<{
			designation: string;
			description: string;
			url: string;
			priority: number;
			status: string;
			deadline: undefined | number;
			time_estimation: undefined | number;
		}>,
		default: {
			designation: "",
			description: "",
			url: "",
			priority: 2,
			status: "",
			deadline: undefined as undefined | number,
			time_estimation: undefined as undefined | number,
		},
	},
	loading: Boolean,
});

defineEmits(["update:data"]);
const { t } = useI18n();

const store = useBugStore();

const priorities = computed(() => [
	{
		id: 1,
		text: t("minor"),
		color: "#18bed8",
	},
	{
		id: 2,
		text: t("normal"),
		color: "#185ed8",
	},
	{
		id: 3,
		text: t("important"),
		color: "#ffb057",
	},
	{
		id: 4,
		text: t("critical"),
		color: "#f53d3d",
	},
]);

const changePriority = (value: { id: number; text: string; color: string }) => {
	props.data.priority = value.id;
};

const changeStatus = (item: Status) => {
	props.data.status = item.id;
};
</script>

<style scoped lang="scss">
h3,
h6 {
	margin: unset;
	word-break: keep-all;
}

.technical-collapse {
	:deep(.n-collapse-item-arrow) {
		margin-left: auto !important;
	}

	p {
		margin: unset;
		font-size: 0.875rem;
		font-weight: 500;

		& + span {
			font-size: 0.875rem;
			color: var(--bs-gray);
		}
	}
}

a:focus-visible {
	outline: unset;
}
</style>
