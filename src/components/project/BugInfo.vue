<template>
	<n-card class="bug-info-card" v-if="!store.bug || store.loading_bug">
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

	<n-card class="bug-info-card" v-else>
		<template #header>
			<div v-if="!bugData.flag1" flex justify-between min-h-8>
				<div flex items-center>
					<n-h2>
						{{ store.bug.attributes.designation }}
					</n-h2>

					<img
						w-4
						ml-2
						class="black-to-gray"
						src="/src/assets/icons/edit.svg"
						alt="edit"
						cursor-pointer
						@click="bugData.editDesignation"
					/>
				</div>

				<img
					w-6
					ml-2
					src="/src/assets/icons/close_2.svg"
					alt="edit"
					cursor-pointer
					@click="emit('close')"
				/>
			</div>

			<div v-else flex gap-4 h-8 items-center>
				<n-input
					v-model:value="bugData.designation"
					type="text"
					:placeholder="store.bug.attributes.designation"
					maxlength="70"
					show-count
					flex-1
				/>

				<div flex gap-2>
					<img
						src="/src/assets/icons/check.svg"
						alt="save"
						class="black-to-gray"
						@click="changeDesignation"
						w-6
						cursor-pointer
					/>

					<img
						src="/src/assets/icons/close_2.svg"
						alt="cancel"
						class="black-to-gray"
						@click="bugData.flag1 = false"
						cursor-pointer
						w-6
					/>
				</div>
			</div>
		</template>

		<div flex flex-col gap-4>
			<div grid style="grid-template-columns: 1fr 4fr 2fr">
				<div>
					<n-h4> {{ $t("id") }}</n-h4>
					<p style="font-size: 0.875rem">
						{{ store.bug.attributes.ai_id }}
					</p>
				</div>

				<div>
					<n-h4>{{ $t("creator") }}</n-h4>

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
					<n-h4>{{ $t("created_at") }}</n-h4>

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
				<n-h4>{{ $t("url") }}:</n-h4>

				<a
					:href="store.bug.attributes.url"
					target="_blank"
					style="font-size: 0.875rem; color: var(--bs-gray)"
				>
					<n-ellipsis :line-clamp="1">
						{{ store.bug.attributes.url }}
					</n-ellipsis>
				</a>
			</div>

			<div flex flex-col gap-2>
				<div flex items-center justify-between h-6>
					<div flex items-center>
						<n-h4>{{ $t("description") }}:</n-h4>

						<img
							v-if="!bugData.flag2"
							w-4
							ml-2
							class="black-to-gray"
							src="/src/assets/icons/edit.svg"
							alt="edit"
							cursor-pointer
							@click="bugData.editDescription"
						/>
					</div>

					<div v-if="bugData.flag2" flex gap-4>
						<img
							src="/src/assets/icons/check.svg"
							alt="save"
							class="black-to-gray"
							@click="changeDescription"
							w-6
							cursor-pointer
						/>

						<img
							src="/src/assets/icons/close_2.svg"
							alt="cancel"
							class="black-to-gray"
							@click="bugData.flag2 = false"
							w-6
							cursor-pointer
						/>
					</div>
				</div>

				<n-ellipsis
					v-if="!bugData.flag2 && store.bug.attributes.description"
					expand-trigger="click"
					line-clamp="5"
					:tooltip="false"
					style="font-size: 0.875rem"
				>
					{{ store.bug.attributes.description }}
				</n-ellipsis>

				<n-input
					v-else-if="bugData.flag2"
					v-model:value="bugData.description"
					type="textarea"
					maxlength="1500"
					show-count
					:placeholder="store.bug.attributes.description"
					:rows="4"
				/>
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
						<n-h4>{{ $t("technical_info") }}</n-h4>
					</template>

					<div grid style="grid-template-columns: auto 1fr; gap: 0.25rem 1rem">
						<n-h5>
							{{ $t("os") + ":" }}
						</n-h5>

						<p>
							{{ store.bug.attributes.operating_system }}
						</p>

						<n-h5> {{ $t("browser") + ":" }} </n-h5>

						<p>
							{{ store.bug.attributes.browser }}
						</p>

						<n-h5> {{ $t("resolution") + ":" }} </n-h5>

						<p>
							{{ store.bug.attributes.resolution }}
						</p>

						<n-h5> {{ $t("selector") + ":" }} </n-h5>

						<p>
							<n-ellipsis line-clamp="2" expand-trigger="click" :tooltip="false">
								{{ store.bug.attributes.selector }}
							</n-ellipsis>
						</p>
					</div>
				</n-collapse-item>
			</n-collapse>

			<div grid style="grid-template-columns: 1fr 2fr 1fr 2fr">
				<n-h4>{{ $t("priority") + ":" }}</n-h4>

				<DropdownButton
					@select="changePriority"
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

				<n-h4>{{ $t("status") + ":" }}</n-h4>

				<DropdownButton
					@select="changeStatus"
					:list="store.statuses"
					:text="store.getStatus?.attributes.designation"
					m-a
				>
					<template #item="{ item }">
						<n-ellipsis style="max-width: 7rem">
							{{ item.attributes.designation }}
						</n-ellipsis>
					</template>
				</DropdownButton>
			</div>

			<div flex items-center gap-2>
				<n-h4>
					{{ $t("deadline") + ":" }}
				</n-h4>

				<n-date-picker
					v-model:value="timestamp"
					type="datetime"
					clearable
					:placeholder="$t('no_deadline')"
					flex-1
					@clear="clearDeadline"
					@confirm="changeDeadline"
				/>
			</div>

			<div flex items-center gap-2>
				<n-h4>
					{{ $t("assigned_to") + ":" }}
				</n-h4>

				<Assignees :list="store.getAssignees" />
			</div>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import dateFix from "~/util/dateFixISO";
import { Status } from "~/models/Status.js";
import { useBugStore } from "~/stores/bug";

const emit = defineEmits(["close"]);

const store = useBugStore();

const { t } = useI18n();

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

const timestamp = ref(undefined as undefined | number);

watchEffect(() => {
	if (store.bug?.attributes.deadline)
		timestamp.value = new Date(store.bug!.attributes.deadline).valueOf();
});

const bugData = reactive({
	designation: "",
	flag1: false,
	editDesignation: () => {
		bugData.designation = store.bug!.attributes.designation;
		bugData.flag1 = true;
	},

	description: "",
	flag2: false,
	editDescription: () => {
		bugData.description = store.bug!.attributes.description;
		bugData.flag2 = true;
	},
});

const changeDesignation = () => {
	bugData.flag1 = false;

	store.bug!.attributes.designation = bugData.designation;

	store.updateBug({
		designation: bugData.designation,
	});
};

const changeDescription = () => {
	bugData.flag2 = false;

	store.bug!.attributes.description = bugData.description;

	store.updateBug({
		description: bugData.description,
	});
};

const changePriority = (value: { id: number; text: string; color: string }) => {
	store.updateBug({
		priority_id: value.id,
	});
};

const changeStatus = (item: Status) => {
	store.updateBug({
		status_id: item.id,
		order_number: 0,
	});
};

const clearDeadline = () => {
	store.updateBug({
		deadline: null,
	});
};

const changeDeadline = (value: number) => {
	let newDate = value ? new Date(value).toISOString() : null;

	if (store.bug!.attributes.deadline != null) {
		let bug_deadline = store.bug!.attributes.deadline;

		if (bug_deadline.match(/[z]$/i) == null) bug_deadline += "Z";

		let deadline = new Date(bug_deadline).toISOString();

		if (newDate && newDate === deadline) return;
	}

	store.updateBug({
		deadline: newDate,
	});
};
</script>

<style scoped lang="scss">
.bug-info-card {
	box-shadow: 0 0.125rem 0.25rem hsla(0, 0%, 0%, 0.15);
	border-radius: 1rem;
}

h2,
h4,
h5 {
	margin: unset;
	word-break: keep-all;
}

h5 {
	font-weight: 500;
	font-size: 0.875rem;

	& + p {
		font-size: 0.875rem;
	}
}
.technical-collapse {
	:deep(.n-collapse-item-arrow) {
		margin-left: auto !important;
	}
}

a:focus-visible {
	outline: unset;
}
</style>
