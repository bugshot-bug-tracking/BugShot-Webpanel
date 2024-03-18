<template>
	<NotificationTemplate>
		<template #header>
			<n-text>
				<i18n-t keypath="tagged_in_comment_by" scope="global">
					<n-text strong> {{ value.data.creator_name }}</n-text>
				</i18n-t>
			</n-text>
		</template>

		<template #footer>
			<n-text style="color: var(--bs-gray)" v-if="value.data.created_at">
				{{ $d(new Date(dateFix(value.data.created_at)), "short") }}
			</n-text>
		</template>

		<template #action>
			<n-button type="primary" text underline @click="goToComment">
				{{ $t("view_comment") }}
			</n-button>
		</template>
	</NotificationTemplate>
</template>

<script setup lang="ts">
import { TaggedInComment } from "~/models/NotificationTypes/TaggedInComment";
import dateFix from "~/util/dateFixISO";

const props = defineProps({
	value: {
		type: Object as PropType<TaggedInComment>,
		required: true,
	},
});

const router = useRouter();

const goToComment = () => {
	router.push({
		name: "project",
		params: {
			organization_id: props.value.data.organization_id,
			company_id: props.value.data.company_id,
			project_id: props.value.data.project_id,
		},
		query: {
			b: props.value.data.bug_id,
			c: props.value.data.comment_id,
			i: props.value.data.is_internal ? "y" : "n",
		},
	});
};
</script>
