<!-- Change this to reflect different invitation types -->

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

		<div class="buttons" v-if="record.status == undefined">
			<a @click="accept">
				<img src="/src/assets/icons/check.svg" alt="Accept" class="accept" />
			</a>

			<a @click="decline">
				<img src="/src/assets/icons/close_2.svg" alt="Decline" class="decline" />
			</a>
		</div>

		<div v-else>
			<n-tag v-if="record.status === 'accepted'" type="success" round>
				{{ $t("accepted") }}
			</n-tag>

			<n-tag v-else type="error" round> {{ $t("declined") }} </n-tag>
		</div>
	</div>
</template>

<script setup lang="ts">
import dateFix from "~/util/dateFixISO";
import { useNotificationStore } from "~/stores/notifications";
import { useMainStore } from "~/stores/main";
import { Invitation } from "~/models/Invitation";
import { Project } from "~/models/Project";
import { Company } from "~/models/Company";
import { Organization } from "~/models/Organization";

const props = defineProps({
	record: {
		required: true,
		type: Object as PropType<Invitation>,
		desc: "Notification data",
	},
});

const notifications = useNotificationStore();

const router = useRouter();

const accept = async () => {
	try {
		await notifications.accept(props.record.id);
		await useMainStore().initOrganizations();

		switch (props.record.attributes.invitable.type) {
			case "Project":
				router.push({
					name: "project",
					params: {
						organization_id: (props.record.attributes.invitable as Project).attributes
							.company.attributes.organization_id,
						company_id: (props.record.attributes.invitable as Project).attributes
							.company.id,
						project_id: (props.record.attributes.invitable as Project).id,
					},
				});

				break;

			case "Company":
				router.push({
					name: "company",
					params: {
						organization_id: (props.record.attributes.invitable as Company).attributes
							.organization.id,
						company_id: (props.record.attributes.invitable as Company).id,
					},
				});

				break;

			case "Organization":
				router.push({
					name: "organization-home",
					params: {
						organization_id: (props.record.attributes.invitable as Organization).id,
					},
				});

				break;

			default:
				break;
		}
	} catch (error) {
		console.log(error);
	}
};

const decline = async () => {
	try {
		await notifications.decline(props.record.id);
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
	padding: 0.5rem 0px;

	.main {
		display: flex;
		flex-direction: column;
		width: 80%;

		.top {
			text-align: left;
			font-size: 0.875rem;

			span {
				font-size: 1rem;
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
			width: 1.75rem;
			height: 1.75rem;
			border-radius: 100%;
			cursor: pointer;

			&:hover {
				background-color: hsl(230, 43%, 73%, 0.2);
			}
		}

		.accept {
			width: 1.5rem;
			height: 1.5rem;
			// color: #18D992;
			filter: brightness(0) saturate(1) invert(63%) sepia(74%) saturate(493%)
				hue-rotate(104deg) brightness(96%) contrast(88%);
		}
		.decline {
			width: 1.5rem;
			height: 1.5rem;
			// color: #F23838; red
			filter: brightness(0) saturate(1) invert(46%) sepia(28%) saturate(5216%)
				hue-rotate(331deg) brightness(87%) contrast(121%);
		}
	}
}
</style>
