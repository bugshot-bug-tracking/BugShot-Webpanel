<template>
	<Container>
		<div class="comments-component">
			<div class="comments-top">
				<div class="header">
					<span>{{ $t("comment", 2) }}</span>

					<div class="btn refresh-button" @click="update" />
				</div>
			</div>

			<div class="comments-center bs-scroll s-green">
				<div class="content" ref="msgs" v-if="comments.length > 0">
					<Message
						v-for="comment of comments"
						:key="comment.id"
						:content="comment.attributes.content"
						:timestamp="comment.attributes.created_at"
						:creator="{
							first_name: comment.attributes.user.first_name,
							last_name: comment.attributes.user.last_name,
						}"
						:sender="user.id === comment.attributes.user.id ? 0 : 1"
					/>

					<div />
				</div>
			</div>

			<div class="comments-bottom">
				<div class="comments-bottom-header">
					<span>{{ $t("add.comment") }}</span>

					<div :class="{ 'over-limit': messageLength > 250 }">
						{{ messageLength }} / 250
					</div>
				</div>

				<vue-tribute :options="options" style="width: 100%">
					<div
						id="comment-input"
						contenteditable="true"
						ref="message"
						class="bs-scroll s-purple"
						data-max-length="250"
						@input="setLength"
						@paste="paste"
					/>
				</vue-tribute>

				<div
					:hidden="messageLength <= 250"
					style="
						font-size: 12px;
						color: red;
						align-self: start;
						margin-top: -6px;
					"
				>
					{{ $t("limits.characters_exceeded") }}
				</div>

				<div
					class="btn comment-send-button text-capitalize"
					:class="{ disabled: messageLength > 250 }"
					@click="postComment"
				>
					{{ $t("add.comment") }}
				</div>
			</div>
		</div>
	</Container>
</template>

<script setup>
import { useProjectStore } from "~/stores/project";
import axios from "axios";
import { VueTribute } from "vue-tribute";
import colors from "~/util/colors";
import { maxlengthContentEditable } from "/src/util/maxlength-contenteditable.js";
import { useAuthStore } from "/src/stores/auth";

const props = defineProps({
	bug_id: {
		required: true,
		type: String,
	},
	comments: {
		required: true,
		type: Array,
	},
});

const store = useProjectStore();

const message = ref("");
const msgs = ref(null);
const lock = ref(false); // prevent send button spam
const messageLength = ref(0);

const user = computed(() => {
	return useAuthStore().getUser;
});

const projectTeam = computed(() => {
	return [store.getProject.attributes.creator, ...store.getProjectUsers];
});

// tributejs options
const options = reactive({
	trigger: "@",

	// the list from where the suggestions ar taken (key and value are mandatory for search)
	values: projectTeam.value?.map((x) => ({
		key: `${x.attributes.first_name} ${x.attributes.last_name}`,
		...x,
		value: x.id,
	})),

	// inserted template in the input div
	selectTemplate: (item) => {
		return `<span class="comment-tag" contenteditable="false" value=${item.original.value}>@${item.original.key} <p hidden>$${item.original.value}$$</p></span>`;
	},

	// template used for the suggest menu items
	menuItemTemplate: (item) => {
		console.log(item);

		return `
			<div class="avatar"
				style="background-color: ${
					colors[
						(item.original.attributes.first_name.charCodeAt(0) +
							item.original.attributes.last_name.charCodeAt(0)) %
							7
					]
				};"
			>
				${
					item.original.attributes.first_name[0] +
					item.original.attributes.last_name[0]
				}
			</div>
			<div class="name">
				${
					item.original.attributes.first_name +
					" " +
					item.original.attributes.last_name
				}
			</div>
		`;
	},

	// class added on the selected item (includes hover action)
	selectClass: "tag-select",

	// overall menu class
	containerClass: "tag-container",
});

const postComment = async () => {
	let content = message.value.innerText;

	if (content.length < 1 || lock.value) return;
	lock.value = true;

	try {
		const tagNodes = message.value.querySelectorAll(
			"span[value].comment-tag"
		);

		let taggedUsers = [];
		tagNodes.forEach((node) => {
			taggedUsers.includes(node.attributes.value.value)
				? null
				: taggedUsers.push(node.attributes.value.value);
			node.innerText = `<${node.attributes.value.value}$${node.innerText}>`;
		});

		content = message.value.innerText;
		message.value.innerText = "";
		messageLength.value = 0;

		await axios
			.post(`bugs/${props.bug_id}/comments`, {
				bug_id: props.bug_id,
				content: content,
				tagged: taggedUsers.map((x) => ({ user_id: x })),
			})
			.then(() => {
				update();
				lock.value = false;
			});
	} catch (error) {
		lock.value = false;

		console.log(error);
	}
};

const paste = (event) => {
	event.preventDefault();

	var text = event.clipboardData.getData("text/plain");

	document.execCommand("insertText", false, text);
};

const setLength = (event) => {
	// textContent takes into consideration the hidden characters so that the limit includes the overhead for saving
	messageLength.value = event.target.textContent.length;
};

const update = () => {
	store.fetchComments(props.bug_id);
};

const scrollToBottom = () => {
	nextTick(() => {
		msgs.value?.parentNode.scrollBy({
			top: msgs.value?.scrollHeight,
			behavior: "smooth",
		});
	});
};

scrollToBottom();

watch(props, () => scrollToBottom(), { deep: true });

onMounted(() => {
	maxlengthContentEditable();
});
</script>

<style lang="scss" scoped>
.comments-component {
	height: 500px;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	.comments-top {
		.header {
			display: inline-flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;

			> span {
				font-weight: 500;
				font-size: 20px;
			}

			> .refresh-button {
				background-image: url("/src/assets/icons/refresh.svg");
				background-repeat: no-repeat;
				background-position: center;
				width: 24px;
				height: 24px;

				&:hover {
					filter: brightness(0) saturate(1) invert(63%) sepia(74%)
						saturate(493%) hue-rotate(104deg) brightness(96%)
						contrast(88%);
				}
			}
		}
	}

	.comments-center {
		margin: 10px 0;
		height: 100%;
		overflow: auto;
		scroll-behavior: auto;

		> .content {
			padding-right: 10px;
		}
	}

	.comments-bottom {
		display: flex;
		flex-direction: column;
		align-items: flex-end;

		.comments-bottom-header {
			display: inline-flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			margin: 10px 0px;

			> span {
				font-weight: 500;
			}

			> div {
				font-size: 12px;
			}

			.over-limit {
				color: red;
			}
		}

		#comment-input {
			width: 100%;
			border: 1px solid hsl(265, 80%, 80%);
			border-radius: 12px;
			padding: 4px 10px;
			font-size: 14px;
			transition: ease-out 0.1s;
			resize: none;
			margin-bottom: 10px;
			line-height: 1.5;
			text-align: left;
			height: 75px;
			max-height: 75px;

			appearance: textarea;

			&::-webkit-scrollbar {
				display: none;
			}

			&:focus-visible {
				outline: unset;
				border: 1px solid hsl(265, 80%, 50%);
				transition: ease-in 0.1s;
			}
		}

		.comment-send-button {
			background-color: hsl(158, 80%, 47%);
			color: hsl(0, 0%, 100%);
			border-radius: 20px;
			font-size: 14px;
			font-weight: 700;

			&:hover {
				background: hsl(158, 80%, 37%);
				color: hsl(0, 0%, 100%);
			}
		}
	}
}
</style>

<style lang="scss">
.comment-tag {
	background: #9ba5d7;
	border-radius: 4px;
	padding: 1px 2px;
	color: white;
	white-space: nowrap;
	font-size: 13px;
}

.tag-container {
	z-index: 20;

	ul {
		list-style: none;
		margin: unset;
		padding: unset;
		box-shadow: 0px 3px 6px #00000029;
		border: 1px solid #eee5fc;
		background-color: #fff;

		li {
			padding: 8px 20px 8px 8px;
			display: flex;
			align-items: center;
			gap: 8px;
			transition: 0.25s;
			max-width: 300px;
		}
	}

	.avatar {
		color: hsl(0, 0%, 100%);
		background-color: hsl(265, 80%, 50%);
		font-size: 12px;
		padding: 8px;
		border-radius: 25px;
		height: 32px;
		width: 32px;

		text-align: center;
		text-transform: uppercase;

		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.tag-select {
	background-color: #c2f8e4;
	padding: 8px 8px 8px 20px !important;
}

.tribute-container {
	z-index: 20;
}
</style>
