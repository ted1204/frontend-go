import en from './locales/en';
declare const resources: {
    readonly en: {
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
        readonly configFile: {
            readonly editFile: "Edit file";
            readonly destroyInstance: "Destroy instance";
            readonly deleteFile: "Delete file";
            readonly notFoundTitle: "No config files found";
            readonly notFoundDesc: "Click \"Add Config\" to get started.";
            readonly toggleResources: "Toggle resources";
            readonly id: "ID";
            readonly createdAt: "Created At";
            readonly deployInstance: "Deploy instance";
            readonly deploy: "Deploy";
            readonly relatedResources: "Related Resources";
            readonly noRelatedResources: "No related resources";
            readonly notDeployed: "This config file has not been deployed yet.";
        };
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
            readonly pageSubtitle: "Browse and manage your storage volumes and project drives.";
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
        readonly auth: {
            readonly login: {
                readonly title: "Login";
                readonly subtitle: "Enter your username and password to login!";
                readonly username: "Username";
                readonly usernamePlaceholder: "Enter your username";
                readonly password: "Password";
                readonly passwordPlaceholder: "Enter your password";
                readonly forgotPassword: "Forgot password?";
                readonly submit: "Login";
                readonly noAccount: "Don't have an account?";
                readonly signUp: "Sign up";
                readonly backToDashboard: "Back to Dashboard";
                readonly loginFailed: "Login failed, please try again.";
                readonly pageTitle: "Login | AI Platform";
                readonly pageDescription: "This is the login page for AI Platform";
            };
            readonly signOut: "Sign out";
            readonly signIn: "Sign in";
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
    readonly zh: {
        readonly brand: {
            readonly name: "AI 平台";
        };
        readonly common: {
            readonly create: "建立";
            readonly edit: "編輯";
            readonly delete: "刪除";
            readonly cancel: "取消";
            readonly submit: "送出";
            readonly save: "儲存";
            readonly search: "搜尋...";
            readonly loading: "載入中...";
            readonly submitting: "提交中...";
            readonly success: "成功";
            readonly error: "錯誤";
            readonly id: "ID";
            readonly name: "名稱";
            readonly description: "描述";
            readonly status: "狀態";
            readonly createdAt: "建立時間";
            readonly noData: "無資料。";
            readonly untitled: "無標題";
            readonly confirmDelete: "您確定要刪除嗎？";
        };
        readonly status: {
            readonly active: "啟用中";
            readonly idle: "閒置";
        };
        readonly breadcrumb: {
            readonly home: "首頁";
            readonly projects: "專案";
            readonly groups: "群組";
        };
        readonly breadcrumb_groups: "群組";
        readonly admin_manageProjects: "專案管理";
        readonly admin_manageGroups: "群組管理";
        readonly admin_forms: "表單管理";
        readonly groups_error_userNotLogged: "使用者未登入";
        readonly groups_error_userIdMissing: "缺少使用者 ID";
        readonly groups_error_unknown: "未知錯誤";
        readonly groups_noMatch: "找不到符合 \"{term}\" 的群組。";
        readonly groups_page_title: "群組";
        readonly groups_page_description: "在此管理您的群組。";
        readonly groups_myGroups: "我的群組";
        readonly groups_subtitle: "管理並加入群組。";
        readonly groups_searchPlaceholder: "搜尋群組...";
        readonly groups_createNew: "建立新群組";
        readonly monitor_table_podName: "Pod 名稱";
        readonly monitor_table_namespace: "命名空間";
        readonly monitor_table_status: "狀態";
        readonly monitor_table_actions: "動作";
        readonly monitor_empty_noPods: "找不到 Pod。";
        readonly monitor_button_connect: "連線";
        readonly monitor_empty_waitingForData: "等待叢集資料串流...";
        readonly error_initData: "資料初始化失敗";
        readonly error_selectGroup: "請選擇群組";
        readonly error_invalidProjectData: "無效的專案資料";
        readonly error_createProject: "建立專案失敗";
        readonly error_deleteProject: "刪除專案失敗";
        readonly error_deleteFailed: "刪除失敗";
        readonly error_fetchGroups: "讀取群組失敗";
        readonly error_createGroup: "建立群組失敗";
        readonly error_deleteGroup: "刪除群組失敗";
        readonly error_userNotLogged: "使用者未登入";
        readonly error_fetchData: "讀取資料失敗";
        readonly error: {
            readonly fetchGroups: "讀取群組失敗";
            readonly createGroup: "建立群組失敗";
            readonly deleteGroup: "刪除群組失敗";
            readonly deleteFailed: "刪除失敗";
            readonly initData: "資料初始化失敗";
            readonly selectGroup: "請選擇群組";
            readonly invalidProjectData: "無效的專案資料";
            readonly createProject: "建立專案失敗";
            readonly deleteProject: "刪除專案失敗";
            readonly fetchData: "讀取資料失敗";
            readonly userNotLogged: "使用者未登入";
        };
        readonly project_noDescription: "無描述";
        readonly groupId: "群組 ID";
        readonly page_admin_title: "管理儀表板";
        readonly page_admin_description: "管理中心";
        readonly page_manageGroups_title: "群組管理";
        readonly page_manageGroups_description: "管理您的組織群組。";
        readonly page_projects_title: "專案列表";
        readonly page_projects_description: "查看可存取的專案。";
        readonly page_adminForm_title: "表單儀表板";
        readonly page_adminForm_description: "管理使用者提交的表單。";
        readonly page_notFound_title: "找不到頁面";
        readonly page_notFound_description: "這是 AI 平台的 404 頁面。";
        readonly page_notFound_message: "我們找不到您要瀏覽的頁面！";
        readonly page_notFound_back: "返回首頁";
        readonly page_home_title: "儀表板";
        readonly page_home_description: "歡迎來到您的儀表板";
        readonly page: {
            readonly adminForm: {
                readonly title: "表單儀表板";
                readonly description: "管理使用者提交的表單。";
            };
            readonly projects: {
                readonly title: "專案列表";
                readonly description: "查看可存取的專案。";
            };
            readonly manageGroups: {
                readonly title: "群組管理";
                readonly description: "管理您的組織群組。";
            };
        };
        readonly home_welcome: "歡迎使用 AI 平台";
        readonly home_subtitle: "在此管理您的專案、群組與 Pods。";
        readonly view_grid: "網格檢視";
        readonly view_list: "列表檢視";
        readonly search_projectsPlaceholder: "搜尋專案...";
        readonly search_placeholder: "搜尋...";
        readonly form_error_titleRequired: "標題為必填項";
        readonly form_success_submitted: "提交成功，管理員將儘快審核。";
        readonly form_error_submitFailed: "提交失敗";
        readonly form_history_title: "歷史紀錄";
        readonly form_apply_title: "申請";
        readonly form_page_title: "表單頁面";
        readonly form_page_description: "提交並管理您的表單。";
        readonly form_status_pending: "待審核";
        readonly form_status_approved: "已核准";
        readonly form_status_rejected: "已駁回";
        readonly form_action_process: "處理";
        readonly form_action_reject: "駁回";
        readonly form_action_complete: "完成";
        readonly form_created: "表單建立成功！";
        readonly form_createFailed: "表單建立失敗：";
        readonly form_exampleTitle: "範例標題";
        readonly form_field_title: "標題";
        readonly form_field_description: "描述";
        readonly form_placeholder_description: "輸入描述...";
        readonly form_projectId: "關聯專案 ID: {id}";
        readonly table_id: "ID";
        readonly table_user: "使用者";
        readonly table_project: "專案";
        readonly table_titleDesc: "標題 / 描述";
        readonly table_status: "狀態";
        readonly table_actions: "動作";
        readonly config_error_filenameRequired: "檔案名稱為必填";
        readonly config_error_filenameSuffix: "檔案名稱必須以 .yaml 或 .yml 結尾";
        readonly config_error_yamlEmpty: "YAML 內容不得為空";
        readonly config_createTitle: "建立新設定";
        readonly config_createSubtitle: "使用精靈模式或直接編輯 YAML。";
        readonly config_tab_wizard: "精靈模式";
        readonly config_tab_yaml: "原始 YAML";
        readonly config_filename_label: "設定檔名稱";
        readonly config_filename_prefix: "檔名:";
        readonly config_filename_note: "必須是唯一的且以 .yaml 或 .yml 結尾";
        readonly config_wizard_imageLabel: "容器映像檔 (Image)";
        readonly config_wizard_imageNote: "指定要使用的映像檔。";
        readonly config_wizard_gpuLabel: "GPU 配額";
        readonly config_wizard_pvcLabel: "PVC";
        readonly config_pvc_placeholder: "選擇 PVC...";
        readonly config_pvc_loading: "載入 PVC 中...";
        readonly config_pvc_note: "選擇用於儲存的 PVC。";
        readonly config_mountPath: "掛載路徑 (Mount Path)";
        readonly config_commandLabel: "指令 (Command)";
        readonly config_argsLabel: "參數 (Arguments)";
        readonly config_yamlContentLabel: "YAML 內容";
        readonly config_creating: "建立中...";
        readonly config_createButton: "建立設定";
        readonly configFile: {
            readonly editFile: "編輯檔案";
            readonly destroyInstance: "銷毀實例";
            readonly deleteFile: "刪除檔案";
            readonly notFoundTitle: "找不到設定檔";
            readonly notFoundDesc: "點擊「新增設定檔」以開始。";
            readonly toggleResources: "切換資源顯示";
            readonly id: "ID";
            readonly createdAt: "建立時間";
            readonly deployInstance: "部署實例";
            readonly deploy: "部署";
            readonly relatedResources: "關聯資源";
            readonly noRelatedResources: "無關聯資源";
            readonly notDeployed: "此設定檔尚未部署。";
        };
        readonly admin_storage_project_form_projectPlaceholder: "選擇專案...";
        readonly admin_storage_project_create_success: "專案儲存空間建立成功";
        readonly admin_storage_project_create_guideTitle: "建立專案儲存空間";
        readonly admin_storage_project_create_guideDesc: "為專案儲存建立一個新的 PVC。";
        readonly admin_storage_project_form_project: "專案";
        readonly admin_storage_project_form_capacity: "容量";
        readonly admin_storage_project_form_capacityHint: "例如：10Gi";
        readonly admin_storage_project_create_submit: "建立儲存空間";
        readonly admin_storage_project_action_expandPrompt: "擴充儲存容量";
        readonly admin_storage_project_action_confirmDelete: "您確定要刪除此儲存空間嗎？";
        readonly admin_storage_project_list_project: "專案";
        readonly admin_storage_project_list_status: "狀態";
        readonly admin_storage_project_list_capacity: "容量";
        readonly admin_storage_project_list_age: "建立時間";
        readonly admin_storage_project_list_actions: "動作";
        readonly admin_storage_project_list_empty: "找不到專案儲存空間。";
        readonly admin_storage_project_action_edit: "編輯";
        readonly admin_storage_project_action_delete: "刪除";
        readonly admin_storage_project_tab_list: "列表";
        readonly admin_storage_project_tab_create: "建立";
        readonly admin_storage_project_error_selectProject: "請選擇一個專案";
        readonly admin_storage_user_successInit: "儲存空間初始化成功";
        readonly admin_storage_user_confirmDelete: "您確定要刪除此儲存空間嗎？";
        readonly admin_storage_user_successDelete: "儲存空間已成功刪除";
        readonly admin_storage_user_successExpand: "儲存空間擴充成功";
        readonly admin_storage_user_targetUser: "目標使用者";
        readonly admin_storage_user_username: "使用者名稱";
        readonly admin_storage_user_usernamePlaceholder: "輸入使用者名稱";
        readonly admin_storage_user_checkStatus: "檢查狀態";
        readonly admin_storage_user_statusExists: "儲存空間存在";
        readonly admin_storage_user_statusMissing: "儲存空間缺失";
        readonly admin_storage_user_lifecycleTitle: "儲存生命週期";
        readonly admin_storage_user_hintUnknown: "狀態未知";
        readonly admin_storage_user_hintMissing: "找不到儲存空間";
        readonly admin_storage_user_hintExists: "儲存空間啟用中";
        readonly admin_storage_user_processing: "處理中...";
        readonly admin_storage_user_initBtn: "初始化儲存空間";
        readonly admin_storage_user_deleteBtn: "刪除儲存空間";
        readonly admin_storage_user_checkStatusFirst: "請先檢查狀態";
        readonly admin_storage_user_expandTitle: "擴充儲存空間";
        readonly admin_storage_user_newSize: "新容量 (GB)";
        readonly admin_storage_user_newSizePlaceholder: "例如：50";
        readonly admin_storage_user_expandBtn: "擴充儲存空間";
        readonly admin_storage_title: "儲存管理";
        readonly admin_storage_tab_user: "使用者儲存 (Hub)";
        readonly admin_storage_tab_project: "專案儲存 (PVC)";
        readonly storage_startDrive: "啟動硬碟";
        readonly storage_stopDrive: "停止硬碟";
        readonly storage_openBrowser: "開啟檔案瀏覽器";
        readonly pagination_prev: "上一頁";
        readonly pagination_pageOf: "第 {current} 頁，共 {total} 頁";
        readonly pagination_next: "下一頁";
        readonly pagination: {
            readonly prev: "上一頁";
            readonly next: "下一頁";
            readonly pageOf: "第 {current} 頁，共 {total} 頁";
        };
        readonly sidebar: {
            readonly dashboard: "儀表板";
            readonly admin: "管理後台";
            readonly projects: "專案";
            readonly groups: "群組";
            readonly pods: "Pods";
            readonly fileBrowser: "雲端檔案總管";
            readonly forms: "我的表單";
            readonly menu: "選單";
            readonly jobs: "工作任務 (Jobs)";
            readonly ecommerce: "電子商務";
        };
        readonly storage: {
            readonly pageTitle: "雲端檔案總管";
            readonly breadcrumb: "雲端檔案總管";
            readonly starting: "正在啟動儲存瀏覽器...";
            readonly stopping: "正在停止儲存瀏覽器...";
            readonly actionFailed: "動作失敗，請重試。";
            readonly errLoadList: "無法載入儲存列表";
            readonly project: {
                readonly colProject: "專案";
                readonly colStatus: "狀態";
                readonly emptyFilter: "沒有符合 \"{term}\" 的專案。";
                readonly emptyAssigned: "您的群組未被指派任何專案。";
            };
            readonly tab: {
                readonly personal: "個人儲存中心";
                readonly project: "專案儲存空間";
            };
            readonly readWrite: "讀寫 (Read/Write)";
            readonly readOnly: "唯讀 (Read Only)";
            readonly online: "線上";
            readonly offline: "離線";
            readonly scanning: "正在掃描磁區...";
            readonly action: {
                readonly start: "啟動硬碟";
                readonly stop: "停止硬碟";
                readonly open: "開啟瀏覽器";
            };
            readonly msg: {
                readonly starting: "正在啟動儲存瀏覽器...";
                readonly stopping: "正在停止儲存瀏覽器...";
                readonly actionFailed: "動作失敗，請重試。";
                readonly loadFailed: "無法載入儲存列表。";
            };
            readonly personal: {
                readonly title: "個人儲存中心";
                readonly description: "透過安全入口存取您的私人儲存空間。";
                readonly noStorageTitle: "儲存空間未初始化";
                readonly noStorageDesc: "您的個人儲存空間尚未配置。";
                readonly contactAdmin: "請聯繫管理員以初始化您的儲存空間。";
            };
            readonly pageSubtitle: "瀏覽並管理您的儲存磁區與專案硬碟。";
            readonly projectList: {
                readonly colProject: "專案";
                readonly colStatus: "狀態";
                readonly emptyFilter: "沒有符合 \"{term}\" 的專案。";
                readonly emptyAssigned: "您的群組未被指派任何專案。";
            };
            readonly colProject: "專案";
            readonly colStatus: "狀態";
            readonly emptyFilter: "沒有符合 \"{term}\" 的專案。";
            readonly emptyAssigned: "您的群組未被指派任何專案。";
        };
        readonly admin: {
            readonly dashboard: "儀表板";
            readonly storageManagement: {
                readonly title: "儲存管理";
                readonly userTab: "使用者 Hubs";
                readonly projectTab: "專案 PVCs";
                readonly initUser: "初始化儲存";
                readonly deleteUser: "刪除 Hub";
                readonly expandUser: "擴充容量";
                readonly hintExists: "儲存空間啟用中 (Ready)。";
                readonly hintMissing: "找不到儲存空間。";
                readonly confirmDelete: "您確定要「永久」刪除此儲存空間嗎？";
            };
            readonly pvc: {
                readonly title: "PVC 管理";
                readonly createTitle: "建立新 PVC";
                readonly expandTitle: "擴充 PVC";
                readonly sizeLabel: "大小 (Gi)";
            };
            readonly forms: "表單";
        };
        readonly project: {
            readonly list: {
                readonly title: "專案列表";
                readonly create: "新專案";
                readonly empty: {
                    readonly filter: "沒有符合 \"{term}\" 的專案。";
                    readonly assigned: "未指派專案。";
                };
            };
            readonly detail: {
                readonly overview: "概覽";
                readonly members: "成員";
                readonly settings: "設定";
            };
            readonly create: {
                readonly title: "建立新專案";
                readonly error: "建立專案失敗";
                readonly name: "專案名稱";
                readonly namePlaceholder: "輸入唯一的專案名稱";
                readonly description: "描述";
                readonly descriptionPlaceholder: "輸入專案描述";
                readonly group: "群組";
                readonly groupPlaceholder: "選擇一個群組";
                readonly gpuQuota: "GPU 配額";
                readonly gpuQuotaPlaceholder: "例如：1";
                readonly gpuThreadLimit: "MPS 執行緒限制 (%)";
                readonly gpuThreadLimitPlaceholder: "例如：100";
                readonly gpuMemoryLimit: "MPS 記憶體限制 (MB)";
                readonly gpuMemoryLimitPlaceholder: "例如：1024";
                readonly gpuAccessMode: "GPU 存取模式";
                readonly gpuAccessShared: "共享 (MPS)";
                readonly gpuAccessDedicated: "專用";
                readonly mpsSettings: "MPS 設定";
                readonly mpsThreadLimit: "執行緒限制";
                readonly mpsMemoryLimit: "記憶體限制";
                readonly noGroupsFound: "找不到群組。請先建立群組。";
                readonly selectedId: "已選群組 ID: {id}";
                readonly cancel: "取消";
                readonly submit: "建立專案";
                readonly creating: "建立中...";
                readonly groupLabel: "群組";
                readonly gpuLabel: "GPU 配額";
            };
            readonly edit: {
                readonly title: "編輯專案";
            };
            readonly role: {
                readonly admin: "管理員";
                readonly manager: "經理";
                readonly user: "使用者";
            };
            readonly members: {
                readonly title: "成員";
                readonly description: "管理群組 {groupId} 的成員。";
                readonly searchPlaceholder: "搜尋成員...";
                readonly addMember: "新增成員";
            };
            readonly untitled: "無標題";
            readonly idLabel: "專案 ID: {id}";
            readonly delete: "刪除專案: {name}";
            readonly requestSupport: "請求支援";
            readonly gpuResources: "GPU 資源";
            readonly gpuQuotaUnit: "{quota} GPU";
            readonly gpuAccessMode: "存取模式";
            readonly gpuAccessShared: "共享";
            readonly gpuAccessDedicated: "專用";
            readonly mpsSettings: "MPS 設定";
            readonly mpsThreadLimit: "執行緒限制: {value}%";
            readonly mpsMemoryLimit: "記憶體限制: {value} MB";
            readonly mpsUnlimited: "無限制";
            readonly noDescription: "無描述";
        };
        readonly projectList: {
            readonly title: "專案";
            readonly searchPlaceholder: "搜尋專案...";
            readonly loading: "載入專案中...";
            readonly errorPrefix: "載入專案發生錯誤：";
            readonly empty: {
                readonly filter: "沒有符合 \"{term}\" 的專案。";
                readonly noProjects: "找不到專案。";
            };
        };
        readonly members: {
            readonly noneFound: "找不到成員。";
            readonly noMatch: "沒有符合搜尋條件的成員。";
        };
        readonly role: {
            readonly label: "角色: {role}";
        };
        readonly projectDetail: {
            readonly needProjectId: "需要專案 ID";
            readonly fetchError: "無法讀取專案詳情";
            readonly createConfigError: "建立設定失敗";
            readonly updateConfigError: "更新設定失敗";
            readonly deleteConfigError: "刪除設定失敗";
            readonly instanceCreateSent: "實例建立請求已發送";
            readonly createInstanceError: "建立實例失敗";
            readonly confirmDeleteInstance: "您確定要刪除此實例嗎？";
            readonly instanceDeleteSent: "實例刪除請求已發送";
            readonly deleteInstanceError: "刪除實例失敗";
            readonly errorTitle: "錯誤";
            readonly notFoundTitle: "找不到專案";
            readonly notFoundMessage: "找不到 ID 為 {id} 的專案。";
            readonly titleSuffix: "專案詳情";
            readonly description: "管理專案 {name} 的設定、儲存與成員。";
            readonly tab: {
                readonly overview: "概覽";
                readonly configurations: "設定";
                readonly storage: "儲存";
                readonly members: "成員";
            };
            readonly infoLabel: "專案資訊";
            readonly createdAt: "建立時間";
            readonly updatedAt: "更新時間";
            readonly configTitle: "設定";
            readonly configDesc: "管理專案設定與部署。";
            readonly addConfig: "新增設定";
            readonly pvcTitle: "儲存 (PVC)";
            readonly pvcDesc: "管理專案持續性磁碟區宣告 (PVC)。";
        };
        readonly monitor: {
            readonly title: "即時監控";
            readonly panel: {
                readonly title: "即時監控";
                readonly subtitle: "即時日誌與狀態更新。";
            };
            readonly col: {
                readonly eventType: "事件類型";
                readonly kind: "種類 (Kind)";
                readonly name: "名稱";
                readonly endpoint: "端點";
                readonly status: "狀態";
            };
            readonly agePrefix: "存在時間";
            readonly status: {
                readonly running: "執行中";
                readonly pending: "等待中";
                readonly failed: "失敗";
                readonly unknown: "未知";
                readonly active: "活躍";
                readonly completed: "已完成";
                readonly succeeded: "成功";
                readonly added: "已新增";
                readonly creating: "建立中";
                readonly modified: "已修改";
                readonly error: "錯誤";
                readonly deleted: "已刪除";
                readonly idle: "閒置";
            };
            readonly waiting: "等待叢集資料串流...";
        };
        readonly user: {
            readonly profile: "個人檔案";
            readonly signOut: "登出";
            readonly login: "登入";
            readonly editProfile: "編輯個人檔案";
            readonly support: "支援";
        };
        readonly auth: {
            readonly login: {
                readonly title: "登入";
                readonly subtitle: "輸入您的使用者名稱和密碼以登入！";
                readonly username: "使用者名稱";
                readonly usernamePlaceholder: "輸入您的使用者名稱";
                readonly password: "密碼";
                readonly passwordPlaceholder: "輸入您的密碼";
                readonly forgotPassword: "忘記密碼？";
                readonly submit: "登入";
                readonly noAccount: "還沒有帳號？";
                readonly signUp: "註冊";
                readonly backToDashboard: "返回儀表板";
                readonly loginFailed: "登入失敗，請重試。";
                readonly pageTitle: "登入 | AI 平台";
                readonly pageDescription: "這是 AI 平台的登入頁面";
            };
            readonly signOut: "登出";
            readonly signIn: "登入";
        };
        readonly groups: {
            readonly form: {
                readonly title: "建立群組";
                readonly nameRequired: "群組名稱為必填";
                readonly createFailed: "建立群組失敗";
                readonly creating: "建立中...";
                readonly cancel: "取消";
            };
            readonly namePlaceholder: "輸入群組名稱...";
            readonly descriptionPlaceholder: "輸入描述...";
            readonly creating: "正在建立群組...";
            readonly createButton: "建立群組";
            readonly nameLabel: "群組名稱";
            readonly descriptionLabel: "描述";
            readonly empty: {
                readonly title: "沒有群組";
                readonly description: "您尚未加入任何群組。";
            };
            readonly error: {
                readonly loadFailed: "無法載入群組";
            };
            readonly noDescription: "無描述";
        };
        readonly groupList: {
            readonly title: "群組";
            readonly description: "瀏覽並管理群組。";
            readonly searchPlaceholder: "搜尋群組...";
            readonly loading: "載入群組中...";
            readonly deleteGroupAria: "刪除群組";
            readonly noDescription: "無描述";
            readonly empty: {
                readonly filter: "沒有符合 \"{term}\" 的群組。";
                readonly noGroups: "找不到群組。";
                readonly filterTip: "請嘗試不同的搜尋詞。";
                readonly noGroupsTip: "建立一個新群組以開始使用。";
            };
        };
        readonly language: {
            readonly aria: "語言選擇器";
            readonly switchToEn: "切換至英文";
            readonly switchToZh: "切換至中文";
            readonly short: "中";
            readonly switchLabel: "切換語言";
        };
        readonly notification: {
            readonly title: "通知";
            readonly requestChange: "請求變更";
            readonly project: "專案";
            readonly viewAll: "查看全部";
        };
        readonly invite: {
            readonly selectUserError: "請選擇要邀請的使用者";
            readonly unknownError: "邀請使用者時發生未知錯誤";
            readonly title: "邀請使用者";
            readonly description: "邀請使用者加入專案或群組";
            readonly userLabel: "使用者";
            readonly userSearchPlaceholder: "搜尋使用者...";
            readonly noResults: "找不到使用者";
        };
        readonly form: {
            readonly title: "提交表單";
            readonly history: {
                readonly title: "歷史紀錄";
                readonly empty: "無歷史紀錄。";
                readonly loading: "載入歷史紀錄中...";
            };
            readonly apply: {
                readonly title: "申請";
            };
            readonly status: {
                readonly pending: "待審核";
                readonly approved: "已核准";
                readonly rejected: "已駁回";
                readonly processing: "處理中";
                readonly completed: "已完成";
            };
            readonly action: {
                readonly process: "處理";
                readonly reject: "駁回";
                readonly complete: "完成";
            };
            readonly label: {
                readonly title: "標題";
                readonly description: "描述";
                readonly project: "專案";
            };
            readonly select: {
                readonly none: "無";
            };
            readonly createFailed: "建立表單失敗";
            readonly created: "表單建立成功！";
            readonly field: {
                readonly title: "標題";
                readonly description: "描述";
            };
            readonly exampleTitle: "範例標題";
            readonly placeholder: {
                readonly title: "輸入標題...";
                readonly description: {
                    readonly base: "輸入描述...";
                    readonly long: "輸入詳細描述...";
                };
            };
            readonly projectId: "專案 ID: {id}";
            readonly cancel: "取消";
            readonly submitting: "提交中...";
            readonly submit: "送出";
        };
        readonly search: {
            readonly projectsPlaceholder: "搜尋專案...";
        };
        readonly table: {
            readonly id: "ID";
            readonly user: "使用者";
            readonly project: "專案";
            readonly titleDesc: "標題 / 描述";
            readonly status: "狀態";
            readonly actions: "動作";
        };
        readonly terminal: {
            readonly connected: "已連線";
            readonly websocketError: "WebSocket 錯誤";
            readonly disconnected: "已斷線";
        };
        readonly badge: {
            readonly new: "新";
            readonly pro: "專業版";
        };
        readonly view: {
            readonly toggleToAdmin: "切換至管理員";
            readonly toggleToUser: "切換至使用者";
            readonly grid: "網格檢視";
            readonly list: "列表檢視";
        };
        readonly loading: {
            readonly forms: "載入表單中...";
        };
        readonly button: {
            readonly newGroup: "新群組";
            readonly newProject: "新專案";
        };
    };
};
/**
 * Recursive type helper to convert nested objects into dot-notation paths.
 * Example: { project: { create: { title: '...' } } } -> 'project.create.title'
 */
type Path<T> = T extends object ? {
    [K in keyof T]: K extends string ? (T[K] extends string ? K : `${K}.${Path<T[K]>}`) : never;
}[keyof T] : never;
export type LocaleKey = Path<typeof en>;
export type Locale = 'en' | 'zh';
/**
 * Main translation function.
 * @param lang Target language code ('zh' | 'en')
 * @param key The strong-typed key path
 * @param vars Optional variables for interpolation (e.g., { name: 'John' })
 */
export declare const t: (lang: Locale, key: LocaleKey, vars?: Record<string, string | number>) => string;
export default resources;
//# sourceMappingURL=index.d.ts.map