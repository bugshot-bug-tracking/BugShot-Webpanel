<template>
	<NotificationTemplate>
		<template #header>
			<n-text>
				{{ $t("invited_to_join") }}
			</n-text>
			<n-text strong>{{ value.data.invited_to }}</n-text>
		</template>

		<template #footer>
			<n-text style="color: var(--bs-gray)">
				{{ $d(new Date(dateFix(value.data.created_at)), "short") }}

				{{ $t("by") }}

				<b style="font-weight: 600">{{ value.data.invited_by }}</b>
			</n-text>
		</template>

		<template #action>
			<Transition mode="out-in" :name="invitation.transition_direction">
				<div v-if="value.status === undefined && invitation.state === undefined">
					<n-button
						quaternary
						round
						type="success"
						mr-4
						@click="invitation.accept"
						:disabled="invitation.loading === 'declined'"
						:loading="invitation.loading === 'accepted'"
					>
						<template #icon>
							<Icon-Check color="var(--bs-green)" />
						</template>
					</n-button>

					<n-button
						quaternary
						round
						type="error"
						@click="invitation.decline"
						:disabled="invitation.loading === 'accepted'"
						:loading="invitation.loading === 'declined'"
					>
						<template #icon>
							<Icon-X color="var(--bs-red)" />
						</template>
					</n-button>
				</div>
				<div v-else>
					<n-tag
						v-if="value.status === 'accepted' || invitation.state === 'accepted'"
						type="success"
						round
					>
						{{ $t("accepted") }}
					</n-tag>

					<n-tag
						v-else-if="value.status === 'declined' || invitation.state === 'declined'"
						type="error"
						round
					>
						{{ $t("declined") }}
					</n-tag>
				</div>
			</Transition>
		</template>
	</NotificationTemplate>
</template>

<script setup lang="ts">
import { InvitationReceived } from "~/models/NotificationTypes/InvitationReceived";
import { useNotificationStore } from "~/stores/notifications";
import dateFix from "~/util/dateFixISO";

const props = defineProps({
	value: {
		type: Object as PropType<InvitationReceived>,
		required: true,
	},
	notification_id: {
		type: String,
		required: true,
	},
});

const store = useNotificationStore();

const invitation = reactive({
	state: undefined as undefined | "accepted" | "declined",
	loading: undefined as undefined | "accepted" | "declined",
	accept: async () => {
		invitation.transition_direction = "slide-right";
		invitation.loading = "accepted";

		try {
			await store.acceptInvitation(props.value, props.notification_id);
		} catch (error) {
			console.log(error);
		}

		invitation.state = "accepted";
	},
	decline: async () => {
		invitation.transition_direction = "slide-left";
		invitation.loading = "declined";

		try {
			await store.declineInvitation(props.value, props.notification_id);
		} catch (error) {
			console.log(error);
		}

		invitation.state = "declined";
	},
	transition_direction: "slide-right" as "slide-right" | "slide-left",
});
</script>
