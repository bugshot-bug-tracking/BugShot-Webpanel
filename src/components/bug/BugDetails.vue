<template>
	<n-card class="n-card-container" v-if="!store.bug || store.loading_bug">
		<template #header v-if="store.loading_bug">
			<n-skeleton text height="2rem" />
		</template>

		<div flex flex-col gap-4>
			<div flex gap-2>
				<n-skeleton size="medium" width="33%" />
				<n-skeleton size="medium" width="33%" />
				<n-skeleton size="medium" width="33%" />
			</div>

			<n-skeleton height="10rem" />

			<n-skeleton text />

			<div>
				<n-skeleton width="40%" mb-2 />
				<n-skeleton height="5rem" />
			</div>

			<n-skeleton text />

			<div flex gap-2 items-center>
				<n-skeleton text />
				<n-skeleton text size="medium" />
				<n-skeleton text />
				<n-skeleton text size="medium" />
			</div>

			<n-skeleton text size="medium" />

			<n-skeleton text size="medium" />
		</div>
	</n-card>

	<n-card class="n-card-container" v-else>
		<template #header>
			<div flex justify-between min-h-8 items-baseline>
				<n-h3>
					{{ store.bug.attributes.designation }}
				</n-h3>

				<img
					w-6
					ml-2
					src="/src/assets/icons/close_2.svg"
					alt="edit"
					cursor-pointer
					@click="emit('close')"
				/>
			</div>
		</template>

		<div flex flex-col gap-4>
			<div grid style="grid-template-columns: 1fr 4fr 3fr">
				<div>
					<n-h6> {{ $t("id") }}</n-h6>
					<p style="font-size: 0.875rem">
						{{ store.bug.attributes.ai_id }}
					</p>
				</div>

				<div>
					<n-h6>{{ $t("creator") }}</n-h6>

					<p style="font-size: 0.875rem">
						<template v-if="store.bug.attributes.creator">
							{{
								`${store.bug.attributes.creator.attributes.first_name} ${store.bug.attributes.creator.attributes.last_name}`
							}}
						</template>

						<template v-else>
							{{ `${store.bug.attributes.selector ?? t("anonymous")}` }}
						</template>
					</p>
				</div>

				<div>
					<n-h6>{{ $t("created_at") }}</n-h6>

					<p style="font-size: 0.875rem">
						{{ $d(new Date(dateFix(store.bug.attributes.created_at)), "short") }}
					</p>
				</div>
			</div>

			<n-skeleton height="10rem" v-if="store.loading_screenshots" />
			<Screenshot
				v-else
				:screenshots="store.getScreenshots"
				:priority="store.bug.attributes.priority.id"
			/>

			<div flex gap-2 v-if="store.bug.attributes.url" h-6>
				<n-h6>{{ $t("url") }}:</n-h6>

				<a
					:href="store.bug.attributes.url"
					target="_blank"
					style="font-size: 0.875rem; color: var(--bs-gray)"
				>
					<n-ellipsis :line-clamp="1" :tooltip="{ scrollable: true }">
						{{ store.bug.attributes.url }}
					</n-ellipsis>
				</a>
			</div>

			<div flex flex-col gap-2>
				<n-h6>{{ $t("description") }}:</n-h6>

				<n-ellipsis
					expand-trigger="click"
					line-clamp="5"
					:tooltip="false"
					style="font-size: 0.875rem; white-space: pre-line"
				>
					{{ store.bug.attributes.description ?? "-" }}
				</n-ellipsis>
			</div>

			<n-collapse
				v-if="
					store.bug.attributes.resolution ||
					store.bug.attributes.selector ||
					store.bug.attributes.browser ||
					store.bug.attributes.operating_system
				"
				arrow-placement="right"
				display-directive="show"
			>
				<n-collapse-item class="technical-collapse bs-bb">
					<template #header>
						<n-h6>{{ $t("technical_info") }}</n-h6>
					</template>

					<div grid style="grid-template-columns: auto 1fr; gap: 0.25rem 1rem">
						<n-p>
							{{ $t("os") + ":" }}
						</n-p>

						<n-text>
							{{ store.bug.attributes.operating_system }}
						</n-text>

						<n-p> {{ $t("browser") + ":" }} </n-p>

						<n-text>
							{{ store.bug.attributes.browser }}
						</n-text>

						<n-p> {{ $t("resolution") + ":" }} </n-p>

						<n-text>
							{{ store.bug.attributes.resolution }}
						</n-text>

						<n-p> {{ $t("selector") + ":" }} </n-p>

						<n-text>
							<n-ellipsis line-clamp="2" expand-trigger="click" :tooltip="false">
								{{ store.bug.attributes.selector }}
							</n-ellipsis>
						</n-text>
					</div>
				</n-collapse-item>
			</n-collapse>

			<div grid style="grid-template-columns: 1fr 2fr 1fr 2fr">
				<n-h6>{{ $t("priority") + ":" }}</n-h6>

				<DropdownButton
					dumb
					:list="priorities"
					:color="priorities[store.bug.attributes.priority.id - 1].color"
					m-a
				>
					<template #text>
						{{ priorities[store.bug.attributes.priority.id - 1].text }}
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

				<n-h6>{{ $t("status") + ":" }}</n-h6>

				<DropdownButton
					dumb
					:list="store.statuses"
					:text="store.getStatus?.attributes.designation"
					m-a
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
					{{ $t("deadline") + ":" }}
				</n-h6>

				<n-text depth="3">
					{{
						store.bug.attributes.deadline
							? d(new Date(dateFix(store.bug.attributes.deadline)), "short")
							: t("no_deadline")
					}}
				</n-text>
			</div>

			<div
				flex
				items-center
				gap-2
				class="bs-bb bs-bt"
				py-4
				v-if="useFlagsStore().canSeeEverything"
			>
				<n-h6 style="white-space: nowrap">
					{{ $t("time_estimate") + ":" }}
				</n-h6>

				<div flex items-center>
					<n-text depth="3">
						{{
							store.bug.attributes.time_estimation
								? t("x_minutes", [store.bug.attributes.time_estimation])
								: "-"
						}}
					</n-text>

					<n-text
						v-if="approvalStatus"
						:type="approvalStatus.type"
						ml-4
						style="font-size: 0.875rem"
					>
						{{ approvalStatus.text }}
					</n-text>
				</div>
			</div>

			<div flex items-center gap-2>
				<n-h6>
					{{ $t("assigned_to") + ":" }}
				</n-h6>

				<AssignModal :assignedList="store.getAssignees" :submit="onSubmit" />
			</div>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import dateFix from "~/util/dateFixISO";
import { useBugStore } from "~/stores/bug";
import axios from "axios";
import { User } from "~/models/User";
import { useFlagsStore } from "~/stores/flags";

const emit = defineEmits(["close"]);

const store = useBugStore();

const { d, t } = useI18n();

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

const approvalStatus = computed(() => {
	let approval_status = store.bug?.attributes.approval_status;

	if (approval_status?.id == undefined) return undefined;

	switch (approval_status.designation) {
		case "pending":
			return {
				text: t("approval_status.pending"),
				type: "warning",
			};

		case "approved":
			return {
				text: t("approval_status.approved"),
				type: "success",
			};

		case "declined":
			return {
				text: t("approval_status.rejected"),
				type: "error",
			};
	}
});

const onSubmit = async (list: { user: User; original: boolean; checked: boolean }[]) => {
	for (const item of list) {
		// if no change was made skip over the item
		if (item.original === item.checked) continue;

		if (item.checked === true)
			await axios.post(`bugs/${store.bug?.id}/assign-user`, {
				user_id: item.user.id,
			});
		else await axios.delete(`bugs/${store.bug?.id}/users/${item.user.id}`);
	}

	await store.fetchBugUsers();
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
