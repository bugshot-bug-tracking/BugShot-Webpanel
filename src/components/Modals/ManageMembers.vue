<template>
	<a
		class="bs-btn purple"
		@click="modal.open"
		:class="{ loading: modal.loading }"
	>
		{{ $t("member", 2) }}
	</a>

	<MyModal v-model="modal.show" :close="modal.close" z-100>
		<ModalTemplate @close="modal.close">
			<template #header-text> {{ $t("manage_members") }} </template>

			<MemberList
				:list="list"
				@add="inviteModal.open"
				@edit="inviteModal.openEdit"
				@delete="deleteModal.open"
			/>

			<MemberList
				:list="pending_list"
				invitationMode
				@delete="deleteModal.openInvitation"
				mt-4
				pt-4
				class="bs-bt"
			/>
		</ModalTemplate>
	</MyModal>

	<InviteMemberModal
		:show="inviteModal.show"
		@close="inviteModal.close"
		@submit="inviteModal.submit"
		@change="inviteModal.change"
		:user="inviteModal.user"
		:editMode="inviteModal.editMode"
	/>

	<DeleteModal2
		:show="deleteModal.show"
		:header="deleteModal.header"
		:text="deleteModal.text"
		@close="deleteModal.clear"
		@delete="deleteModal.invMode ? deleteInvitation() : deleteUser()"
	/>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.clear"
	/>
</template>

<script setup lang="ts">
import { User } from "~/models/User";

const props = defineProps({
	list: {
		type: Array,
		required: true,
		default: [],
	},

	pending_list: {
		type: Array,
		required: false,
		default: [],
	},

	add: {
		type: Function,
		required: true,
	},
	edit: {
		type: Function,
		required: true,
	},
	delete: {
		type: Function,
		required: true,
	},
	deleteInvitation: {
		type: Function,
		required: false,
	},

	preOpenCall: {
		type: Function,
		required: false,
	},

	postOpenCall: {
		type: Function,
		required: false,
	},
});

const { t } = useI18n();

const modal = reactive({
	show: false,
	loading: false,
	open: async () => {
		if (modal.loading === true) return;
		modal.loading = true;
		if (props.preOpenCall) await props.preOpenCall();
		modal.show = true;
		modal.loading = false;
	},
	close: async () => {
		if (modal.loading === true) return;
		modal.loading = true;
		if (props.postOpenCall) await props.postOpenCall();
		modal.show = false;
		modal.loading = false;
	},
});

const inviteModal = reactive({
	show: false,
	open: () => {
		inviteModal.show = true;
		inviteModal.user = undefined;
		inviteModal.editMode = false;
	},
	close: () => {
		inviteModal.show = false;
		inviteModal.user = undefined;
		inviteModal.editMode = false;
	},
	openEdit: (user: User) => {
		inviteModal.editMode = true;
		inviteModal.user = user;
		inviteModal.show = true;
	},
	user: {} as User | undefined,
	editMode: false,

	submit: async (user: { email: string; role_id: Number }) => {
		try {
			loadingModal.show = true;

			await props.add(user.email, user.role_id);

			loadingModal.state = 1;
			loadingModal.message = t("invitation sent");
		} catch (error: any) {
			console.log(error);

			loadingModal.state = 2;
			loadingModal.message = error.response.data.data?.message.replace(
				":",
				""
			);
		}
	},
	change: async (value: {
		old: User;
		new: { email: string; role_id: Number };
	}) => {
		console.log(value);

		try {
			loadingModal.show = true;

			await props.edit(value.old.id, value.new.role_id);

			loadingModal.state = 1;
			loadingModal.message = t("user_role_updated");
		} catch (error: any) {
			console.log(error);

			loadingModal.state = 2;
			loadingModal.message = error.response.data.data?.message.replace(
				":",
				""
			);
		}
	},
});

const loadingModal = reactive({
	show: false,
	state: 0,
	message: "",
	clear: () => {
		loadingModal.show = false;
		loadingModal.state = 0;
		loadingModal.message = "";
	},
});

const deleteModal = reactive({
	show: false,
	text: "[PH]",
	header: t("want_to_remove"),
	callback: null,
	entity: {} as User | undefined | any, //a place to store the data object for after the modal confirmation
	invMode: false,
	open: (user: User) => {
		deleteModal.show = true;

		deleteModal.text = `${user.attributes.first_name} ${user.attributes.last_name}`;

		deleteModal.entity = user as User;
	},
	openInvitation: (invitation: any) => {
		deleteModal.show = true;

		deleteModal.text = `${invitation.attributes.target_email}`;

		deleteModal.entity = invitation as any;
		deleteModal.invMode = true;
	},
	clear: () => {
		deleteModal.show = false;
		deleteModal.text = "";
		deleteModal.callback = null;
		deleteModal.entity = undefined;
		deleteModal.invMode = false;
	},
});

const deleteUser = async () => {
	try {
		loadingModal.show = true;

		if (deleteModal.entity) await props.delete(deleteModal.entity.id);

		loadingModal.state = 1;
		loadingModal.message = t("user_removed");
	} catch (error: any) {
		console.log(error);

		loadingModal.state = 2;
		loadingModal.message = error.response.data.data?.message.replace(
			":",
			""
		);
	}
};

const deleteInvitation = async () => {
	try {
		loadingModal.show = true;

		console.log(deleteModal.entity);
		if (deleteModal.entity && props.deleteInvitation)
			await props.deleteInvitation(deleteModal.entity.id);

		loadingModal.state = 1;
		loadingModal.message = t("invitation_removed") + "!";
	} catch (error: any) {
		console.log(error);

		loadingModal.state = 2;
		loadingModal.message = error.response.data.data?.message.replace(
			":",
			""
		);
	}
};
</script>
