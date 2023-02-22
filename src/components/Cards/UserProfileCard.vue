<template>
	<div class="bs-container">
		<div class="profile-header">
			<Avatar :size="'XL'" :first_name="first_name" :last_name="last_name" />

			<div text-start>
				<b text-5>{{ first_name }} {{ last_name }}</b>

				<p class="black-to-gray">{{ email }}</p>

				<hr my-2 />

				<p class="black-to-gray">
					<b>{{ $t("member_since") }}</b>
					{{ $d(dateFix(created_at), "short") }}
				</p>
			</div>
		</div>

		<div class="profile-main" text-start my-4>
			<b class="black-to-gray">{{ $t("member_plan") }}</b>

			<hr my-2 />
		</div>

		<div class="profile-footer bs-bt">
			<div ml-a flex items-center gap-2 cursor-pointer justify-between py-2 gap-1>
				<div></div>

				<div flex>
					<img
						:src="'/src/assets/icons/delete.svg'"
						alt="trash can"
						class="black-to-red"
					/>

					<b>
						{{ $t("remove_member") }}
					</b>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import dateFix from "~/util/dateFixISO";

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
	created_at: {
		type: String,
		required: true,
	},
});
</script>

<style lang="scss" scoped>
.profile-header {
	display: flex;
	gap: 1rem;
}
</style>
