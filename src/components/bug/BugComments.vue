<template>
	<n-card v-if="loading" class="n-card-container">
		<template #header>
			<n-skeleton text height="2rem" width="40%" />
		</template>

		<n-skeleton text height="22rem" />

		<template #footer>
			<div flex justify-between>
				<n-skeleton text width="35%" />
				<n-skeleton text width="20%" />
			</div>

			<n-skeleton height="6rem" my-2 :sharp="false" />

			<div flex justify-end>
				<n-skeleton text height="2rem" width="40%" :sharp="false" />
			</div>
		</template>
	</n-card>

	<n-card v-else class="n-card-container">
		<template #header>
			<n-h4 m-0>
				{{ t("comment", 2) }}
			</n-h4>
		</template>

		<n-scrollbar flex-1 h-88>
			<ul>
				<li v-for="comment of list" :key="comment.id">
					<BugCommentsItem
						:id="comment.id"
						:content="comment.attributes.content"
						:timestamp="comment.attributes.created_at"
						:creator="{
							first_name: comment.attributes.user.first_name,
							last_name: comment.attributes.user.last_name,
						}"
						:owner="authStore.user?.id === comment.attributes.user.id"
					/>
				</li>

				<div ref="end" />
			</ul>
		</n-scrollbar>

		<template #footer>
			<div flex flex-col>
				<div flex justify-between>
					<n-p style="font-size: 0.875rem; font-weight: 500">{{ t("add.comment") }}</n-p>

					<n-text
						:class="{ 'over-limit': message.length > 250 }"
						style="font-size: 0.75rem"
						:style="message.length > 250 ? { color: 'var(--bs-red)' } : {}"
					>
						{{ message.length }} / 250
					</n-text>
				</div>

				<MentionsInput
					v-model="message"
					v-model:users="taggedUsers"
					:list="projectStore.getAssignableMembers"
					:disabled="lock || disabled"
				/>

				<n-button
					type="success"
					strong
					:loading="lock"
					:disabled="lock || message.length > 250 || disabled"
					@click="onSubmit"
					round
					self-end
				>
					{{ t("add.comment") }}
				</n-button>
			</div>
		</template>
	</n-card>
</template>

<script setup lang="ts">
import { Comment } from "~/models/Comment";
import { useAuthStore } from "~/stores/auth";
import { useProjectStore } from "~/stores/project";

const props = defineProps({
	loading: {
		type: Boolean,
		required: false,
		default: false,
	},
	disabled: {
		type: Boolean,
		required: false,
		default: false,
	},
	submit: {
		type: Function,
		required: false,
		default: undefined,
	},
	list: {
		type: Array as PropType<Comment[]>,
		required: false,
		default: [],
	},
});

const authStore = useAuthStore();
const projectStore = useProjectStore();

const { t } = useI18n();

const end = ref(undefined as HTMLDivElement | undefined);
const scrollToEnd = () => {
	end.value?.scrollIntoView({ behavior: "smooth" });
};
watchEffect(() => {
	if (props.list.length > 2) nextTick(scrollToEnd);
});

const lock = ref(false);
const onSubmit = async () => {
	console.log("message: ", message.value);
	console.log("users: ", taggedUsers.value);
	if (props.submit == undefined || lock.value === true) return;

	try {
		lock.value = true;

		await props.submit(message.value, taggedUsers.value);

		message.value = "";
	} catch (error) {
		console.log(error);
	} finally {
		lock.value = false;
	}
};

const message = ref("");
const taggedUsers = ref([]);
</script>

<style scoped lang="scss">
ul {
	padding-right: 1rem;
}
</style>
