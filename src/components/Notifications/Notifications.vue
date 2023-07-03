<template>
	<n-popover trigger="click" placement="right-start">
		<template #trigger>
			<n-badge
				:max="9"
				:value="notificationCount"
				:offset="['-25%', '50%']"
				:processing="loading"
				v-bind="$attrs"
			>
				<n-button text class="bell-button">
					<template #icon>
						<Icon-Bell color="white" />
					</template>
				</n-button>
			</n-badge>
		</template>

		<section class="popup">
			<header mb-2>
				<n-h4 m-0 p-2>{{ $t("notification", 2) }}</n-h4>

				<n-button
					v-if="notificationCount > 0"
					text
					type="tertiary"
					:loading="deleteLoading"
					@click="deleteAllNotifications"
					strong
					size="small"
				>
					{{ $t("delete.all") }}
				</n-button>
			</header>

			<n-scrollbar v-if="notificationCount > 0" max-h-100 pr-2 mb-2>
				<ul px-2>
					<li v-for="notif in notifications" my-2>
						<NotificationItem :data="notif" />
					</li>
				</ul>
			</n-scrollbar>

			<div v-else flex flex-col items-center my-4>
				<n-empty :description="$t('no_new_notifications')" />
			</div>
		</section>
	</n-popover>
</template>

<script setup lang="ts">
import { useNotificationStore } from "~/stores/notifications";

const store = useNotificationStore();

const notifications = computed(() => store.getNotifications);
const notificationCount = computed(() => store.getNotifications.length);

const loading = ref(false);
const init = async () => {
	loading.value = true;

	await store.init();

	loading.value = false;
};

onMounted(init);

const deleteLoading = ref(false);

const deleteAllNotifications = async () => {
	try {
		deleteLoading.value = true;

		await store.deleteAllNotifications();
	} catch (error) {
		console.log(error);
	} finally {
		deleteLoading.value = false;
	}
};
</script>

<style scoped lang="scss">
.bell-button {
	border-radius: 100%;
	padding: 1rem;

	&:hover {
		background-color: var(--bs-purple);
	}
}

.popup {
	width: 30rem;

	header {
		display: flex;
		justify-content: space-between;
		border-bottom: 2px solid #eee5fc;
	}

	ul {
		li {
			padding-bottom: 0.5rem;
			border-bottom: 1px solid #eee5fc;

			&:last-of-type {
				border-bottom: unset;
			}
		}
	}
}
</style>
