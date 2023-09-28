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
	"user_settings_interface_language" = 1,
	"user_settings_select_notifications" = 2,
	"custom_notifications_tagged_in_comment" = 3,
	"custom_notifications_assigned_to_bug" = 4,
	"custom_notifications_daily_summary" = 5,
	"custom_notifications_invitation_received" = 6,
	"custom_notifications_implementation_approval_form_received" = 7,
	"custom_notifications_report_created" = 8,
	"tour_status" = 9,
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

	"complete" = 39,
	"canceled" = 40,
}
