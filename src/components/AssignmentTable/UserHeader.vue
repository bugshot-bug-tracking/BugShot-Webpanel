<template>
	<div flex items-center gap-2>
		<Avatar
			:first_name="first_name"
			:last_name="last_name"
			size="XS"
			class="mt-0"
		/>

		<b>
			{{ first_name }}
			{{ last_name }}
		</b>

		<span class="black-to-gray">
			{{ email }}
		</span>

		<RolePin v-if="owner" :text="$t('owner')" :preset="'owner'" />

		<RolePin
			v-if="role_text"
			:text="$t('roles.' + role_text.toLocaleLowerCase())"
		/>

		<div
			ml-a
			flex
			items-center
			gap-2
			cursor-pointer
			v-if="removable && !owner"
		>
			<img
				:src="
					current_user
						? '/src/assets/icons/logout.svg'
						: '/src/assets/icons/delete.svg'
				"
				alt="trash can"
				class="black-to-red"
			/>

			<span class="text-to-red" @click="emit('remove')">
				{{ current_user ? $t("leave") : $t("remove_member") }}
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps({
	first_name: {
		type: String,
		required: true,
	},

	last_name: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
	},

	role_text: {
		type: String,
		required: false,
		default: undefined,
	},

	owner: {
		type: Boolean,
		required: false,
		default: false,
		description: "Used to show the owner pin",
	},

	removable: {
		type: Boolean,
		required: false,
		default: true,
		description: "Flag for showing remove button",
	},

	current_user: {
		type: Boolean,
		required: false,
		default: false,
		description: "Flag for showing the proper remove message",
	},
});

const emit = defineEmits(["remove"]);
</script>

<style scoped></style>
