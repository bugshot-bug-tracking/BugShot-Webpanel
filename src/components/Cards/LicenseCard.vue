<template>
	<n-card
		:segmented="{
			content: true,
			footer: true,
		}"
		class="license-card"
	>
		<div flex justify-between items-start>
			<div flex gap-4 items-center text-start>
				<n-checkbox
					:value="id"
					@update:checked="emit('update:checkbox', $event)"
					v-if="show_checkbox"
				/>

				<div>
					<p>{{ $t("license") }}:</p>
					<p text-6 flex gap-4 items-center>
						<b>{{ license_name }}</b>

						<span style="color: var(--bs-purple)" v-if="external" text-5>
							({{ $t("external") }})
						</span>
					</p>
				</div>
			</div>

			<div text-4 text-end>
				<p style="color: var(--bs-green)" v-if="assigned_on">
					<b>{{ $t("assigned_on") }}</b>
					<span>
						{{ assigned_on }}
					</span>
				</p>
				<p v-else style="color: var(--bs-red)">
					<b>{{ $t("unassigned") }}</b>
				</p>

				<p style="color: var(--bs-gray); font-size: 0.875rem">
					<b>{{ $t("available_until") }} </b>
					<span>
						{{ available_until }}
					</span>
				</p>
			</div>
		</div>

		<template #footer>
			<div flex justify-between>
				<div flex gap-4 items-center text-start>
					<n-checkbox opacity-0 v-if="show_checkbox" />

					<div flex gap-4 text-4 v-if="!quantity">
						<p>
							{{ $t("team_member_using_it") }}
						</p>

						<div v-if="user_name || user_email">
							<b>{{ user_name }}</b>
							<p>{{ user_email }}</p>
						</div>
						<div v-else>-</div>
					</div>

					<div flex gap-4 text-4 v-else>
						<p>{{ $t("assignable_licenses", quantity) }} :</p>
						<b>{{ quantity }}</b>
					</div>
				</div>

				<div>
					<slot name="button">
						<n-button
							strong
							text
							type="error"
							@click="emit('unassign')"
							v-if="assigned_on"
						>
							<template #icon>
								<img
									src="/src/assets/icons/delete.svg"
									alt="trash can"
									w-5
									h-5
									class="black-to-red"
								/>
							</template>

							{{ $t("unassign_member") }}
						</n-button>

						<n-button
							v-else
							strong
							type="success"
							round
							size="large"
							@click="emit('submit')"
							:disabled="quantity === 0"
						>
							{{ $t("assign_license") }}
						</n-button>
					</slot>
				</div>
			</div>
		</template>
	</n-card>
</template>

<script setup lang="ts">
defineProps({
	license_name: {
		type: String,
		required: true,
	},
	user_name: String,
	user_email: String,
	assigned_on: String,
	available_until: {
		type: String,
		required: true,
	},
	id: String,
	quantity: Number,
	show_checkbox: {
		type: Boolean,
		required: false,
		default: true,
	},

	external: Boolean,
});

const emit = defineEmits(["update:checkbox", "unassign", "submit"]);
</script>

<style lang="scss" scoped>
.license-card {
	line-height: 1.25;

	:deep(.n-card__content) {
		padding: 0;
		padding-bottom: 1rem !important;
	}
	:deep(.n-card__footer) {
		padding: 0;
		padding-top: 1rem !important;
	}
}
</style>
