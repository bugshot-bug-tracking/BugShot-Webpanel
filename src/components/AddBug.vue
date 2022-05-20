<template>
	<a class="btn bs bf-purple add-button" @click="tabOpen = true">
		<img src="../assets/icons/add.svg" alt="add" />
		{{ $t("add.bug") }}
	</a>

	<SideTab v-if="tabOpen" class="tab-shaddow">
		<form @submit.prevent="submit">
			<div class="top">
				<h4>{{ $t("new_bug_report") }}</h4>

				<img
					src="../assets/icons/classic_X.svg"
					alt="close"
					@click="tabOpen = false"
				/>
			</div>

			<Container>
				<ImageManager @update="imagesUpdate" />
			</Container>

			<Container class="gap-4">
				<div class="bs-input counted">
					<span>{{ `${data.designation.length}/50` }}</span>
					<input
						type="text"
						:placeholder="$t('bug_name')"
						v-model="data.designation"
						required
						minlength="5"
						maxlength="50"
					/>
				</div>

				<div class="bs-input counted">
					<span>{{ `${data.description.length}/1500` }}</span>
					<textarea
						:placeholder="$t('describe_problem')"
						v-model="data.description"
						rows="3"
						maxlength="1500"
					/>
				</div>

				<div class="datepicker">
					<div>{{ $t("pick_date") }}</div>

					<Datepicker
						v-model="data.deadline"
						:placeholder="$t('no_deadline')"
						@cleared="clearDeadline"
						:selectText="$t('select.select')"
						:cancelText="$t('cancel')"
					/>
				</div>

				<div class="priority">
					<div>{{ $t("set_priority") }}</div>

					<div class="options">
						<div>
							<input
								type="radio"
								name="priority-radio"
								value="1"
								id="i1"
								v-model="data.priority"
							/>
							<label for="i1" class="i i1">
								<span> {{ $t("minor") }} </span>
							</label>
						</div>
						<div>
							<input
								type="radio"
								name="priority-radio"
								value="2"
								id="i2"
								v-model="data.priority"
							/>
							<label for="i2" class="i i2">
								<span> {{ $t("normal") }} </span>
							</label>
						</div>
						<div>
							<input
								type="radio"
								name="priority-radio"
								value="3"
								id="i3"
								v-model="data.priority"
							/>
							<label for="i3" class="i i3">
								<span> {{ $t("important") }} </span>
							</label>
						</div>
						<div>
							<input
								type="radio"
								name="priority-radio"
								value="4"
								id="i4"
								v-model="data.priority"
							/>
							<label for="i4" class="i i4">
								<span> {{ $t("critical") }} </span>
							</label>
						</div>
					</div>
				</div>

				<div class="assign-to" v-if="false">
					<div>Assign to</div>
					<Assignes :list="[]" />
				</div>
			</Container>

			<LocalAttachments @update="attachmentsUpdate" />

			<button class="btn bs bf-green" type="submit">
				{{ $t("report_bug") + "!" }}
			</button>
		</form>
	</SideTab>

	<LoadingModal
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.show = false"
	/>

	<div class="outside-overlay" v-if="tabOpen" @click="tabOpen = false" />
</template>

<script setup>
import SideTab from "./SideTab.vue";
import Container from "./Container.vue";
import { reactive, ref } from "vue";
import Assignes from "./Assignes.vue";
import LocalAttachments from "./Attachments/LocalAttachments.vue";
import ImageManager from "./ImageManager.vue";
import toBase64 from "/src/util/toBase64";
import LoadingModal from "/src/components/Modals/LoadingModal.vue";
import axios from "axios";
import store from "../store";

const props = defineProps({
	id: {
		type: String,
		required: true,
		description: "Project id",
	},
});

const tabOpen = ref(false);

const data = reactive({
	designation: "",
	description: "",
	deadline: null,
	priority: 2,
	images: [],
	attachments: [],
});

const clearDeadline = () => {
	data.deadline = null;
};

const attachmentsUpdate = (files) => {
	data.attachments = files;
};
const imagesUpdate = (files) => {
	data.images = files;
};

const submit = async () => {
	console.log(data);

	try {
		loadingModal.show = true;
		loadingModal.state = 0;
		loadingModal.message = null;

		let status = store.getters["kanban/getFirstStatus"];

		// send bug data and get bug object
		let bug = await axios.post(`statuses/${status.id}/bugs`, {
			designation: data.designation,
			description: data.description,
			priority_id: data.priority,
			...(data.deadline
				? {
						deadline: new Date(data.deadline)
							.toISOString()
							.slice(0, -1),
				  }
				: {}),
		});

		// get the data from response
		bug = bug.data.data;

		console.log(bug);

		// using the bug id send screenshots one-by-one
		for (const file of data.images) {
			let screen = await axios.post(`bugs/${bug.id}/screenshots`, {
				base64: btoa(await toBase64(file)),
			});
		}

		// using the bug id send attachments one-by-one
		for (const file of data.attachments) {
			let screen = await axios.post(`bugs/${bug.id}/attachments`, {
				designation: file.name,
				base64: btoa(await toBase64(file)),
			});
		}

		loadingModal.state = 1;
		loadingModal.message = `Bug report created!`;

		store.dispatch("kanban/loadBugs");

		setTimeout(() => {
			loadingModal.show = false;
			tabOpen.value = false;

			resetData();
		}, 4000);
	} catch (error) {
		loadingModal.state = 2;
		loadingModal.message = null;

		console.log(error);

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
			loadingModal.message = null;
		}, 4000);
	}
};

const resetData = () => {
	data.designation = "";
	data.description = "";
	data.deadline = null;
	data.priority = 2;
	data.images = [];
	data.attachments = [];
};

const loadingModal = reactive({
	show: false,
	state: 0,
	message: null,
});
</script>

<style lang="scss" scoped>
.add-button {
	display: flex;
	align-items: center;
	gap: 6px;

	> img {
		filter: invert(1);
		height: 1.5rem;
	}
}

.top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.25rem 1rem;

	font-size: 1.4rem;

	img {
		width: 20px;
		height: 20px;
		cursor: pointer;
	}
}

.priority {
	text-align: start;
	font-weight: bold;
	font-size: 14px;

	input {
		display: none;

		&:checked + label {
			background-color: currentcolor;

			span {
				color: white;
			}
		}
	}

	.options {
		display: flex;
		justify-content: space-around;
	}

	.i {
		font-weight: normal;
		font-size: 12px;
		line-height: 16px;
		border-radius: 30px;
		width: fit-content;
		height: fit-content;

		padding: 3px 10px;
		user-select: none;
		border: 2px solid;
		text-transform: capitalize;
		cursor: pointer;

		&.i1 {
			color: hsl(188, 80%, 47%);
		}
		&.i2 {
			color: hsl(218, 80%, 47%);
		}
		&.i3 {
			color: hsl(32, 100%, 67%);
		}
		&.i4 {
			color: hsl(0, 90%, 60%);
		}
	}
}
.datepicker {
	text-align: start;
	font-weight: bold;
	font-size: 14px;
}

.assign-to {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-weight: bold;
	font-size: 14px;
}

.counted {
	margin-top: 1rem;

	span {
		position: absolute;
		top: -1.25rem;
		right: 0.5rem;
		font-size: 12px;
	}
}

.tab-shaddow {
	box-shadow: -10px 0px 24px hsla(231, 42%, 18%, 0.11);
}

.outside-overlay {
	position: fixed;
	width: 100vw;
	height: 100vh;
	background: #00000073;
	top: 0;
	left: 0;
	z-index: 1;
}
</style>
