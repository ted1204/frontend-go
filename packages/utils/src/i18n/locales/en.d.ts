/**
 * English (US) Translation Dictionary - Optimized Version
 * Pure nested structure, no redundant flat keys
 * Performance: Significantly reduced file size with better maintainability
 */
declare const en: {
  readonly brand: {
    readonly name: 'AI Platform';
  };
  readonly common: {
    readonly create: 'Create';
    readonly edit: 'Edit';
    readonly delete: 'Delete';
    readonly cancel: 'Cancel';
    readonly submit: 'Submit';
    readonly save: 'Save';
    readonly search: 'Search...';
    readonly remove: 'Remove';
    readonly actions: 'Actions';
    readonly loading: 'Loading...';
    readonly submitting: 'Submitting...';
    readonly success: 'Success';
    readonly error: 'Error';
    readonly id: 'ID';
    readonly name: 'Name';
    readonly description: 'Description';
    readonly status: 'Status';
    readonly createdAt: 'Created At';
    readonly updatedAt: 'Updated At';
    readonly noData: 'No data found.';
    readonly untitled: 'Untitled';
    readonly confirmDelete: 'Are you sure you want to delete?';
  };
  readonly status: {
    readonly active: 'Active';
    readonly idle: 'Idle';
    readonly pending: 'Pending';
    readonly approved: 'Approved';
    readonly rejected: 'Rejected';
    readonly processing: 'Processing';
    readonly completed: 'Completed';
    readonly succeeded: 'Succeeded';
    readonly failed: 'Failed';
    readonly running: 'Running';
    readonly unknown: 'Unknown';
  };
  readonly breadcrumb: {
    readonly home: 'Home';
    readonly projects: 'Projects';
    readonly groups: 'Groups';
  };
  readonly sidebar: {
    readonly dashboard: 'Dashboard';
    readonly admin: 'Admin';
    readonly projects: 'Projects';
    readonly groups: 'Groups';
    readonly pods: 'Pods';
    readonly fileBrowser: 'Cloud Explorer';
    readonly forms: 'My Forms';
    readonly menu: 'Menu';
    readonly jobs: 'Jobs';
    readonly ecommerce: 'E-commerce';
  };
  readonly error: {
    readonly fetch: 'Failed to fetch data';
    readonly fetchGroups: 'Failed to fetch groups';
    readonly fetchData: 'Failed to fetch data';
    readonly createGroup: 'Failed to create group';
    readonly deleteGroup: 'Failed to delete group';
    readonly deleteFailed: 'Delete failed';
    readonly initData: 'Failed to initialize data';
    readonly selectGroup: 'Please select a group';
    readonly invalidProjectData: 'Invalid project data';
    readonly createProject: 'Failed to create project';
    readonly deleteProject: 'Failed to delete project';
    readonly userNotLogged: 'User not logged in';
  };
  readonly page: {
    readonly home: {
      readonly title: 'Dashboard';
      readonly description: 'Welcome to your dashboard';
      readonly welcome: 'Welcome to AI Platform';
      readonly subtitle: 'Manage your projects, groups, and pods here.';
    };
    readonly admin: {
      readonly title: 'Admin Dashboard';
      readonly description: 'Admin center';
      readonly manageProjects: 'Manage Projects';
      readonly manageGroups: 'Manage Groups';
      readonly forms: 'Forms Management';
    };
    readonly projects: {
      readonly title: 'Projects';
      readonly description: 'List of accessible projects.';
    };
    readonly manageGroups: {
      readonly title: 'Manage Groups';
      readonly description: 'Manage your organization groups.';
    };
    readonly adminForm: {
      readonly title: 'Forms Dashboard';
      readonly description: 'Manage user-submitted forms.';
    };
    readonly notFound: {
      readonly title: 'Not Found';
      readonly description: 'This is the 404 page for AI Platform.';
      readonly message: "We couldn't find the page you were looking for!";
      readonly back: 'Back to Home';
    };
  };
  readonly monitor: {
    readonly title: 'Real-time Monitoring';
    readonly panel: {
      readonly title: 'Real-time Monitoring';
      readonly subtitle: 'Real-time logs and status updates.';
    };
    readonly table: {
      readonly podName: 'Pod Name';
      readonly namespace: 'Namespace';
      readonly status: 'Status';
      readonly actions: 'Actions';
      readonly kind: 'Kind';
      readonly name: 'Name';
      readonly details: 'Details';
      readonly age: 'Age';
      readonly images: 'Images';
      readonly restarts: 'Restarts';
      readonly labels: 'Labels';
    };
    readonly col: {
      readonly kind: 'Kind';
      readonly name: 'Name';
      readonly status: 'Status';
      readonly age: 'Age';
      readonly details: 'Details';
      readonly images: 'Images';
      readonly restarts: 'Restarts';
      readonly labels: 'Labels';
    };
    readonly empty: {
      readonly noPods: 'No pods found.';
      readonly waitingForData: 'Waiting for cluster data stream...';
    };
    readonly button: {
      readonly connect: 'Connect';
    };
    readonly agePrefix: 'Age';
    readonly waiting: 'Waiting for cluster data stream...';
    readonly websocketError: 'WebSocket Error';
    readonly connected: 'Connected';
    readonly disconnected: 'Disconnected';
  };
  readonly groups: {
    readonly title: 'Groups';
    readonly myGroups: 'My Groups';
    readonly subtitle: 'Manage and join groups.';
    readonly createNew: 'Create New Group';
    readonly searchPlaceholder: 'Search groups...';
    readonly name: 'Group Name';
    readonly nameLabel: 'Group Name';
    readonly description: 'Description';
    readonly descriptionLabel: 'Description';
    readonly namePlaceholder: 'Enter group name...';
    readonly descriptionPlaceholder: 'Enter description...';
    readonly noDescription: 'No description';
    readonly creating: 'Creating group...';
    readonly createButton: 'Create Group';
    readonly error: {
      readonly userNotLogged: 'User not logged in';
      readonly userIdMissing: 'User ID is missing';
      readonly unknown: 'Unknown error';
      readonly loadFailed: 'Failed to load groups';
    };
    readonly noMatch: 'No groups match "{term}".';
    readonly page: {
      readonly title: 'Groups';
      readonly description: 'Manage your groups here.';
    };
    readonly infoTitle: 'Group Information';
    readonly inviteUser: 'Invite User';
    readonly manageMembers: 'Manage';
    readonly membersList: 'Group Members';
    readonly memberCount: '{count} members in this group.';
    readonly noMembers: 'No members invited yet.';
    readonly notFound: 'Group not found.';
    readonly tab: {
      readonly overview: 'Overview';
      readonly members: 'Members';
      readonly info: 'Info';
    };
    readonly form: {
      readonly title: 'Create Group';
      readonly nameRequired: 'Group name is required';
      readonly createFailed: 'Failed to create group';
      readonly creating: 'Creating...';
      readonly cancel: 'Cancel';
    };
    readonly list: {
      readonly title: 'Groups';
      readonly description: 'Browse and manage groups.';
      readonly searchPlaceholder: 'Search groups...';
      readonly loading: 'Loading groups...';
      readonly deleteGroupAria: 'Delete group';
      readonly empty: {
        readonly filter: 'No groups match your filter.';
        readonly noGroups: 'No groups available.';
        readonly filterTip: 'Try adjusting your filter criteria.';
        readonly noGroupsTip: 'Create a new group to get started.';
      };
    };
    readonly empty: {
      readonly title: 'No Groups';
      readonly description: 'You are not a member of any groups yet.';
    };
  };
  readonly project: {
    readonly name: 'Project Name';
    readonly description: 'Description';
    readonly group: 'Group';
    readonly noDescription: 'No description';
    readonly untitled: 'Untitled';
    readonly idLabel: 'Project ID: {id}';
    readonly requestSupport: 'Request Support';
    readonly empty: 'No projects available.';
    readonly groupId: 'Group ID';
    readonly gpuResources: 'GPU Resources';
    readonly gpuQuotaUnit: '{quota} GPU(s)';
    readonly gpuAccessMode: 'Access Mode';
    readonly gpuAccessShared: 'Shared';
    readonly gpuAccessDedicated: 'Dedicated';
    readonly mpsSettings: 'MPS Settings';
    readonly mpsThreadLimit: 'Thread Limit: {value}%';
    readonly mpsMemoryLimit: 'Memory Limit: {value} MB';
    readonly mpsUnlimited: 'Unlimited';
    readonly delete: 'Delete project: {name}';
    readonly about: 'About Project';
    readonly list: {
      readonly title: 'Projects';
      readonly create: 'New Project';
      readonly searchPlaceholder: 'Search projects...';
      readonly loading: 'Loading projects...';
      readonly errorPrefix: 'Error:';
      readonly colProject: 'Project';
      readonly colStatus: 'Status';
      readonly empty: {
        readonly filter: 'No projects match "{term}".';
        readonly noProjects: 'No projects found.';
        readonly assigned: 'No projects assigned to your groups.';
      };
    };
    readonly create: {
      readonly title: 'Create New Project';
      readonly error: 'Failed to create project';
      readonly name: 'Project Name';
      readonly namePlaceholder: 'Enter unique project name';
      readonly description: 'Description';
      readonly descriptionPlaceholder: 'Enter project description';
      readonly group: 'Group';
      readonly groupPlaceholder: 'Select a group';
      readonly groupLabel: 'Group';
      readonly gpuQuota: 'GPU Quota';
      readonly gpuQuotaPlaceholder: 'e.g. 1';
      readonly gpuLabel: 'GPU Quota';
      readonly gpuThreadLimit: 'MPS Thread Limit (%)';
      readonly gpuThreadLimitPlaceholder: 'e.g. 100';
      readonly gpuMemoryLimit: 'MPS Memory Limit (MB)';
      readonly gpuMemoryLimitPlaceholder: 'e.g. 1024';
      readonly gpuAccessMode: 'GPU Access Mode';
      readonly gpuAccessShared: 'Shared (MPS)';
      readonly gpuAccessDedicated: 'Dedicated';
      readonly mpsSettings: 'MPS Settings';
      readonly mpsThreadLimit: 'Thread Limit';
      readonly mpsMemoryLimit: 'Memory Limit';
      readonly noGroupsFound: 'No groups found. Please create a group first.';
      readonly selectedId: 'Selected Group ID: {id}';
      readonly cancel: 'Cancel';
      readonly submit: 'Create Project';
      readonly creating: 'Creating...';
    };
    readonly edit: {
      readonly title: 'Edit Project';
    };
    readonly detail: {
      readonly overview: 'Overview';
      readonly members: 'Members';
      readonly settings: 'Settings';
      readonly needProjectId: 'Project ID is required';
      readonly fetchError: 'Failed to fetch project details';
      readonly createConfigError: 'Failed to create configuration';
      readonly updateConfigError: 'Failed to update configuration';
      readonly deleteConfigError: 'Failed to delete configuration';
      readonly instanceCreateSent: 'Instance creation request sent';
      readonly createInstanceError: 'Failed to create instance';
      readonly confirmDeleteInstance: 'Are you sure you want to delete this instance?';
      readonly instanceDeleteSent: 'Instance deletion request sent';
      readonly deleteInstanceError: 'Failed to delete instance';
      readonly errorTitle: 'Error';
      readonly notFoundTitle: 'Project Not Found';
      readonly notFoundMessage: 'Project with ID {id} was not found.';
      readonly titleSuffix: 'Project Details';
      readonly description: 'Manage project {name} configurations, storage, and members.';
      readonly tab: {
        readonly overview: 'Overview';
        readonly configurations: 'Configurations';
        readonly storage: 'Storage';
        readonly members: 'Members';
      };
      readonly infoLabel: 'Project Information';
      readonly createdAt: 'Created At';
      readonly updatedAt: 'Updated At';
      readonly configTitle: 'Configurations';
      readonly configDesc: 'Manage project configurations and deployments.';
      readonly addConfig: 'Add Configuration';
      readonly pvcTitle: 'Storage (PVC)';
      readonly pvcDesc: 'Manage project persistent volume claims.';
    };
    readonly members: {
      readonly title: 'Members';
      readonly description: 'Manage members of group {groupId}.';
      readonly searchPlaceholder: 'Search members...';
      readonly addMember: 'Add Member';
    };
    readonly role: {
      readonly admin: 'Administrator';
      readonly manager: 'Manager';
      readonly user: 'User';
    };
  };
  readonly storage: {
    readonly pageTitle: 'Cloud Explorer';
    readonly breadcrumb: 'Cloud Explorer';
    readonly pageSubtitle: 'Browse and manage your storage volumes and project drives.';
    readonly project: 'Project';
    readonly starting: 'Starting storage browser...';
    readonly stopping: 'Stopping storage browser...';
    readonly actionFailed: 'Action failed. Please try again.';
    readonly errLoadList: 'Failed to load storage list';
    readonly tab: {
      readonly personal: 'Personal Hub';
      readonly project: 'Project Storage';
    };
    readonly readWrite: 'Read/Write';
    readonly readOnly: 'Read Only';
    readonly online: 'Online';
    readonly offline: 'Offline';
    readonly scanning: 'Scanning volumes...';
    readonly action: {
      readonly start: 'Start Drive';
      readonly stop: 'Stop Drive';
      readonly open: 'Open Browser';
    };
    readonly msg: {
      readonly starting: 'Starting storage browser...';
      readonly stopping: 'Stopping storage browser...';
      readonly actionFailed: 'Action failed. Please try again.';
      readonly loadFailed: 'Could not load storage list.';
    };
    readonly personal: {
      readonly title: 'Personal Storage Hub';
      readonly description: 'Access your private storage space via Secure Ingress.';
      readonly noStorageTitle: 'Storage Not Initialized';
      readonly noStorageDesc: 'Your personal storage space has not been provisioned yet.';
      readonly contactAdmin: 'Please contact an administrator to initialize your storage.';
    };
    readonly colProject: 'Project';
    readonly colStatus: 'Status';
    readonly emptyFilter: 'No projects match "{term}".';
    readonly emptyAssigned: 'No projects assigned to your groups.';
  };
  readonly configFile: {
    readonly editFile: 'Edit file';
    readonly destroyInstance: 'Destroy instance';
    readonly deleteFile: 'Delete file';
    readonly notFoundTitle: 'No config files found';
    readonly notFoundDesc: 'Click "Add Config" to get started.';
    readonly toggleResources: 'Toggle resources';
    readonly id: 'ID';
    readonly createdAt: 'Created At';
    readonly deployInstance: 'Deploy instance';
    readonly deploy: 'Deploy';
    readonly relatedResources: 'Related Resources';
    readonly noRelatedResources: 'No related resources';
    readonly notDeployed: 'This config file has not been deployed yet.';
  };
  readonly config: {
    readonly error: {
      readonly filenameRequired: 'Filename is required';
      readonly filenameSuffix: 'Filename must end with .yaml or .yml';
      readonly yamlEmpty: 'YAML content cannot be empty';
    };
    readonly createTitle: 'Create New Config';
    readonly createSubtitle: 'Use wizard or edit YAML directly.';
    readonly tab: {
      readonly wizard: 'Wizard Mode';
      readonly yaml: 'Raw YAML';
    };
    readonly filename: {
      readonly label: 'Config Filename';
      readonly prefix: 'Filename:';
      readonly note: 'Must be unique and end with .yaml or .yml';
    };
    readonly wizard: {
      readonly imageLabel: 'Container Image';
      readonly imageNote: 'Specify the image to use.';
      readonly gpuLabel: 'GPU Quota';
      readonly pvcLabel: 'PVC';
    };
    readonly pvc: {
      readonly placeholder: 'Select PVC...';
      readonly loading: 'Loading PVCs...';
      readonly note: 'Select a PVC for storage.';
    };
    readonly mountPath: 'Mount Path';
    readonly commandLabel: 'Command';
    readonly argsLabel: 'Arguments';
    readonly yamlContentLabel: 'YAML Content';
    readonly creating: 'Creating...';
    readonly createButton: 'Create Config';
  };
  readonly admin: {
    readonly dashboard: 'Dashboard';
    readonly storage: {
      readonly title: 'Storage Administration';
      readonly tab: {
        readonly user: 'User Hubs';
        readonly project: 'Project PVCs';
      };
      readonly user: {
        readonly successInit: 'Storage initialized successfully';
        readonly confirmDelete: 'Are you sure you want to delete this storage?';
        readonly successDelete: 'Storage deleted successfully';
        readonly successExpand: 'Storage expanded successfully';
        readonly targetUser: 'Target User';
        readonly username: 'Username';
        readonly usernamePlaceholder: 'Enter username';
        readonly checkStatus: 'Check Status';
        readonly statusExists: 'Storage exists';
        readonly statusMissing: 'Storage missing';
        readonly lifecycleTitle: 'Storage Lifecycle';
        readonly hintUnknown: 'Status unknown';
        readonly hintMissing: 'No storage found';
        readonly hintExists: 'Storage is active';
        readonly processing: 'Processing...';
        readonly initBtn: 'Initialize Storage';
        readonly deleteBtn: 'Delete Storage';
        readonly checkStatusFirst: 'Check Status First';
        readonly expandTitle: 'Expand Storage';
        readonly newSize: 'New Size (GB)';
        readonly newSizePlaceholder: 'e.g., 50';
        readonly expandBtn: 'Expand Storage';
      };
      readonly project: {
        readonly form: {
          readonly projectPlaceholder: 'Select project...';
          readonly project: 'Project';
          readonly capacity: 'Capacity';
          readonly capacityHint: 'e.g., 10Gi';
        };
        readonly createSuccess: 'Project storage created successfully';
        readonly createGuideTitle: 'Create Project Storage';
        readonly createGuideDesc: 'Create a new PVC for project storage.';
        readonly createSubmit: 'Create Storage';
        readonly actionExpandPrompt: 'Expand Storage Capacity';
        readonly actionConfirmDelete: 'Are you sure you want to delete this storage?';
        readonly list: {
          readonly project: 'Project';
          readonly status: 'Status';
          readonly capacity: 'Capacity';
          readonly age: 'Age';
          readonly actions: 'Actions';
          readonly empty: 'No project storage found.';
        };
        readonly actionEdit: 'Edit';
        readonly actionDelete: 'Delete';
        readonly tab: {
          readonly list: 'List';
          readonly create: 'Create';
        };
        readonly errorSelectProject: 'Please select a project';
      };
      readonly pvc: {
        readonly title: 'PVC Management';
        readonly createTitle: 'Create New PVC';
        readonly expandTitle: 'Expand PVC';
        readonly sizeLabel: 'Size (Gi)';
      };
      readonly forms: 'Forms';
    };
    readonly storageManagement: {
      readonly title: 'Storage Administration';
      readonly userTab: 'User Hubs';
      readonly projectTab: 'Project PVCs';
      readonly initUser: 'Initialize Storage';
      readonly deleteUser: 'Delete Hub';
      readonly expandUser: 'Expand Capacity';
      readonly hintExists: 'Storage is active (Ready).';
      readonly hintMissing: 'No storage found.';
      readonly confirmDelete: 'Are you sure you want to PERMANENTLY delete this storage?';
    };
  };
  readonly auth: {
    readonly login: {
      readonly title: 'Login';
      readonly subtitle: 'Enter your username and password to login!';
      readonly username: 'Username';
      readonly usernamePlaceholder: 'Enter your username';
      readonly password: 'Password';
      readonly passwordPlaceholder: 'Enter your password';
      readonly forgotPassword: 'Forgot password?';
      readonly submit: 'Login';
      readonly noAccount: "Don't have an account?";
      readonly signUp: 'Sign up';
      readonly backToDashboard: 'Back to Dashboard';
      readonly loginFailed: 'Login failed, please try again.';
      readonly pageTitle: 'Login | AI Platform';
      readonly pageDescription: 'This is the login page for AI Platform';
    };
    readonly signOut: 'Sign out';
    readonly signIn: 'Sign in';
  };
  readonly user: {
    readonly profile: 'Profile';
    readonly signOut: 'Sign out';
    readonly login: 'Login';
    readonly editProfile: 'Edit Profile';
    readonly support: 'Support';
  };
  readonly role: {
    readonly admin: 'Administrator';
    readonly adminDesc: 'Full access to all resources and settings.';
    readonly manager: 'Manager';
    readonly managerDesc: 'Can manage projects, groups, and members.';
    readonly user: 'User';
    readonly userDesc: 'Can access and use assigned projects.';
    readonly label: 'Role: {role}';
  };
  readonly members: {
    readonly noneFound: 'No members found.';
    readonly noMatch: 'No members match your search.';
  };
  readonly form: {
    readonly title: 'Submit Form';
    readonly status: {
      readonly pending: 'Pending';
      readonly approved: 'Approved';
      readonly rejected: 'Rejected';
      readonly processing: 'Processing';
      readonly completed: 'Completed';
    };
    readonly action: {
      readonly process: 'Process';
      readonly reject: 'Reject';
      readonly complete: 'Complete';
    };
    readonly label: {
      readonly title: 'Title';
      readonly description: 'Description';
      readonly project: 'Project';
    };
    readonly select: {
      readonly none: 'None';
    };
    readonly error: {
      readonly titleRequired: 'Title is required';
      readonly submitFailed: 'Submission failed';
    };
    readonly success: {
      readonly submitted: 'Submitted successfully, admin will review soon.';
    };
    readonly createFailed: 'Failed to create form';
    readonly created: 'Form created successfully!';
    readonly field: {
      readonly title: 'Title';
      readonly description: 'Description';
    };
    readonly exampleTitle: 'Example Title';
    readonly placeholder: {
      readonly title: 'Enter title...';
      readonly description: {
        readonly base: 'Enter description...';
        readonly long: 'Enter detailed description...';
      };
    };
    readonly projectId: 'Project ID: {id}';
    readonly cancel: 'Cancel';
    readonly submitting: 'Submitting...';
    readonly submit: 'Submit';
    readonly history: {
      readonly title: 'History';
      readonly empty: 'No history found.';
      readonly loading: 'Loading history...';
    };
    readonly apply: {
      readonly title: 'Apply';
    };
    readonly page: {
      readonly title: 'Form Page';
      readonly description: 'Submit and manage your forms.';
    };
  };
  readonly table: {
    readonly id: 'ID';
    readonly user: 'User';
    readonly project: 'Project';
    readonly titleDesc: 'Title / Description';
    readonly status: 'Status';
    readonly actions: 'Actions';
    readonly role: 'Role';
  };
  readonly language: {
    readonly aria: 'Language selector';
    readonly switchToEn: 'Switch to English';
    readonly switchToZh: 'Switch to Chinese';
    readonly short: 'EN';
    readonly switchLabel: 'Toggle language';
  };
  readonly notification: {
    readonly title: 'Notifications';
    readonly requestChange: 'Request Change';
    readonly project: 'Project';
    readonly viewAll: 'View All';
    readonly time: {
      readonly '5min': '5 minutes ago';
      readonly '8min': '8 minutes ago';
      readonly '15min': '15 minutes ago';
      readonly '1hour': '1 hour ago';
    };
  };
  readonly invite: {
    readonly selectUserError: 'Please select a user to invite';
    readonly unknownError: 'Unknown error occurred while inviting user';
    readonly title: 'Invite User';
    readonly description: 'Invite a user to the project or group';
    readonly userLabel: 'User';
    readonly userSearchPlaceholder: 'Search users...';
    readonly noResults: 'No users found';
  };
  readonly pagination: {
    readonly prev: 'Previous';
    readonly next: 'Next';
    readonly pageOf: 'Page {current} of {total}';
  };
  readonly view: {
    readonly toggleToAdmin: 'Switch to Admin';
    readonly toggleToUser: 'Switch to User';
    readonly grid: 'Grid View';
    readonly list: 'List View';
  };
  readonly search: {
    readonly projectsPlaceholder: 'Search projects...';
    readonly placeholder: 'Search...';
  };
  readonly loading: {
    readonly forms: 'Loading forms...';
  };
  readonly terminal: {
    readonly connected: 'Connected';
    readonly websocketError: 'WebSocket Error';
    readonly disconnected: 'Disconnected';
  };
  readonly badge: {
    readonly new: 'New';
    readonly pro: 'Pro';
  };
  readonly button: {
    readonly newGroup: 'New Group';
    readonly newProject: 'New Project';
  };
};
export default en;
export type Dictionary = typeof en;
export type TranslationSchema<T> = {
  -readonly [K in keyof T]: T[K] extends string ? string : TranslationSchema<T[K]>;
};
//# sourceMappingURL=en.d.ts.map
