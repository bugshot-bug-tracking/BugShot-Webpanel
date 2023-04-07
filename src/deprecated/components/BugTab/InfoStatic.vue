<template>
	<div class="content-container">
		<div id="info" flex flex-col>
			<div justify-between mb-2 items-start>
				<div class="title" flex>
					<div class="content">{{ bug.attributes.designation }}</div>
				</div>

				<div class="close-button" @click="emit('close')" cursor-pointer />
			</div>

			<div class="id">
				<label> {{ $t("id") + ":" }} </label>
				<div class="content">{{ bug.attributes.ai_id }}</div>
			</div>

			<div class="grid1x2" style="grid-template-columns: 1fr 3fr; font-size: 0.875rem">
				<label>{{ $t("creator") + ":" }}</label>

				<div class="content" v-if="bug.attributes.creator">
					<div class="name">
						{{
							`${bug.attributes.creator.attributes.first_name} ${bug.attributes.creator.attributes.last_name}`
						}}
					</div>
				</div>

				<div class="content" v-else>
					<div class="name">
						{{ `${bug.attributes.selector ?? t("anonymous")}` }}
					</div>
				</div>
			</div>

			<div class="grid1x2" style="grid-template-columns: 1fr 3fr; font-size: 0.875rem">
				<label>{{ $t("created_at") + ":" }}</label>

				<div class="content">
					<div class="date">
						{{ $d(new Date(dateFix(bug.attributes.created_at)), "short") }}
					</div>
				</div>
			</div>

			<div>
				<slot name="screenshot">
					<Screenshot
						:screenshots="bug.screenshots ?? []"
						:priority="bug.attributes.priority.id"
					/>
				</slot>
			</div>

			<div class="url" v-if="bug.attributes.url">
				<label>{{ $t("url") + ":" }}</label>

				<div class="content">
					<a :href="bug.attributes.url" target="_blank">
						{{ bug.attributes.url }}
					</a>
				</div>
			</div>

			<div class="description">
				<div flex justify-between mb-2>
					<label>
						{{ $t("description") + ":" }}
					</label>
				</div>

				<div class="content">
					{{ bug.attributes.description }}
				</div>
			</div>

			<div
				id="technical"
				:class="{ open: open }"
				v-if="
					bug.attributes.resolution ||
					bug.attributes.selector ||
					bug.attributes.browser ||
					bug.attributes.operating_system
				"
			>
				<div
					class="technical-label d-inline-flex justify-content-between"
					@click="open = !open"
				>
					<span>{{ $t("technical_info") + ":" }}</span>
					<img src="/src/assets/icons/caret_down.svg" />
				</div>

				<div class="technical-info">
					<div class="os" v-if="bug.attributes.operating_system">
						<label>{{ $t("os") + ":" }}</label>

						<div class="content">
							{{ bug.attributes.operating_system }}
						</div>
					</div>

					<div class="browser" v-if="bug.attributes.browser">
						<label>{{ $t("browser") + ":" }}</label>

						<div class="content">{{ bug.attributes.browser }}</div>
					</div>

					<div class="selector" v-if="bug.attributes.selector">
						<label>{{ $t("selector") + ":" }}</label>

						<div class="content">{{ bug.attributes.selector }}</div>
					</div>

					<div class="resolution" v-if="bug.attributes.resolution">
						<label>{{ $t("resolution") + ":" }}</label>

						<div class="content">
							{{ bug.attributes.resolution }}
						</div>
					</div>
				</div>
			</div>

			<div class="grid1x2 my-3" style="grid-template-columns: 1fr 1fr">
				<div class="grid1x2">
					<label>{{ $t("priority") + ":" }}</label>

					<DropdownButton
						:list="priorities"
						:color="priorities[bug.attributes.priority.id - 1].color"
						dumb
					>
						<template #text>
							{{ priorities[bug.attributes.priority.id - 1].text }}
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
				</div>

				<div />
			</div>

			<div class="deadline">
				<label>{{ $t("deadline") + ":" }}</label>

				<div class="content">
					<Datepicker
						disabled
						v-model="datePicker"
						:placeholder="$t('no_deadline')"
						:locale="locale"
						:format="format"
						:previewFormat="format"
						:selectText="$t('select.select')"
						:cancelText="$t('cancel')"
					/>
				</div>
			</div>

			<div class="assignes my-3">
				<label>{{ $t("assigned_to") + ":" }}</label>

				<div class="content">
					<Assignees :list="assignees" disableAdd />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import dateFix from "~/util/dateFixISO";
import { useI18nStore } from "~/stores/i18n";
import { Bug } from "~/models/Bug";
import { useReportsStore } from "~/stores/reports";

const emit = defineEmits(["close"]);

const props = defineProps({
	bug: {
		required: true,
		type: Object as PropType<Bug>,
	},
});

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

const open = ref(false);

const datePicker = ref(undefined as string | undefined);

watchEffect(() => {
	datePicker.value = dateFix(props.bug.attributes.deadline);
});

const { d } = useI18n({ useScope: "global" });
const locale = computed(() => useI18nStore().getCurrentLocale);
const format = (date: Date) => d(new Date(date).toISOString(), "short");

const assignees = computed(() => useReportsStore().getAssignees);
</script>

<style lang="scss" scoped>
#info {
	text-align: left;

	label {
		font-weight: bold;
		color: hsl(230, 40%, 20%);
		font-size: 14px;

		margin-right: 5px;
		align-self: start;
	}

	> div {
		display: inline-flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.close-button {
		background-image: url("/src/assets/icons/close_2.svg");
		background-repeat: no-repeat;
		background-position: center;
		width: 24px;
		height: 24px;
	}

	.title > .content {
		font-size: 20px;
		font-weight: 500;
		align-self: center;
		word-break: normal;
	}

	.id {
		font-size: 14px;
		line-height: 2em;

		> label {
			font-size: 14px;
		}
	}

	.description {
		display: block;
		text-align: left;
		word-break: normal;
		white-space: pre-line;
		line-break: anywhere;
	}

	#technical {
		display: block;
		border-bottom: 1px solid hsl(240, 100%, 95%);
		padding: 0.5em 0;

		img {
			transition: 0.3s;
		}

		&.open {
			img {
				transition: 0.3s;
				transform: rotate(180deg);
			}

			.technical-info {
				max-height: initial;
				transition: max-height 0.3s ease-out;
			}
		}

		.technical-info {
			max-height: 0;
			overflow: hidden;
			line-height: 1.65em;

			.content {
				color: hsl(230, 45%, 75%);
				font-size: 14px;
			}

			> div {
				width: 100%;
				display: inline-flex;
				flex-wrap: nowrap;
				align-items: center;
				justify-content: space-between;
			}

			label {
				font-weight: 500;
			}

			.selector {
				flex-direction: column;
				align-items: flex-start;
			}
		}

		.technical-label {
			display: flex;
			justify-content: space-between;
			width: 100%;
			font-size: 16px;
			font-weight: bold;
			margin-top: 0.5em;
			cursor: pointer;
		}
	}

	.creator {
		display: inline-flex;
		flex-wrap: nowrap;
		align-items: center;
		font-size: 14px;
	}

	.screenshot {
		position: relative;
		width: 100%;
		height: 170px;
		margin: 0.4em 0;
		background-color: hsl(0, 0%, 50%);
		border: 2px solid hsl(240, 100%, 95%);
		overflow: hidden;
	}

	.url {
		line-height: 2em;
		white-space: nowrap;

		> .content {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 14px;

			a {
				text-decoration: none;
				color: hsl(230, 45%, 75%);

				&:focus-visible {
					outline: unset;
				}
			}
		}
	}

	.status {
		.content {
			text-align: center;
			padding: 2px 0px;
			color: hsl(0, 0%, 100%);
			background-color: hsl(0, 0%, 50%);
			border-radius: 30px;
			font-size: 12px;
		}
	}

	.deadline {
		white-space: nowrap;

		> label {
			margin: auto;
			margin-right: 10px;
		}

		.content {
			color: hsl(231, 45%, 75%);
			width: 100%;
		}
	}
	.grid1x2 {
		display: grid;
		grid-template-columns: auto auto;
		grid-template-rows: 1fr;
	}

	.assignes {
		label {
			min-width: 90px;
			margin-top: 6px;
		}
	}
}

input,
textarea {
	border: 1px solid hsl(264deg, 78%, 77%);
	border-radius: 0.5rem;
	padding: 0.5rem;

	&:focus,
	&:focus-visible,
	&:hover {
		border-color: hsl(265, 79%, 41%);
		outline-color: hsl(265, 79%, 41%);
	}

	&.error {
		border-color: red;
	}
}

.content-container {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	background: hsl(0, 0%, 100%) 0% 0% no-repeat padding-box;
	border: 1px solid hsl(240, 100%, 95%);
	border-radius: 16px;
	padding: 20px;
	box-shadow: hsla(0, 0%, 0%, 0.35) 10px 10px 10px -11px;
	position: relative;
}
</style>
