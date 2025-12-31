const en = {
    // --- Global / Generic ---
    brand: {
        name: 'AI Platform',
    },
    common: {
        // Actions
        create: 'Create',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        submit: 'Submit',
        save: 'Save',
        search: 'Search...',
        remove: 'Remove', // [New]
        actions: 'Actions', // [New]
        // States
        loading: 'Loading...',
        submitting: 'Submitting...',
        success: 'Success',
        error: 'Error',
        // Labels
        id: 'ID',
        name: 'Name',
        description: 'Description',
        status: 'Status',
        createdAt: 'Created At',
        updatedAt: 'Updated At', // [New]
        noData: 'No data found.',
        untitled: 'Untitled',
        confirmDelete: 'Are you sure you want to delete?',
    },
    // --- Status ---
    status: {
        active: 'Active',
        idle: 'Idle',
    },
    // --- Navigation & Structure ---
    breadcrumb: {
        home: 'Home',
        projects: 'Projects',
        groups: 'Groups', // Added missing key inferred from context
    },
    breadcrumb_groups: 'Groups',
    // --- Admin & Groups (Legacy/Flat) ---
    admin_manageProjects: 'Manage Projects',
    admin_manageGroups: 'Manage Groups',
    admin_forms: 'Forms Management',
    groups_error_userNotLogged: 'User not logged in',
    groups_error_userIdMissing: 'User ID is missing',
    groups_error_unknown: 'Unknown error',
    groups_noMatch: 'No groups match "{term}".',
    groups_page_title: 'Groups',
    groups_page_description: 'Manage your groups here.',
    groups_myGroups: 'My Groups',
    groups_subtitle: 'Manage and join groups.',
    groups_searchPlaceholder: 'Search groups...',
    groups_createNew: 'Create New Group',
    // --- Monitor ---
    monitor_table_podName: 'Pod Name',
    monitor_table_namespace: 'Namespace',
    monitor_table_status: 'Status',
    monitor_table_actions: 'Actions',
    monitor_empty_noPods: 'No pods found.',
    monitor_button_connect: 'Connect',
    monitor_empty_waitingForData: 'Waiting for cluster data stream...',
    // --- Error (Flat) ---
    error_initData: 'Failed to initialize data',
    error_selectGroup: 'Please select a group',
    error_invalidProjectData: 'Invalid project data',
    error_createProject: 'Failed to create project',
    error_deleteProject: 'Failed to delete project',
    error_deleteFailed: 'Delete failed',
    error_fetchGroups: 'Failed to fetch groups',
    error_createGroup: 'Failed to create group',
    error_deleteGroup: 'Failed to delete group',
    error_userNotLogged: 'User not logged in',
    error_fetchData: 'Failed to fetch data',
    // --- Error (Nested - Added for compatibility with TS errors) ---
    error: {
        fetchGroups: 'Failed to fetch groups',
        createGroup: 'Failed to create group',
        deleteGroup: 'Failed to delete group',
        deleteFailed: 'Delete failed',
        initData: 'Failed to initialize data',
        selectGroup: 'Please select a group',
        invalidProjectData: 'Invalid project data',
        createProject: 'Failed to create project',
        deleteProject: 'Failed to delete project',
        fetchData: 'Failed to fetch data',
        userNotLogged: 'User not logged in',
    },
    // --- Project & Groups (Flat) ---
    project_noDescription: 'No description',
    groupId: 'Group ID',
    // --- Pages (Flat) ---
    page_admin_title: 'Admin Dashboard',
    page_admin_description: 'Admin center',
    page_manageGroups_title: 'Manage Groups',
    page_manageGroups_description: 'Manage your organization groups.',
    page_projects_title: 'Projects',
    page_projects_description: 'List of accessible projects.',
    page_adminForm_title: 'Forms Dashboard',
    page_adminForm_description: 'Manage user-submitted forms.',
    page_notFound_title: 'Not Found',
    page_notFound_description: 'This is the 404 page for AI Platform.',
    page_notFound_message: "We couldn't find the page you were looking for!",
    page_notFound_back: 'Back to Home',
    page_home_title: 'Dashboard',
    page_home_description: 'Welcome to your dashboard',
    // --- Pages (Nested - Added for TS errors) ---
    page: {
        adminForm: {
            title: 'Forms Dashboard',
            description: 'Manage user-submitted forms.',
        },
        projects: {
            title: 'Projects',
            description: 'List of accessible projects.',
        },
        // Added manageGroups for TS compatibility
        manageGroups: {
            title: 'Manage Groups',
            description: 'Manage your organization groups.',
        },
    },
    home_welcome: 'Welcome to AI Platform',
    home_subtitle: 'Manage your projects, groups, and pods here.',
    view_grid: 'Grid View',
    view_list: 'List View',
    search_projectsPlaceholder: 'Search projects...',
    search_placeholder: 'Search...',
    // --- Forms (Legacy Flat) ---
    form_error_titleRequired: 'Title is required',
    form_success_submitted: 'Submitted successfully, admin will review soon.',
    form_error_submitFailed: 'Submission failed',
    form_history_title: 'History',
    form_apply_title: 'Apply',
    form_page_title: 'Form Page',
    form_page_description: 'Submit and manage your forms.',
    form_status_pending: 'Pending',
    form_status_approved: 'Approved',
    form_status_rejected: 'Rejected',
    form_action_process: 'Process',
    form_action_reject: 'Reject',
    form_action_complete: 'Complete',
    form_created: 'Form created successfully!',
    form_createFailed: 'Failed to create form:',
    form_exampleTitle: 'Example Title',
    form_field_title: 'Title',
    form_field_description: 'Description',
    form_placeholder_description: 'Enter description...',
    form_projectId: 'Related Project ID: {id}',
    // --- Tables (Flat) ---
    table_id: 'ID',
    table_user: 'User',
    table_role: 'Role',
    table_project: 'Project',
    table_titleDesc: 'Title / Description',
    table_status: 'Status',
    table_actions: 'Actions',
    // --- Config Wizard ---
    config_error_filenameRequired: 'Filename is required',
    config_error_filenameSuffix: 'Filename must end with .yaml or .yml',
    config_error_yamlEmpty: 'YAML content cannot be empty',
    config_createTitle: 'Create New Config',
    config_createSubtitle: 'Use wizard or edit YAML directly.',
    config_tab_wizard: 'Wizard Mode',
    config_tab_yaml: 'Raw YAML',
    config_filename_label: 'Config Filename',
    config_filename_prefix: 'Filename:',
    config_filename_note: 'Must be unique and end with .yaml or .yml',
    config_wizard_imageLabel: 'Container Image',
    config_wizard_imageNote: 'Specify the image to use.',
    config_wizard_gpuLabel: 'GPU Quota',
    config_wizard_pvcLabel: 'PVC',
    config_pvc_placeholder: 'Select PVC...',
    config_pvc_loading: 'Loading PVCs...',
    config_pvc_note: 'Select a PVC for storage.',
    config_mountPath: 'Mount Path',
    config_commandLabel: 'Command',
    config_argsLabel: 'Arguments',
    config_yamlContentLabel: 'YAML Content',
    config_creating: 'Creating...',
    config_createButton: 'Create Config',
    // --- Config File List / Actions ---
    configFile: {
        editFile: 'Edit file',
        destroyInstance: 'Destroy instance',
        deleteFile: 'Delete file',
        notFoundTitle: 'No config files found',
        notFoundDesc: 'Click "Add Config" to get started.',
        toggleResources: 'Toggle resources',
        id: 'ID',
        createdAt: 'Created At',
        deployInstance: 'Deploy instance',
        deploy: 'Deploy',
        relatedResources: 'Related Resources',
        noRelatedResources: 'No related resources',
        notDeployed: 'This config file has not been deployed yet.',
    },
    // --- Storage Admin ---
    admin_storage_project_form_projectPlaceholder: 'Select project...',
    admin_storage_project_create_success: 'Project storage created successfully',
    admin_storage_project_create_guideTitle: 'Create Project Storage',
    admin_storage_project_create_guideDesc: 'Create a new PVC for project storage.',
    admin_storage_project_form_project: 'Project',
    admin_storage_project_form_capacity: 'Capacity',
    admin_storage_project_form_capacityHint: 'e.g., 10Gi',
    admin_storage_project_create_submit: 'Create Storage',
    admin_storage_project_action_expandPrompt: 'Expand Storage Capacity',
    admin_storage_project_action_confirmDelete: 'Are you sure you want to delete this storage?',
    admin_storage_project_list_project: 'Project',
    admin_storage_project_list_status: 'Status',
    admin_storage_project_list_capacity: 'Capacity',
    admin_storage_project_list_age: 'Age',
    admin_storage_project_list_actions: 'Actions',
    admin_storage_project_list_empty: 'No project storage found.',
    admin_storage_project_action_edit: 'Edit',
    admin_storage_project_action_delete: 'Delete',
    admin_storage_project_tab_list: 'List',
    admin_storage_project_tab_create: 'Create',
    admin_storage_project_error_selectProject: 'Please select a project',
    admin_storage_user_successInit: 'Storage initialized successfully',
    admin_storage_user_confirmDelete: 'Are you sure you want to delete this storage?',
    admin_storage_user_successDelete: 'Storage deleted successfully',
    admin_storage_user_successExpand: 'Storage expanded successfully',
    admin_storage_user_targetUser: 'Target User',
    admin_storage_user_username: 'Username',
    admin_storage_user_usernamePlaceholder: 'Enter username',
    admin_storage_user_checkStatus: 'Check Status',
    admin_storage_user_statusExists: 'Storage exists',
    admin_storage_user_statusMissing: 'Storage missing',
    admin_storage_user_lifecycleTitle: 'Storage Lifecycle',
    admin_storage_user_hintUnknown: 'Status unknown',
    admin_storage_user_hintMissing: 'No storage found',
    admin_storage_user_hintExists: 'Storage is active',
    admin_storage_user_processing: 'Processing...',
    admin_storage_user_initBtn: 'Initialize Storage',
    admin_storage_user_deleteBtn: 'Delete Storage',
    admin_storage_user_checkStatusFirst: 'Check Status First',
    admin_storage_user_expandTitle: 'Expand Storage',
    admin_storage_user_newSize: 'New Size (GB)',
    admin_storage_user_newSizePlaceholder: 'e.g., 50',
    admin_storage_user_expandBtn: 'Expand Storage',
    admin_storage_title: 'Storage Administration',
    admin_storage_tab_user: 'User Storage (Hub)',
    admin_storage_tab_project: 'Project Storage (PVC)',
    storage_startDrive: 'Start Drive',
    storage_stopDrive: 'Stop Drive',
    storage_openBrowser: 'Open Browser',
    // --- Pagination (Flat) ---
    pagination_prev: 'Previous',
    pagination_pageOf: 'Page {current} of {total}',
    pagination_next: 'Next',
    // --- Pagination (Nested - Added for TS errors) ---
    pagination: {
        prev: 'Previous',
        next: 'Next',
        pageOf: 'Page {current} of {total}',
    },
    role: {
        admin: 'Administrator',
        adminDesc: 'Full access to all resources and settings.',
        manager: 'Manager',
        managerDesc: 'Can manage projects, groups, and members.',
        user: 'User',
        userDesc: 'Can access and use assigned projects.',
        label: 'Role: {role}',
    },
    sidebar: {
        dashboard: 'Dashboard',
        admin: 'Admin',
        projects: 'Projects',
        groups: 'Groups',
        pods: 'Pods',
        fileBrowser: 'Cloud Explorer',
        forms: 'My Forms',
        menu: 'Menu',
        jobs: 'Jobs',
        ecommerce: 'E-commerce',
    },
    // --- Features ---
    // 1. Storage & File Browser (Unified)
    storage: {
        pageTitle: 'Cloud Explorer',
        breadcrumb: 'Cloud Explorer',
        // Missing top-level keys requested by TS errors
        starting: 'Starting storage browser...',
        stopping: 'Stopping storage browser...',
        actionFailed: 'Action failed. Please try again.',
        errLoadList: 'Failed to load storage list',
        project: 'Project',
        // Tabs
        tab: {
            personal: 'Personal Hub',
            project: 'Project Storage',
        },
        // Status Badges
        readWrite: 'Read/Write',
        readOnly: 'Read Only',
        online: 'Online',
        offline: 'Offline',
        scanning: 'Scanning volumes...',
        // Actions
        action: {
            start: 'Start Drive',
            stop: 'Stop Drive',
            open: 'Open Browser',
        },
        // Messages / Toasts
        msg: {
            starting: 'Starting storage browser...',
            stopping: 'Stopping storage browser...',
            actionFailed: 'Action failed. Please try again.',
            loadFailed: 'Could not load storage list.',
        },
        // Personal Hub Specifics
        personal: {
            title: 'Personal Storage Hub',
            description: 'Access your private storage space via Secure Ingress.',
            noStorageTitle: 'Storage Not Initialized',
            noStorageDesc: 'Your personal storage space has not been provisioned yet.',
            contactAdmin: 'Please contact an administrator to initialize your storage.',
        },
        pageSubtitle: 'Browse and manage your storage volumes and project drives.',
        // Keep original nested structure for compatibility if needed
        colProject: 'Project',
        colStatus: 'Status',
        emptyFilter: 'No projects match "{term}".',
        emptyAssigned: 'No projects assigned to your groups.',
    },
    // 2. Admin Module
    admin: {
        dashboard: 'Dashboard',
        storageManagement: {
            title: 'Storage Administration',
            userTab: 'User Hubs',
            projectTab: 'Project PVCs',
            initUser: 'Initialize Storage',
            deleteUser: 'Delete Hub',
            expandUser: 'Expand Capacity',
            hintExists: 'Storage is active (Ready).',
            hintMissing: 'No storage found.',
            confirmDelete: 'Are you sure you want to PERMANENTLY delete this storage?',
        },
        pvc: {
            title: 'PVC Management',
            createTitle: 'Create New PVC',
            expandTitle: 'Expand PVC',
            sizeLabel: 'Size (Gi)',
        },
        forms: 'Forms',
    },
    // 3. Project Module
    project: {
        about: 'About Project', // [New]
        name: 'Project Name', // [New]
        description: 'Description', // [New]
        group: 'Group', // [New]
        noDescription: 'No description',
        untitled: 'Untitled',
        idLabel: 'Project ID: {id}',
        requestSupport: 'Request Support',
        empty: 'No projects available.', // [New],
        list: {
            title: 'Projects',
            create: 'New Project',
            empty: {
                filter: 'No projects match "{term}".',
                assigned: 'No projects assigned.',
            },
        },
        detail: {
            overview: 'Overview',
            members: 'Members',
            settings: 'Settings',
        },
        // --- NEW: Create Project Form ---
        create: {
            title: 'Create New Project',
            error: 'Failed to create project',
            name: 'Project Name',
            namePlaceholder: 'Enter unique project name',
            description: 'Description',
            descriptionPlaceholder: 'Enter project description',
            group: 'Group',
            groupPlaceholder: 'Select a group',
            gpuQuota: 'GPU Quota',
            gpuQuotaPlaceholder: 'e.g. 1',
            gpuThreadLimit: 'MPS Thread Limit (%)',
            gpuThreadLimitPlaceholder: 'e.g. 100',
            gpuMemoryLimit: 'MPS Memory Limit (MB)',
            gpuMemoryLimitPlaceholder: 'e.g. 1024',
            gpuAccessMode: 'GPU Access Mode',
            gpuAccessShared: 'Shared (MPS)',
            gpuAccessDedicated: 'Dedicated',
            mpsSettings: 'MPS Settings',
            mpsThreadLimit: 'Thread Limit',
            mpsMemoryLimit: 'Memory Limit',
            noGroupsFound: 'No groups found. Please create a group first.',
            selectedId: 'Selected Group ID: {id}',
            cancel: 'Cancel',
            submit: 'Create Project',
            creating: 'Creating...',
            groupLabel: 'Group', // Existing key
            gpuLabel: 'GPU Quota', // Existing key
        },
        // --- NEW: Edit Project Form ---
        edit: {
            title: 'Edit Project',
        },
        role: {
            admin: 'Administrator',
            manager: 'Manager',
            user: 'User',
        },
        members: {
            title: 'Members',
            description: 'Manage members of group {groupId}.',
            searchPlaceholder: 'Search members...',
            addMember: 'Add Member',
        },
        delete: 'Delete project: {name}',
        gpuResources: 'GPU Resources',
        gpuQuotaUnit: '{quota} GPU(s)',
        gpuAccessMode: 'Access Mode',
        gpuAccessShared: 'Shared',
        gpuAccessDedicated: 'Dedicated',
        mpsSettings: 'MPS Settings',
        mpsThreadLimit: 'Thread Limit: {value}%',
        mpsMemoryLimit: 'Memory Limit: {value} MB',
        mpsUnlimited: 'Unlimited',
    },
    // --- Project List ---
    projectList: {
        title: 'Projects',
        searchPlaceholder: 'Search projects...',
        loading: 'Loading projects...',
        errorPrefix: 'Error:',
        empty: {
            filter: 'No projects match "{term}".',
            noProjects: 'No projects found.',
        },
        colProject: 'Project',
        colStatus: 'Status',
        emptyFilter: 'No projects match "{term}".',
        emptyAssigned: 'No projects assigned to your groups.',
    },
    // --- Members ---
    members: {
        noneFound: 'No members found.',
        noMatch: 'No members match your search.',
    },
    // --- Role ---
    // (removed duplicate role key, merged into the main role object above)
    // --- Project Detail ---
    projectDetail: {
        needProjectId: 'Project ID is required',
        fetchError: 'Failed to fetch project details',
        createConfigError: 'Failed to create configuration',
        updateConfigError: 'Failed to update configuration',
        deleteConfigError: 'Failed to delete configuration',
        instanceCreateSent: 'Instance creation request sent',
        createInstanceError: 'Failed to create instance',
        confirmDeleteInstance: 'Are you sure you want to delete this instance?',
        instanceDeleteSent: 'Instance deletion request sent',
        deleteInstanceError: 'Failed to delete instance',
        errorTitle: 'Error',
        notFoundTitle: 'Project Not Found',
        notFoundMessage: 'Project with ID {id} was not found.',
        titleSuffix: 'Project Details',
        description: 'Manage project {name} configurations, storage, and members.',
        tab: {
            overview: 'Overview',
            configurations: 'Configurations',
            storage: 'Storage',
            members: 'Members',
        },
        infoLabel: 'Project Information',
        createdAt: 'Created At',
        updatedAt: 'Updated At',
        configTitle: 'Configurations',
        configDesc: 'Manage project configurations and deployments.',
        addConfig: 'Add Configuration',
        pvcTitle: 'Storage (PVC)',
        pvcDesc: 'Manage project persistent volume claims.',
    },
    // 4. Monitoring
    monitor: {
        title: 'Real-time Monitoring',
        panel: {
            title: 'Real-time Monitoring',
            subtitle: 'Real-time logs and status updates.',
        },
        col: {
            kind: 'Kind',
            name: 'Name',
            details: 'Details',
            age: 'Age',
            status: 'Status',
            images: 'Images',
            restarts: 'Restarts',
            labels: 'Labels',
        },
        agePrefix: 'Age',
        status: {
            running: 'Running',
            pending: 'Pending',
            failed: 'Failed',
            unknown: 'Unknown',
            active: 'Active',
            completed: 'Completed',
            succeeded: 'Succeeded',
            added: 'Added',
            creating: 'Creating',
            modified: 'Modified',
            error: 'Error',
            deleted: 'Deleted',
            idle: 'Idle',
        },
        waiting: 'Waiting for cluster data stream...',
    },
    // 5. User / Auth
    user: {
        profile: 'Profile',
        signOut: 'Sign out',
        login: 'Login',
        editProfile: 'Edit Profile', // Added
        support: 'Support', // Added
    },
    // --- Authentication / Login ---
    auth: {
        login: {
            title: 'Login',
            subtitle: 'Enter your username and password to login!',
            username: 'Username',
            usernamePlaceholder: 'Enter your username',
            password: 'Password',
            passwordPlaceholder: 'Enter your password',
            forgotPassword: 'Forgot password?',
            submit: 'Login',
            noAccount: "Don't have an account?",
            signUp: 'Sign up',
            backToDashboard: 'Back to Dashboard',
            loginFailed: 'Login failed, please try again.',
            pageTitle: 'Login | AI Platform',
            pageDescription: 'This is the login page for AI Platform',
        },
        signOut: 'Sign out',
        signIn: 'Sign in',
    },
    // --- Groups (nested) ---
    groups: {
        // Fields
        name: 'Group Name', // [New]
        description: 'Description', // [New]
        // Detail Page
        infoTitle: 'Group Information', // [New]
        inviteUser: 'Invite User', // [New]
        manageMembers: 'Manage', // [New]
        membersList: 'Group Members', // [New]
        memberCount: '{count} members in this group.', // [New]
        noMembers: 'No members invited yet.', // [New]
        notFound: 'Group not found.', // [New]
        // Tabs
        tab: {
            overview: 'Overview',
            members: 'Members',
            info: 'Info',
        },
        form: {
            title: 'Create Group',
            nameRequired: 'Group name is required',
            createFailed: 'Failed to create group',
            creating: 'Creating...',
            cancel: 'Cancel',
        },
        // Added missing keys inferred from TS errors
        namePlaceholder: 'Enter group name...',
        descriptionPlaceholder: 'Enter description...',
        creating: 'Creating group...',
        createButton: 'Create Group',
        nameLabel: 'Group Name',
        descriptionLabel: 'Description',
        empty: {
            title: 'No Groups',
            description: 'You are not a member of any groups yet.',
        },
        error: {
            loadFailed: 'Failed to load groups',
        },
        noDescription: 'No description',
    },
    // --- Group List ---
    groupList: {
        title: 'Groups',
        description: 'Browse and manage groups.',
        searchPlaceholder: 'Search groups...',
        loading: 'Loading groups...',
        deleteGroupAria: 'Delete group',
        noDescription: 'No description',
        empty: {
            filter: 'No groups match your filter.',
            noGroups: 'No groups available.',
            filterTip: 'Try adjusting your filter criteria.',
            noGroupsTip: 'Create a new group to get started.',
        },
    },
    // --- Language / i18n ---
    language: {
        aria: 'Language selector',
        switchToEn: 'Switch to English',
        switchToZh: 'Switch to Chinese',
        short: 'EN',
        switchLabel: 'Toggle language',
    },
    // --- Notifications ---
    notification: {
        title: 'Notifications',
        requestChange: 'Request Change',
        project: 'Project',
        viewAll: 'View All',
        time: {
            '5min': '5 minutes ago',
            '8min': '8 minutes ago',
            '15min': '15 minutes ago',
            '1hour': '1 hour ago',
        },
    },
    // --- Invite / Members ---
    invite: {
        selectUserError: 'Please select a user to invite',
        unknownError: 'Unknown error occurred while inviting user',
        title: 'Invite User',
        description: 'Invite a user to the project or group',
        userLabel: 'User',
        userSearchPlaceholder: 'Search users...',
        noResults: 'No users found',
    },
    // 6. Forms
    form: {
        title: 'Submit Form',
        // Added Nested History Object
        history: {
            title: 'History',
            empty: 'No history found.',
            loading: 'Loading history...',
        },
        apply: {
            title: 'Apply',
        },
        status: {
            pending: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected',
            processing: 'Processing',
            completed: 'Completed',
        },
        action: {
            process: 'Process',
            reject: 'Reject',
            complete: 'Complete',
        },
        // Added Label Object
        label: {
            title: 'Title',
            description: 'Description',
            project: 'Project',
        },
        // Added Select Object
        select: {
            none: 'None',
        },
        createFailed: 'Failed to create form',
        created: 'Form created successfully!',
        field: {
            title: 'Title',
            description: 'Description',
        },
        exampleTitle: 'Example Title',
        // Updated Placeholder Object to include 'title' and 'description.long'
        placeholder: {
            title: 'Enter title...',
            description: {
                base: 'Enter description...',
                long: 'Enter detailed description...',
            },
        },
        projectId: 'Project ID: {id}',
        cancel: 'Cancel',
        submitting: 'Submitting...',
        submit: 'Submit',
    },
    // 8. Search
    search: {
        projectsPlaceholder: 'Search projects...',
    },
    // 9. Table
    table: {
        id: 'ID',
        user: 'User',
        project: 'Project',
        titleDesc: 'Title / Description',
        status: 'Status',
        actions: 'Actions',
    },
    // 10. Terminal
    terminal: {
        connected: 'Connected',
        websocketError: 'WebSocket Error',
        disconnected: 'Disconnected',
    },
    // 11. Badge
    badge: {
        new: 'New',
        pro: 'Pro',
    },
    // 13. View
    view: {
        toggleToAdmin: 'Switch to Admin',
        toggleToUser: 'Switch to User',
        grid: 'Grid View',
        list: 'List View',
    },
    // 14. Loading
    loading: {
        forms: 'Loading forms...',
    },
    // 17. Button
    button: {
        newGroup: 'New Group',
        newProject: 'New Project',
    },
};
export default en;
