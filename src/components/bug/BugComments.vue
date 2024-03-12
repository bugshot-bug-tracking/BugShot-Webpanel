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
			<div flex justify-between>
				<n-h4 m-0>
					{{ t("comment", 2) }}
				</n-h4>

				<n-tooltip
					v-if="canChangeVisibility"
					:content-style="{
						'font-size': '0.875rem',
						'max-width': '40ch',
					}"
				>
					<template #trigger>
						<n-button
							round
							ghost
							:type="commentsMode === 'internal' ? 'primary' : 'success'"
							size="small"
							icon-placement="right"
							@click="changeCommentsMode"
						>
							<template #icon>
								<IconEarthSlashed v-if="commentsMode === 'internal'" />
								<IconEarth v-else />
							</template>

							{{
								commentsMode === "internal"
									? t("comment_visibility.internal")
									: t("comment_visibility.public")
							}}
						</n-button>
					</template>

					{{
						commentsMode === "internal"
							? t("comment_visibility.internal_tooltip")
							: t("comment_visibility.public_tooltip")
					}}
				</n-tooltip>
			</div>
		</template>

		<n-scrollbar flex-1 h-88 pr-4>
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
						:show-visibility-change="canChangeVisibility"
						:visibility="comment.attributes.is_internal"
						@change-visibility="
							changeCommentVisibility(comment.id, comment.attributes.is_internal)
						"
						mb-4
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
					:type="commentsMode === 'internal' ? 'primary' : 'success'"
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
import { useBugStore } from "~/stores/bug";
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
	mode: {
		type: String as PropType<"internal" | "public">,
		required: false,
		default: undefined,
	},
});

const emit = defineEmits<{
	(event: "update:mode", value: "internal" | "public"): void;
}>();

const modeRef = ref<"internal" | "public">("internal");

const commentsMode = computed({
	get() {
		return modeRef.value;
	},
	set(value) {
		if (props.mode != undefined) emit("update:mode", value);
		else modeRef.value = value;
	},
});

watch(props, (newValue) => {
	if (newValue.mode && newValue.mode != modeRef.value) modeRef.value = newValue.mode;
});

const authStore = useAuthStore();
const projectStore = useProjectStore();

const { t } = useI18n();

const end = ref(undefined as HTMLDivElement | undefined);
const scrollToEnd = () => {
	end.value?.scrollIntoView({ behavior: "smooth" });
};
watchEffect(() => {
	if (props.loading === false && props.list.length > 2) nextTick(scrollToEnd);
});

const lock = ref(false);
const onSubmit = async () => {
	// console.log("message: ", message.value);
	// console.log("users: ", taggedUsers.value);
	// console.log("commentMode: ", commentsMode.value);

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

const canChangeVisibility = computed(() => {
	const projectRole = projectStore.getUserRole?.id;

	if (projectRole == undefined || projectRole === 4) return false;

	return true;
});

const changeCommentsMode = () => {
	if (commentsMode.value === "internal") commentsMode.value = "public";
	else commentsMode.value = "internal";
};

const changeCommentVisibility = async (comment_id: string, is_internal: boolean) => {
	try {
		await useBugStore().changeCommentVisibility({ id: comment_id, is_internal: !is_internal });
	} catch (error) {
		console.log(error);
	}
};
</script>

<style scoped lang="scss"></style>
