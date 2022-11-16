<template>
	<section v-if="list.length > 0">
		<header>
			<slot name="header">
				<b>{{ $t("assigned_to") }}</b>

				<span> ({{ list.length }} {{ $t(`${type.toLowerCase()}`, list.length) }}) </span>
			</slot>
		</header>

		<ul v-if="list.length > 0" my-4 gap-2 flex flex-wrap max-w-40vw>
			<li class="item" v-for="item of list" :key="item.id">
				<slot name="text" v-bind="{ item: item }">{{ item.attributes.designation }}</slot>

				<img
					v-if="removable"
					src="/src/assets/icons/close_2.svg"
					alt="x"
					class="black-to-white"
					cursor-pointer
					@click="emit('remove', item)"
					:title="$t('remove')"
				/>
			</li>
		</ul>
	</section>

	<div v-else text-start class="black-to-gray">
		{{ $t(type.toLowerCase() + "_no_resources") }}
	</div>
</template>

<script setup lang="ts">
import { PropType } from "vue";

// const props =
defineProps({
	list: {
		required: false,
		type: Array as PropType<
			{ type: string; id: string; attributes: { designation: string } }[]
		>,
		description: "List of items",
		default: [],
	},

	removable: {
		required: false,
		type: Boolean,
		default: false,
		description: "Toggle for remove button visibility",
	},

	type: {
		required: true,
		type: String,
		description: "Type of the list",
	},
});

const emit = defineEmits<{ (event: "remove", item: any): void }>();
</script>

<style lang="scss" scoped>
header {
	color: #9ba5d7;
	text-align: left;
}

.item {
	background: #9ba5d7;
	border-radius: 0.25rem;
	padding: 0.25rem 0.5rem;
	color: white;
	white-space: nowrap;
	font-size: 0.75rem;
	width: fit-content;
	display: flex;
	align-items: center;
	gap: 0.25rem;

	> img {
		width: 1rem;

		&:hover {
			color: #f23838;
			filter: brightness(0) saturate(1) invert(46%) sepia(28%) saturate(5216%)
				hue-rotate(331deg) brightness(87%) contrast(121%);
		}
	}

	a {
		color: inherit;

		&:hover {
			color: #1a2040;
			font-weight: bold;
		}
	}
}
</style>
