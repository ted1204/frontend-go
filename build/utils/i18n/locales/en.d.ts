declare const en: {
    readonly brand: {
        readonly name: "AI Platform";
    };
    readonly common: {
        readonly create: "Create";
        readonly edit: "Edit";
        readonly delete: "Delete";
        readonly cancel: "Cancel";
        readonly submit: "Submit";
        readonly save: "Save";
        readonly search: "Search...";
        readonly loading: "Loading...";
        readonly submitting: "Submitting...";
        readonly success: "Success";
        readonly error: "Error";
        readonly id: "ID";
        readonly name: "Name";
        readonly description: "Description";
        readonly status: "Status";
        readonly createdAt: "Created At";
        readonly noData: "No data found.";
        readonly untitled: "Untitled";
        readonly confirmDelete: "Are you sure you want to delete?";
    };
    readonly status: {
        readonly active: "Active";
        readonly idle: "Idle";
    };
    readonly breadcrumb: {
        readonly home: "Home";
        readonly projects: "Projects";
        readonly groups: "Groups";
    };
    readonly breadcrumb_groups: "Groups";
    readonly admin_manageProjects: "Manage Projects";
    readonly admin_manageGroups: "Manage Groups";
    readonly admin_forms: "Forms Management";
    readonly groups_error_userNotLogged: "User not logged in";
    readonly groups_error_userIdMissing: "User ID is missing";
    readonly groups_error_unknown: "Unknown error";
    readonly groups_noMatch: "No groups match \"{term}\".";
    readonly groups_page_title: "Groups";
    readonly groups_page_description: "Manage your groups here.";
    readonly groups_myGroups: "My Groups";
    readonly groups_subtitle: "Manage and join groups.";
    readonly groups_searchPlaceholder: "Search groups...";
    readonly groups_createNew: "Create New Group";
    readonly monitor_table_podName: "Pod Name";
    readonly monitor_table_namespace: "Namespace";
    readonly monitor_table_status: "Status";
    readonly monitor_table_actions: "Actions";
    readonly monitor_empty_noPods: "No pods found.";
    readonly monitor_button_connect: "Connect";
    readonly monitor_empty_waitingForData: "Waiting for cluster data stream...";
    readonly error_initData: "Failed to initialize data";
    readonly error_selectGroup: "Please select a group";
    readonly error_invalidProjectData: "Invalid project data";
    readonly error_createProject: "Failed to create project";
    readonly error_deleteProject: "Failed to delete project";
    readonly error_deleteFailed: "Delete failed";
    readonly error_fetchGroups: "Failed to fetch groups";
    readonly error_createGroup: "Failed to create group";
    readonly error_deleteGroup: "Failed to delete group";
    readonly error_userNotLogged: "User not logged in";
    readonly error_fetchData: "Failed to fetch data";
    readonly error: {
        readonly fetchGroups: "Failed to fetch groups";
        readonly createGroup: "Failed to create group";
        readonly deleteGroup: "Failed to delete group";
        readonly deleteFailed: "Delete failed";
        readonly initData: "Failed to initialize data";
        readonly selectGroup: "Please select a group";
        readonly invalidProjectData: "Invalid project data";
        readonly createProject: "Failed to create project";
        readonly deleteProject: "Failed to delete project";
        readonly fetchData: "Failed to fetch data";
        readonly userNotLogged: "User not logged in";
    };
    readonly project_noDescription: "No description";
    readonly groupId: "Group ID";
    readonly page_admin_title: "Admin Dashboard";
    readonly page_admin_description: "Admin center";
    readonly page_manageGroups_title: "Manage Groups";
    readonly page_manageGroups_description: "Manage your organization groups.";
    readonly page_projects_title: "Projects";
    readonly page_projects_description: "List of accessible projects.";
    readonly page_adminForm_title: "Forms Dashboard";
    readonly page_adminForm_description: "Manage user-submitted forms.";
    readonly page_notFound_title: "Not Found";
    readonly page_notFound_description: "This is the 404 page for AI Platform.";
    readonly page_notFound_message: "We couldn't find the page you were looking for!";
    readonly page_notFound_back: "Back to Home";
    readonly page_home_title: "Dashboard";
    readonly page_home_description: "Welcome to your dashboard";
    readonly page: {
        readonly adminForm: {
            readonly title: "Forms Dashboard";
            readonly description: "Manage user-submitted forms.";
        };
        readonly projects: {
            readonly title: "Projects";
            readonly description: "List of accessible projects.";
        };
        readonly manageGroups: {
            readonly title: "Manage Groups";
            readonly description: "Manage your organization groups.";
        };
    };
    readonly home_welcome: "Welcome to AI Platform";
    readonly home_subtitle: "Manage your projects, groups, and pods here.";
    readonly view_grid: "Grid View";
    readonly view_list: "List View";
    readonly search_projectsPlaceholder: "Search projects...";
    readonly search_placeholder: "Search...";
    readonly form_error_titleRequired: "Title is required";
    readonly form_success_submitted: "Submitted successfully, admin will review soon.";
    readonly form_error_submitFailed: "Submission failed";
    readonly form_history_title: "History";
    readonly form_apply_title: "Apply";
    readonly form_page_title: "Form Page";
    readonly form_page_description: "Submit and manage your forms.";
    readonly form_status_pending: "Pending";
    readonly form_status_approved: "Approved";
    readonly form_status_rejected: "Rejected";
    readonly form_action_process: "Process";
    readonly form_action_reject: "Reject";
    readonly form_action_complete: "Complete";
    readonly form_created: "Form created successfully!";
    readonly form_createFailed: "Failed to create form:";
    readonly form_exampleTitle: "Example Title";
    readonly form_field_title: "Title";
    readonly form_field_description: "Description";
    readonly form_placeholder_description: "Enter description...";
    readonly form_projectId: "Related Project ID: {id}";
    readonly table_id: "ID";
    readonly table_user: "User";
    readonly table_project: "Project";
    readonly table_titleDesc: "Title / Description";
    readonly table_status: "Status";
    readonly table_actions: "Actions";
    readonly config_error_filenameRequired: "Filename is required";
    readonly config_error_filenameSuffix: "Filename must end with .yaml or .yml";
    readonly config_error_yamlEmpty: "YAML content cannot be empty";
    readonly config_createTitle: "Create New Config";
    readonly config_createSubtitle: "Use wizard or edit YAML directly.";
    readonly config_tab_wizard: "Wizard Mode";
    readonly config_tab_yaml: "Raw YAML";
    readonly config_filename_label: "Config Filename";
    readonly config_filename_prefix: "Filename:";
    readonly config_filename_note: "Must be unique and end with .yaml or .yml";
    readonly config_wizard_imageLabel: "Container Image";
    readonly config_wizard_imageNote: "Specify the image to use.";
    readonly config_wizard_gpuLabel: "GPU Quota";
    readonly config_wizard_pvcLabel: "PVC";
    readonly config_pvc_placeholder: "Select PVC...";
    readonly config_pvc_loading: "Loading PVCs...";
    readonly config_pvc_note: "Select a PVC for storage.";
    readonly config_mountPath: "Mount Path";
    readonly config_commandLabel: "Command";
    readonly config_argsLabel: "Arguments";
    readonly config_yamlContentLabel: "YAML Content";
    readonly config_creating: "Creating...";
    readonly config_createButton: "Create Config";
    readonly admin_storage_project_form_projectPlaceholder: "Select project...";
    readonly admin_storage_project_create_success: "Project storage created successfully";
    readonly admin_storage_project_create_guideTitle: "Create Project Storage";
    readonly admin_storage_project_create_guideDesc: "Create a new PVC for project storage.";
    readonly admin_storage_project_form_project: "Project";
    readonly admin_storage_project_form_capacity: "Capacity";
    readonly admin_storage_project_form_capacityHint: "e.g., 10Gi";
    readonly admin_storage_project_create_submit: "Create Storage";
    readonly admin_storage_project_action_expandPrompt: "Expand Storage Capacity";
    readonly admin_storage_project_action_confirmDelete: "Are you sure you want to delete this storage?";
    readonly admin_storage_project_list_project: "Project";
    readonly admin_storage_project_list_status: "Status";
    readonly admin_storage_project_list_capacity: "Capacity";
    readonly admin_storage_project_list_age: "Age";
    readonly admin_storage_project_list_actions: "Actions";
    readonly admin_storage_project_list_empty: "No project storage found.";
    readonly admin_storage_project_action_edit: "Edit";
    readonly admin_storage_project_action_delete: "Delete";
    readonly admin_storage_project_tab_list: "List";
    readonly admin_storage_project_tab_create: "Create";
    readonly admin_storage_project_error_selectProject: "Please select a project";
    readonly admin_storage_user_successInit: "Storage initialized successfully";
    readonly admin_storage_user_confirmDelete: "Are you sure you want to delete this storage?";
    readonly admin_storage_user_successDelete: "Storage deleted successfully";
    readonly admin_storage_user_successExpand: "Storage expanded successfully";
    readonly admin_storage_user_targetUser: "Target User";
    readonly admin_storage_user_username: "Username";
    readonly admin_storage_user_usernamePlaceholder: "Enter username";
    readonly admin_storage_user_checkStatus: "Check Status";
    readonly admin_storage_user_statusExists: "Storage exists";
    readonly admin_storage_user_statusMissing: "Storage missing";
    readonly admin_storage_user_lifecycleTitle: "Storage Lifecycle";
    readonly admin_storage_user_hintUnknown: "Status unknown";
    readonly admin_storage_user_hintMissing: "No storage found";
    readonly admin_storage_user_hintExists: "Storage is active";
    readonly admin_storage_user_processing: "Processing...";
    readonly admin_storage_user_initBtn: "Initialize Storage";
    readonly admin_storage_user_deleteBtn: "Delete Storage";
    readonly admin_storage_user_checkStatusFirst: "Check Status First";
    readonly admin_storage_user_expandTitle: "Expand Storage";
    readonly admin_storage_user_newSize: "New Size (GB)";
    readonly admin_storage_user_newSizePlaceholder: "e.g., 50";
    readonly admin_storage_user_expandBtn: "Expand Storage";
    readonly admin_storage_title: "Storage Administration";
    readonly admin_storage_tab_user: "User Storage (Hub)";
    readonly admin_storage_tab_project: "Project Storage (PVC)";
    readonly storage_startDrive: "Start Drive";
    readonly storage_stopDrive: "Stop Drive";
    readonly storage_openBrowser: "Open Browser";
    readonly pagination_prev: "Previous";
    readonly pagination_pageOf: "Page {current} of {total}";
    readonly pagination_next: "Next";
    readonly pagination: {
        readonly prev: "Previous";
        readonly next: "Next";
        readonly pageOf: "Page {current} of {total}";
    };
    readonly role: {
        readonly admin: "Administrator";
        readonly adminDesc: "Full access to all resources and settings.";
        readonly manager: "Manager";
        readonly managerDesc: "Can manage projects, groups, and members.";
        readonly user: "User";
        readonly userDesc: "Can access and use assigned projects.";
        readonly label: "Role: {role}";
    };
    readonly sidebar: {
        readonly dashboard: "Dashboard";
        readonly admin: "Admin";
        readonly projects: "Projects";
        readonly groups: "Groups";
        readonly pods: "Pods";
        readonly fileBrowser: "Cloud Explorer";
        readonly forms: "My Forms";
        readonly menu: "Menu";
        readonly jobs: "Jobs";
        readonly ecommerce: "E-commerce";
    };
    readonly storage: {
        readonly pageTitle: "Cloud Explorer";
        readonly breadcrumb: "Cloud Explorer";
        readonly starting: "Starting storage browser...";
        readonly stopping: "Stopping storage browser...";
        readonly actionFailed: "Action failed. Please try again.";
        readonly errLoadList: "Failed to load storage list";
        readonly project: "Project";
        readonly tab: {
            readonly personal: "Personal Hub";
            readonly project: "Project Storage";
        };
        readonly readWrite: "Read/Write";
        readonly readOnly: "Read Only";
        readonly online: "Online";
        readonly offline: "Offline";
        readonly scanning: "Scanning volumes...";
        readonly action: {
            readonly start: "Start Drive";
            readonly stop: "Stop Drive";
            readonly open: "Open Browser";
        };
        readonly msg: {
            readonly starting: "Starting storage browser...";
            readonly stopping: "Stopping storage browser...";
            readonly actionFailed: "Action failed. Please try again.";
            readonly loadFailed: "Could not load storage list.";
        };
        readonly personal: {
            readonly title: "Personal Storage Hub";
            readonly description: "Access your private storage space via Secure Ingress.";
            readonly noStorageTitle: "Storage Not Initialized";
            readonly noStorageDesc: "Your personal storage space has not been provisioned yet.";
            readonly contactAdmin: "Please contact an administrator to initialize your storage.";
        };
        readonly colProject: "Project";
        readonly colStatus: "Status";
        readonly emptyFilter: "No projects match \"{term}\".";
        readonly emptyAssigned: "No projects assigned to your groups.";
    };
    readonly admin: {
        readonly dashboard: "Dashboard";
        readonly storageManagement: {
            readonly title: "Storage Administration";
            readonly userTab: "User Hubs";
            readonly projectTab: "Project PVCs";
            readonly initUser: "Initialize Storage";
            readonly deleteUser: "Delete Hub";
            readonly expandUser: "Expand Capacity";
            readonly hintExists: "Storage is active (Ready).";
            readonly hintMissing: "No storage found.";
            readonly confirmDelete: "Are you sure you want to PERMANENTLY delete this storage?";
        };
        readonly pvc: {
            readonly title: "PVC Management";
            readonly createTitle: "Create New PVC";
            readonly expandTitle: "Expand PVC";
            readonly sizeLabel: "Size (Gi)";
        };
        readonly forms: "Forms";
    };
    readonly project: {
        readonly list: {
            readonly title: "Projects";
            readonly create: "New Project";
            readonly empty: {
                readonly filter: "No projects match \"{term}\".";
                readonly assigned: "No projects assigned.";
            };
        };
        readonly detail: {
            readonly overview: "Overview";
            readonly members: "Members";
            readonly settings: "Settings";
        };
        readonly create: {
            readonly title: "Create New Project";
            readonly error: "Failed to create project";
            readonly name: "Project Name";
            readonly namePlaceholder: "Enter unique project name";
            readonly description: "Description";
            readonly descriptionPlaceholder: "Enter project description";
            readonly group: "Group";
            readonly groupPlaceholder: "Select a group";
            readonly gpuQuota: "GPU Quota";
            readonly gpuQuotaPlaceholder: "e.g. 1";
            readonly gpuThreadLimit: "MPS Thread Limit (%)";
            readonly gpuThreadLimitPlaceholder: "e.g. 100";
            readonly gpuMemoryLimit: "MPS Memory Limit (MB)";
            readonly gpuMemoryLimitPlaceholder: "e.g. 1024";
            readonly gpuAccessMode: "GPU Access Mode";
            readonly gpuAccessShared: "Shared (MPS)";
            readonly gpuAccessDedicated: "Dedicated";
            readonly mpsSettings: "MPS Settings";
            readonly mpsThreadLimit: "Thread Limit";
            readonly mpsMemoryLimit: "Memory Limit";
            readonly noGroupsFound: "No groups found. Please create a group first.";
            readonly selectedId: "Selected Group ID: {id}";
            readonly cancel: "Cancel";
            readonly submit: "Create Project";
            readonly creating: "Creating...";
            readonly groupLabel: "Group";
            readonly gpuLabel: "GPU Quota";
        };
        readonly edit: {
            readonly title: "Edit Project";
        };
        readonly role: {
            readonly admin: "Administrator";
            readonly manager: "Manager";
            readonly user: "User";
        };
        readonly members: {
            readonly title: "Members";
            readonly description: "Manage members of group {groupId}.";
            readonly searchPlaceholder: "Search members...";
            readonly addMember: "Add Member";
        };
        readonly untitled: "Untitled";
        readonly idLabel: "Project ID: {id}";
        readonly delete: "Delete project: {name}";
        readonly requestSupport: "Request Support";
        readonly gpuResources: "GPU Resources";
        readonly gpuQuotaUnit: "{quota} GPU(s)";
        readonly gpuAccessMode: "Access Mode";
        readonly gpuAccessShared: "Shared";
        readonly gpuAccessDedicated: "Dedicated";
        readonly mpsSettings: "MPS Settings";
        readonly mpsThreadLimit: "Thread Limit: {value}%";
        readonly mpsMemoryLimit: "Memory Limit: {value} MB";
        readonly mpsUnlimited: "Unlimited";
        readonly noDescription: "No description";
    };
    readonly projectList: {
        readonly title: "Projects";
        readonly searchPlaceholder: "Search projects...";
        readonly loading: "Loading projects...";
        readonly errorPrefix: "Error:";
        readonly empty: {
            readonly filter: "No projects match \"{term}\".";
            readonly noProjects: "No projects found.";
        };
        readonly colProject: "Project";
        readonly colStatus: "Status";
        readonly emptyFilter: "No projects match \"{term}\".";
        readonly emptyAssigned: "No projects assigned to your groups.";
    };
    readonly members: {
        readonly noneFound: "No members found.";
        readonly noMatch: "No members match your search.";
    };
    readonly projectDetail: {
        readonly needProjectId: "Project ID is required";
        readonly fetchError: "Failed to fetch project details";
        readonly createConfigError: "Failed to create configuration";
        readonly updateConfigError: "Failed to update configuration";
        readonly deleteConfigError: "Failed to delete configuration";
        readonly instanceCreateSent: "Instance creation request sent";
        readonly createInstanceError: "Failed to create instance";
        readonly confirmDeleteInstance: "Are you sure you want to delete this instance?";
        readonly instanceDeleteSent: "Instance deletion request sent";
        readonly deleteInstanceError: "Failed to delete instance";
        readonly errorTitle: "Error";
        readonly notFoundTitle: "Project Not Found";
        readonly notFoundMessage: "Project with ID {id} was not found.";
        readonly titleSuffix: "Project Details";
        readonly description: "Manage project {name} configurations, storage, and members.";
        readonly tab: {
            readonly overview: "Overview";
            readonly configurations: "Configurations";
            readonly storage: "Storage";
            readonly members: "Members";
        };
        readonly infoLabel: "Project Information";
        readonly createdAt: "Created At";
        readonly updatedAt: "Updated At";
        readonly configTitle: "Configurations";
        readonly configDesc: "Manage project configurations and deployments.";
        readonly addConfig: "Add Configuration";
        readonly pvcTitle: "Storage (PVC)";
        readonly pvcDesc: "Manage project persistent volume claims.";
    };
    readonly monitor: {
        readonly title: "Real-time Monitoring";
        readonly panel: {
            readonly title: "Real-time Monitoring";
            readonly subtitle: "Real-time logs and status updates.";
        };
        readonly col: {
            readonly eventType: "Event Type";
            readonly kind: "Kind";
            readonly name: "Name";
            readonly endpoint: "Endpoint";
            readonly status: "Status";
        };
        readonly agePrefix: "Age";
        readonly status: {
            readonly running: "Running";
            readonly pending: "Pending";
            readonly failed: "Failed";
            readonly unknown: "Unknown";
            readonly active: "Active";
            readonly completed: "Completed";
            readonly succeeded: "Succeeded";
            readonly added: "Added";
            readonly creating: "Creating";
            readonly modified: "Modified";
            readonly error: "Error";
            readonly deleted: "Deleted";
            readonly idle: "Idle";
        };
        readonly waiting: "Waiting for cluster data stream...";
    };
    readonly user: {
        readonly profile: "Profile";
        readonly signOut: "Sign out";
        readonly login: "Login";
        readonly editProfile: "Edit Profile";
        readonly support: "Support";
    };
    readonly groups: {
        readonly form: {
            readonly title: "Create Group";
            readonly nameRequired: "Group name is required";
            readonly createFailed: "Failed to create group";
            readonly creating: "Creating...";
            readonly cancel: "Cancel";
        };
        readonly namePlaceholder: "Enter group name...";
        readonly descriptionPlaceholder: "Enter description...";
        readonly creating: "Creating group...";
        readonly createButton: "Create Group";
        readonly nameLabel: "Group Name";
        readonly descriptionLabel: "Description";
        readonly empty: {
            readonly title: "No Groups";
            readonly description: "You are not a member of any groups yet.";
        };
        readonly error: {
            readonly loadFailed: "Failed to load groups";
        };
        readonly noDescription: "No description";
    };
    readonly groupList: {
        readonly title: "Groups";
        readonly description: "Browse and manage groups.";
        readonly searchPlaceholder: "Search groups...";
        readonly loading: "Loading groups...";
        readonly deleteGroupAria: "Delete group";
        readonly noDescription: "No description";
        readonly empty: {
            readonly filter: "No groups match your filter.";
            readonly noGroups: "No groups available.";
            readonly filterTip: "Try adjusting your filter criteria.";
            readonly noGroupsTip: "Create a new group to get started.";
        };
    };
    readonly language: {
        readonly aria: "Language selector";
        readonly switchToEn: "Switch to English";
        readonly switchToZh: "Switch to Chinese";
        readonly short: "EN";
        readonly switchLabel: "Toggle language";
    };
    readonly notification: {
        readonly title: "Notifications";
        readonly requestChange: "Request Change";
        readonly project: "Project";
        readonly viewAll: "View All";
        readonly time: {
            readonly '5min': "5 minutes ago";
            readonly '8min': "8 minutes ago";
            readonly '15min': "15 minutes ago";
            readonly '1hour': "1 hour ago";
        };
    };
    readonly invite: {
        readonly selectUserError: "Please select a user to invite";
        readonly unknownError: "Unknown error occurred while inviting user";
        readonly title: "Invite User";
        readonly description: "Invite a user to the project or group";
        readonly userLabel: "User";
        readonly userSearchPlaceholder: "Search users...";
        readonly noResults: "No users found";
    };
    readonly form: {
        readonly title: "Submit Form";
        readonly history: {
            readonly title: "History";
            readonly empty: "No history found.";
            readonly loading: "Loading history...";
        };
        readonly apply: {
            readonly title: "Apply";
        };
        readonly status: {
            readonly pending: "Pending";
            readonly approved: "Approved";
            readonly rejected: "Rejected";
            readonly processing: "Processing";
            readonly completed: "Completed";
        };
        readonly action: {
            readonly process: "Process";
            readonly reject: "Reject";
            readonly complete: "Complete";
        };
        readonly label: {
            readonly title: "Title";
            readonly description: "Description";
            readonly project: "Project";
        };
        readonly select: {
            readonly none: "None";
        };
        readonly createFailed: "Failed to create form";
        readonly created: "Form created successfully!";
        readonly field: {
            readonly title: "Title";
            readonly description: "Description";
        };
        readonly exampleTitle: "Example Title";
        readonly placeholder: {
            readonly title: "Enter title...";
            readonly description: {
                readonly base: "Enter description...";
                readonly long: "Enter detailed description...";
            };
        };
        readonly projectId: "Project ID: {id}";
        readonly cancel: "Cancel";
        readonly submitting: "Submitting...";
        readonly submit: "Submit";
    };
    readonly search: {
        readonly projectsPlaceholder: "Search projects...";
    };
    readonly table: {
        readonly id: "ID";
        readonly user: "User";
        readonly project: "Project";
        readonly titleDesc: "Title / Description";
        readonly status: "Status";
        readonly actions: "Actions";
    };
    readonly terminal: {
        readonly connected: "Connected";
        readonly websocketError: "WebSocket Error";
        readonly disconnected: "Disconnected";
    };
    readonly badge: {
        readonly new: "New";
        readonly pro: "Pro";
    };
    readonly view: {
        readonly toggleToAdmin: "Switch to Admin";
        readonly toggleToUser: "Switch to User";
        readonly grid: "Grid View";
        readonly list: "List View";
    };
    readonly loading: {
        readonly forms: "Loading forms...";
    };
    readonly button: {
        readonly newGroup: "New Group";
        readonly newProject: "New Project";
    };
};
export default en;
export type Dictionary = typeof en;
export type TranslationSchema<T> = {
    -readonly [K in keyof T]: T[K] extends string ? string : TranslationSchema<T[K]>;
};
//# sourceMappingURL=en.d.ts.map