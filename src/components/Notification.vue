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
				{{ $d(dateFix(record.attributes.created_at), "short") }}

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

<script setup>
import { computed } from "@vue/reactivity";
import dateFix from "/src/util/dateFixISO";
import { useNotificationStore } from "/src/stores/notifications";
import { useMainStore } from "/src/stores/main";

const props = defineProps({
	id: {
		required: true,
		type: String,
		desc: "Invitation id",
	},
});

const notifications = useNotificationStore();

const record = computed(() => {
	return notifications.getInvitationById(props.id);
});

const accept = async () => {
	try {
		await notifications.accept(props.id);
		useMainStore().init();
	} catch (error) {
		console.log(error);
	}
};

const decline = async () => {
	try {
		await notifications.accept(props.id);
	} catch (error) {
		console.log(error);
	}
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
