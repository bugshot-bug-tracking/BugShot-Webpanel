<template>
	<div class="entry">
		<div class="main">
			<div class="top">
				{{ $t("invited_to_join") }}

				<span>
					{{ record.attributes.invitable.attributes.designation }}
				</span>
			</div>

			<div class="bottom">
				{{ date(record.attributes.created_at) }}

				{{ $t("by") }}

				{{ record.attributes.sender.attributes.first_name }}
			</div>
		</div>

		<div class="buttons">
			<a @click="accept">
				<img
					src="../assets/icons/check.svg"
					alt="Accept"
					class="accept"
				/>
			</a>

			<a @click="decline">
				<img
					src="../assets/icons/classic_X.svg"
					alt="Decline"
					class="decline"
				/>
			</a>
		</div>
	</div>
</template>

<script>
import { computed } from "@vue/reactivity";
import store from "../store";
import axios from "axios";

export default {
	name: "Notification",
	props: {
		id: {
			required: true,
			type: String,
			desc: "Invitation id",
		},
	},
	setup(props) {
		const record = computed(() => {
			return store.getters.getInvitationById(props.id);
		});

		const date = (dateString) => {
			if (dateString === "" || dateString === null) return "";
			if (dateString.slice(-1).toUpperCase() !== "Z") dateString += "Z";

			return new Date(dateString).toLocaleString();
		};

		const accept = async () => {
			try {
				let user = store.getters.getUser;
				await axios.get(
					`users/${user.id}/invitations/${props.id}/accept`
				);

				store.commit("REMOVE_INVITATION", props.id);
				store.dispatch("init", props.id);
			} catch (error) {
				console.error(error);
			}
		};

		const decline = async () => {
			try {
				let user = store.getters.getUser;

				await axios.get(
					`user/${user.id}/invitations/${props.id}/accept`
				);

				store.commit("REMOVE_INVITATION", props.id);
				store.dispatch("init", props.id);
			} catch (error) {
				console.error(error);
			}
		};

		return {
			record,
			date,
			accept,
			decline,
		};
	},
};
</script>

<style lang="scss" scoped>
.entry {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 0px;

	.main {
		display: flex;
		flex-direction: column;
		width: 80%;

		.top {
			text-align: left;
			font-size: 14px;

			span {
				font-size: 16px;
				font-weight: bold;
			}
		}

		.bottom {
			font-size: small;
			color: #9ba5d7;
			text-align: left;
		}
	}

	.buttons {
		display: flex;
		justify-content: space-around;
		width: 20%;

		> * {
			width: 28px;
			height: 28px;
			border-radius: 100%;
			cursor: pointer;

			&:hover {
				background-color: hsl(230, 43%, 73%, 0.2);
			}
		}

		.accept {
			width: 16px;
			// color: #18D992;
			filter: brightness(0) saturate(1) invert(63%) sepia(74%)
				saturate(493%) hue-rotate(104deg) brightness(96%) contrast(88%);
		}
		.decline {
			width: 16px;
			// color: #F23838; red
			filter: brightness(0) saturate(1) invert(46%) sepia(28%)
				saturate(5216%) hue-rotate(331deg) brightness(87%)
				contrast(121%);
		}
	}
}
</style>
