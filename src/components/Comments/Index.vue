<template>
	<Container>
		<div class="comments-component">
			<div class="comments-top">
				<div class="header">
					<span>Comments</span>
					<div class="btn refresh-button" @click="update" />
				</div>
			</div>

			<div class="comments-center">
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
					<span>Add comment</span>
					<div>{{ chars.length }} / 250</div>
				</div>

				<textarea
					id="comment-input"
					rows="3"
					maxlength="250"
					placeholder="Write comment..."
					v-model="chars"
				/>
				<div class="btn comment-send-button" @click="postComment">
					Add Comment
				</div>
			</div>
		</div>
	</Container>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { nextTick, onMounted, watch } from "@vue/runtime-core";
import Message from "./Message.vue";
import Container from "../Container.vue";
import store from "../../store";
import axios from "axios";

export default {
	components: { Message, Container },
	name: "Comments",
	props: {
		comments: {
			required: true,
			type: Array,
		},
		bug_id: {
			required: true,
			type: String,
		},
	},
	emits: ["loading"],
	setup(props, context) {
		const chars = ref("");
		const msgs = ref(null);

		const user = computed(() => {
			return store.getters.getUser;
		});

		const postComment = () => {
			try {
				axios
					.post(`bugs/${props.bug_id}/comments`, {
						bug_id: props.bug_id,
						content: chars.value,
					})
					.then(() => {
						update();
						chars.value = "";
					});
			} catch (error) {
				console.error(error);
			}
		};

		const update = () => {
			store.dispatch("fetchComments", props.bug_id);
		};

		watch(
			props,
			() => {
				nextTick(() => {
					msgs.value?.parentNode.scrollBy({
						top: msgs.value?.scrollHeight,
						behavior: "smooth",
					});
				});
			},
			{ deep: true }
		);

		return {
			user,
			chars,
			msgs,
			postComment,
			update,
		};
	},
};
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
				background-image: url("../../assets/icons/refresh.svg");
				background-repeat: no-repeat;
				background-position: center;
				width: 24px;
				height: 24px;

				&:hover {
					filter: invert(55%) sepia(54%) saturate(630%)
						hue-rotate(106deg) brightness(112%) contrast(90%);
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

		scrollbar-color: hsl(158, 80%, 47%) hsl(240, 100%, 95%);
		scrollbar-width: thin;

		/* width */
		&::-webkit-scrollbar {
			width: 6px;
		}

		/* Track */
		&::-webkit-scrollbar-track {
			background: hsl(240, 100%, 95%) 0% 0% no-repeat padding-box;
			border-radius: 8px;
		}

		/* Handle */
		&::-webkit-scrollbar-thumb {
			background: hsl(158, 80%, 47%) 0% 0% no-repeat padding-box;
			border-radius: 8px;
		}

		/* Handle on hover */
		&::-webkit-scrollbar-thumb:hover {
			background: hsl(158, 80%, 37%) 0% 0% no-repeat padding-box;
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
		}

		> #comment-input {
			width: 100%;
			border: 1px solid hsl(265, 80%, 80%);
			border-radius: 12px;
			padding: 0px 10px;
			font-size: 14px;
			transition: ease-out 0.1s;
			resize: none;
			margin: 10px 0;
			line-height: 1.5;

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
