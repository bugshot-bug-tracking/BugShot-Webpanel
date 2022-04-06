<template>
	<Container>
		<div id="info" class="d-flex flex-column no-wrap">
			<div class="justify-content-between mb-2 align-items-start">
				<div class="title">
					<div class="content">{{ bug.attributes.designation }}</div>
				</div>

				<div class="btn close-button" @click="$emit('close')" />
			</div>

			<div class="id">
				<label> {{ $t("id") + ":" }} </label>
				<div class="content">{{ bug.attributes.ai_id }}</div>
			</div>

			<div class="creator">
				<label>{{ $t("creator") + ":" }}</label>

				<div class="content">
					<div class="name">
						{{
							`${bug.attributes.creator.attributes.first_name} ${bug.attributes.creator.attributes.last_name}`
						}}
					</div>

					<div class="date">
						{{ dateFix(bug.attributes.created_at) }}
					</div>
				</div>
			</div>

			<div
				class="screenshot"
				v-if="bug.screenshots ? bug.screenshots.length > 0 : false"
			>
				<Screenshot
					:screenshots="bug.screenshots ? bug.screenshots : []"
					:priority="bug.attributes.priority.id"
				/>
			</div>

			<div class="url" v-if="bug.attributes.url">
				<label>{{ $t("url") + ":" }}</label>
				<div class="content">
					<a :href="bug.attributes.url" target="_blank">
						{{ bug.attributes.url }}
					</a>
				</div>
			</div>

			<div class="description" v-if="bug.attributes.description">
				<label>{{ $t("description") + ":" }}</label>
				<div class="content">{{ bug.attributes.description }}</div>
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
					<img src="../assets/icons/caret-down-fill.svg" />
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

			<div class="grid1x2 my-3">
				<div class="grid1x2">
					<label>{{ $t("priority") + ":" }}</label>

					<PriorityChange
						:priority="bug.attributes.priority.id"
						class="content"
						:lock="false"
						@change="changePriority"
					/>
				</div>

				<div class="grid1x2 status">
					<label>{{ $t("status") + ":" }}</label>

					<div class="content status">
						{{ status.attributes.designation }}
					</div>
				</div>
			</div>

			<div class="deadline">
				<label>{{ $t("deadline") + ":" }}</label>

				<div class="content">
					<Datepicker
						v-model="datePicker"
						:placeholder="$t('no_deadline')"
						@cleared="clearDeadline"
						@closed="changeDeadline"
						:selectText="$t('select.select')"
						:cancelText="$t('cancel')"
					/>
				</div>
			</div>

			<div class="assignes my-3">
				<label>{{ $t("assigned_to") + ":" }}</label>

				<div class="content">
					<Assignes
						:list="bug.attributes.users"
						@add="assignShow = true"
					/>
				</div>
			</div>
		</div>
	</Container>

	<AssignModal v-if="assignShow" :id="bug_id" @close="assignShow = false" />
</template>

<script setup>
import Container from "./Container.vue";
import Screenshot from "./Screenshot.vue";
import PriorityChange from "./PriorityChange.vue";
import Datepicker from "vue3-date-time-picker";
import Assignes from "./Assignes.vue";
import AssignModal from "./AssignModal.vue";
import dateFix from "@/util/dateFixISO";
import { ref } from "@vue/reactivity";
import store from "../store";

const emit = defineEmits(["close"]);
const props = defineProps({
	bug: {
		required: true,
		type: Object,
	},
	status: {
		required: true,
		type: Object,
	},
});

const open = ref(false);

const datePicker = ref(dateFix(props.bug.attributes.deadline));

const changePriority = (value) => {
	store.dispatch("kanban/syncBug", {
		id: props.bug.id,
		changes: {
			priority_id: value,
		},
	});
};

const clearDeadline = () => {
	store.dispatch("kanban/syncBug", {
		id: props.bug.id,
		changes: {
			deadline: null,
		},
	});
};

const changeDeadline = () => {
	let newDate = datePicker.value
		? new Date(datePicker.value).toISOString()
		: null;

	if (props.bug.attributes.deadline != null) {
		let bug_deadline = props.bug.attributes.deadline;

		if (bug_deadline.match(/[z]$/i) == null) bug_deadline += "Z";

		let deadline = new Date(bug_deadline).toISOString();

		if (newDate && newDate === deadline) return;
	}

	store.dispatch("kanban/syncBug", {
		id: props.bug.id,
		changes: {
			deadline: newDate,
		},
	});
};

const assignShow = ref(false);
</script>

<style lang="scss" scoped>
#info {
	text-align: left;

	label {
		font-weight: bold;
		color: hsl(230, 40%, 20%);
		font-size: 14px;
		text-transform: capitalize;
		margin-right: 5px;
		align-self: start;
	}

	> div {
		display: inline-flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.close-button {
		background-image: url("../assets/icons/classic_X.svg");
		background-repeat: no-repeat;
		background-position: center;
		width: 24px;
		height: 24px;
	}

	.title > .content {
		font-size: 20px;
		font-weight: 500;
		align-self: center;
		word-break: break-all;
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
		word-break: break-all;
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

		> .content {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 14px;

			a {
				text-decoration: none;
				color: hsl(230, 45%, 75%);
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
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
	}

	.assignes {
		label {
			min-width: 90px;
			margin-top: 6px;
		}
	}
}
</style>

<style lang="scss">
@import "vue3-date-time-picker/dist/main.css";

.dp__select {
	color: #18b984;
}
</style>
