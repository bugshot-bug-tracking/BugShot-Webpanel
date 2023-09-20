export interface Setting {
	id: number;
	type: "SettingUserValue";
	attributes: {
		setting: {
			id: SettingTypes;
			type: "Setting";
			attributes: {
				designation: string;
			};
		};

		value?: {
			id: SettingValues;
			type: "Value";
			attributes: {
				designation: string;
			};
		};
	};
}

export enum SettingTypes {
	"company_filter_alphabetical" = 1,
	"company_filter_creation" = 2,
	"company_filter_last_updated" = 3,
	"project_filter_alphabetical" = 4,
	"project_filter_creation" = 5,
	"project_filter_last_updated" = 6,
	"bug_filter_alphabetical" = 7,
	"bug_filter_creation" = 8,
	"bug_filter_priority" = 9,
	"bug_filter_deadline" = 10,
	"bug_filter_assigned_to" = 11,

	"user_settings_interface_language" = 12,
	"user_settings_show_ui_elements" = 13,
	"user_settings_receive_mail_notifications" = 14,
	"user_settings_select_notifications" = 15,
	"user_settings_darkmode" = 16,

	"custom_notifications_new_bug_added" = 17,
	"custom_notifications_bug_change_of_status" = 18,
	"custom_notifications_report_created_deleted" = 19,
	"custom_notifications_report_finished" = 20,
	"custom_notifications_assignation_to_client_project_task" = 21,
	"custom_notifications_new_comments_and_replies" = 22,
	"custom_notifications_new_tag_in_comment" = 23,
	"custom_notifications_daily_summary" = 28,
	"custom_notifications_invitation_received" = 29,
	"custom_notifications_tagged_in_comment" = 30,
	"custom_notifications_assigned_to_bug" = 31,

	"show_custom_show_secondary_view_all_projects_button" = 24,
	"show_custom_show_edit_priority_button" = 25,
	"show_custom_show_edit_deadline_button" = 26,
	"show_custom_show_edit_status_button" = 27,
}

export enum SettingValues {
	"az" = 1,
	"za" = 2,
	"newest_first" = 3,
	"oldest_first" = 4,
	"descending" = 5,
	"ascending" = 6,
	"critical_first" = 7,
	"minor_first" = 8,
	"ending_first" = 9,
	"ending_last" = 10,
	"activated" = 11,
	"deactivated" = 12,
	"en" = 13,
	"de" = 14,
	"fr" = 15,
	"ru" = 16,
	"ro" = 17,
	"show_all" = 18,
	"show_basic" = 19,
	"show_custom" = 20,
	"show_custom_show_secondary_view_all_projects_button" = 21,
	"show_custom_show_edit_priority_button" = 22,
	"show_custom_show_edit_deadline_button" = 23,
	"show_custom_show_edit_status_button" = 24,
	"receive_notifications_via_app" = 25,
	"receive_notifications_via_mail" = 26,
	"every_notification" = 27,
	"custom_notifications" = 28,
	"custom_notifications_new_bug_added" = 29,
	"custom_notifications_bug_change_of_status" = 30,
	"custom_notifications_report_created_deleted" = 31,
	"custom_notifications_report_finished" = 32,
	"custom_notifications_assignation_to_client_project_task" = 33,
	"custom_notifications_new_comments_and_replies" = 34,
	"custom_notifications_new_tag_in_comment" = 35,
	"light_mode" = 36,
	"dark_mode" = 37,
	"system" = 38,
}
