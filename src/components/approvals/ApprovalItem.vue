<template>
	<div px-2 pb-4>
		<n-divider style="margin: 0 0 1rem 0" />

		<div grid style="grid-template-columns: 1fr 1fr 1fr" mb-2>
			<div flex gap-4 items-center>
				<n-h6 style="font-size: 0.875rem"> {{ $t("id") }}</n-h6>
				<p style="font-size: 0.75rem">
					{{ bug.attributes.ai_id }}
				</p>
			</div>

			<div flex gap-4 items-center>
				<n-h6 style="font-size: 0.875rem">{{ $t("creator") }}</n-h6>
				<p style="font-size: 0.75rem">
					<template v-if="bug.attributes.creator">
						{{
							`${bug.attributes.creator.attributes.first_name} ${bug.attributes.creator.attributes.last_name}`
						}}
					</template>
					<template v-else>
						{{ `${bug.attributes.selector ?? $t("anonymous")}` }}
					</template>
				</p>
			</div>

			<div flex gap-4 items-center>
				<n-h6 style="font-size: 0.875rem">{{ $t("created_at") }}</n-h6>
				<p style="font-size: 0.75rem">
					{{ $d(new Date(dateFix(bug.attributes.created_at)), "short") }}
				</p>
			</div>
		</div>

		<div my-4 h-80>
			<Screenshot
				:screenshots="bug.attributes.screenshots"
				:priority="bug.attributes.priority.id"
				:style="{ height: '100%' }"
			/>
		</div>

		<div grid grid-cols-2 gap-4 text-left>
			<div>
				<div flex gap-2 v-if="bug.attributes.url" h-6 mb-4>
					<n-h6>{{ $t("url") }}:</n-h6>
					<a
						:href="bug.attributes.url"
						target="_blank"
						style="font-size: 0.875rem; color: var(--bs-gray)"
					>
						<n-ellipsis :line-clamp="1" :tooltip="{ scrollable: true }">
							{{ bug.attributes.url }}
						</n-ellipsis>
					</a>
				</div>
				<div flex flex-col gap-2>
					<div flex items-center justify-between h-6>
						<div flex items-center>
							<n-h6>{{ $t("description") }}:</n-h6>
						</div>
					</div>
					<n-ellipsis
						expand-trigger="click"
						line-clamp="5"
						:tooltip="false"
						style="font-size: 0.875rem"
					>
						{{ bug.attributes.description ?? $t("empty") }}
					</n-ellipsis>
				</div>
			</div>
			<div>
				<div
					v-if="
						bug.attributes.resolution ||
						bug.attributes.selector ||
						bug.attributes.browser ||
						bug.attributes.operating_system
					"
				>
					<n-h6 m-0>{{ $t("technical_info") }}</n-h6>
					<div
						grid
						style="grid-template-columns: auto 1fr; gap: 0.25rem 1rem"
						class="technical-details"
					>
						<n-p>
							{{ $t("os") + ":" }}
						</n-p>
						<n-text>
							{{ bug.attributes.operating_system }}
						</n-text>
						<n-p> {{ $t("browser") + ":" }} </n-p>
						<n-text>
							{{ bug.attributes.browser }}
						</n-text>
						<n-p> {{ $t("resolution") + ":" }} </n-p>
						<n-text>
							{{ bug.attributes.resolution }}
						</n-text>
						<n-p> {{ $t("selector") + ":" }} </n-p>
						<n-text>
							<n-ellipsis line-clamp="1" expand-trigger="click" :tooltip="false">
								{{ bug.attributes.selector }}
							</n-ellipsis>
						</n-text>
					</div>
				</div>
			</div>
		</div>
		<div grid grid-cols-2 style="column-gap: 1rem; row-gap: 0.5rem" mt-8>
			<div inline-flex gap-4>
				<n-h6>{{ $t("deadline") + ":" }}</n-h6>
				<n-text style="color: var(--bs-gray)">
					{{
						bug.attributes.deadline
							? $d(new Date(dateFix(bug.attributes.deadline)), "short")
							: $t("no_deadline")
					}}
				</n-text>
			</div>
			<div inline-flex gap-4>
				<n-h6>{{ $t("priority") + ":" }}</n-h6>
				<PriorityTag :priority="bug.attributes.priority.id" />
			</div>
			<n-divider style="margin: 0" />
			<n-divider style="margin: 0" />
			<div inline-flex gap-4>
				<n-h6>{{ $t("time_estimate") + ":" }}</n-h6>
				<n-text style="color: var(--bs-gray)">
					{{ time_estimation }}
				</n-text>
			</div>
			<div inline-flex gap-4>
				<n-h6>{{ $t("status") + ":" }}</n-h6>
				<DropdownButton dumb :text="'Backlog'" />
			</div>
		</div>

		<div flex-1 flex gap-8 justify-center mt-8>
			<n-button type="success" round @click="emit('approve', bug.id)" :disabled="disabled">
				{{ $t("approve_bug") }}
			</n-button>

			<n-button
				type="success"
				ghost
				round
				@click="emit('reject', bug.id)"
				:disabled="disabled"
			>
				{{ $t("reject_bug") }}
			</n-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Bug } from "~/models/Bug";
import dateFix from "~/util/dateFixISO";

const props = defineProps({
	bug: {
		required: true,
		type: Object as PropType<Bug>,
	},
	disabled: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const emit = defineEmits(["approve", "reject"]);

const { t } = useI18n();

const time_estimation = computed(() => {
	let time = props.bug.attributes.time_estimation;

	if (time === undefined || time < 1) return "-";

	switch (props.bug.attributes.time_estimation_type) {
		default:
		case "m":
			return `${time} ${t("minute", time).toLocaleLowerCase()}`;
		case "h":
			return `${time} ${t("hour", time).toLocaleLowerCase()}`;
		case "w":
			return `${time} ${t("week", time).toLocaleLowerCase()}`;
		case "d":
			return `${time} ${t("day", time).toLocaleLowerCase()}`;
	}
});
</script>

<style scoped lang="scss">
h6 {
	margin: unset;
}
.technical-details {
	font-size: 0.875rem;

	p {
		margin: 0;
		font-size: 0.875rem;
	}

	span {
		color: var(--bs-gray);
	}
}
</style>
