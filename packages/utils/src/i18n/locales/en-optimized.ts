/**
 * English (US) Translation Dictionary - Optimized Version
 * Pure nested structure, no redundant flat keys
 * Performance: Significantly reduced file size with better maintainability
 */

const en = {
  // --- Brand ---
  brand: {
    name: 'AI Platform',
  },

  // --- Common / Shared ---
  common: {
    // Actions
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    submit: 'Submit',
    save: 'Save',
    search: 'Search...',
    remove: 'Remove',
    actions: 'Actions',
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
    updatedAt: 'Updated At',
    noData: 'No data found.',
    untitled: 'Untitled',
    confirmDelete: 'Are you sure you want to delete?',
  },

  // --- Status ---
  status: {
    active: 'Active',
    idle: 'Idle',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    processing: 'Processing',
    completed: 'Completed',
    succeeded: 'Succeeded',
    failed: 'Failed',
    running: 'Running',
    unknown: 'Unknown',
  },

  // --- Navigation ---
  breadcrumb: {
    home: 'Home',
    projects: 'Projects',
    groups: 'Groups',
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

  // --- Error Messages ---
  error: {
    fetch: 'Failed to fetch data',
    fetchGroups: 'Failed to fetch groups',
    fetchData: 'Failed to fetch data',
    createGroup: 'Failed to create group',
    deleteGroup: 'Failed to delete group',
    deleteFailed: 'Delete failed',
    initData: 'Failed to initialize data',
    selectGroup: 'Please select a group',
    invalidProjectData: 'Invalid project data',
    createProject: 'Failed to create project',
    deleteProject: 'Failed to delete project',
    userNotLogged: 'User not logged in',
  },

  // --- Pages ---
  page: {
    home: {
      title: 'Dashboard',
      description: 'Welcome to your dashboard',
      welcome: 'Welcome to AI Platform',
      subtitle: 'Manage your projects, groups, and pods here.',
    },
    admin: {
      title: 'Admin Dashboard',
      description: 'Admin center',
      manageProjects: 'Manage Projects',
      manageGroups: 'Manage Groups',
      forms: 'Forms Management',
    },
    projects: {
      title: 'Projects',
      description: 'List of accessible projects.',
    },
    manageGroups: {
      title: 'Manage Groups',
      description: 'Manage your organization groups.',
    },
    adminForm: {
      title: 'Forms Dashboard',
      description: 'Manage user-submitted forms.',
    },
    notFound: {
      title: 'Not Found',
      description: 'This is the 404 page for AI Platform.',
      message: "We couldn't find the page you were looking for!",
      back: 'Back to Home',
    },
  },

  // --- Monitor / Pods ---
  monitor: {
    title: 'Real-time Monitoring',
    panel: {
      title: 'Real-time Monitoring',
      subtitle: 'Real-time logs and status updates.',
    },
    table: {
      podName: 'Pod Name',
      namespace: 'Namespace',
      status: 'Status',
      actions: 'Actions',
      kind: 'Kind',
      name: 'Name',
      details: 'Details',
      age: 'Age',
      images: 'Images',
      restarts: 'Restarts',
      labels: 'Labels',
    },
    empty: {
      noPods: 'No pods found.',
      waitingForData: 'Waiting for cluster data stream...',
    },
    button: {
      connect: 'Connect',
    },
    agePrefix: 'Age',
    waiting: 'Waiting for cluster data stream...',
    websocketError: 'WebSocket Error',
    connected: 'Connected',
    disconnected: 'Disconnected',
  },

  // --- Groups ---
  groups: {
    title: 'Groups',
    myGroups: 'My Groups',
    subtitle: 'Manage and join groups.',
    createNew: 'Create New Group',
    searchPlaceholder: 'Search groups...',
    name: 'Group Name',
    description: 'Description',
    namePlaceholder: 'Enter group name...',
    descriptionPlaceholder: 'Enter description...',
    noDescription: 'No description',
    creating: 'Creating group...',
    createButton: 'Create Group',
    error: {
      userNotLogged: 'User not logged in',
      userIdMissing: 'User ID is missing',
      unknown: 'Unknown error',
      loadFailed: 'Failed to load groups',
    },
    noMatch: 'No groups match "{term}".',
    page: {
      title: 'Groups',
      description: 'Manage your groups here.',
    },
    infoTitle: 'Group Information',
    inviteUser: 'Invite User',
    manageMembers: 'Manage',
    membersList: 'Group Members',
    memberCount: '{count} members in this group.',
    noMembers: 'No members invited yet.',
    notFound: 'Group not found.',
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
    list: {
      title: 'Groups',
      description: 'Browse and manage groups.',
      searchPlaceholder: 'Search groups...',
      loading: 'Loading groups...',
      deleteGroupAria: 'Delete group',
      empty: {
        filter: 'No groups match your filter.',
        noGroups: 'No groups available.',
        filterTip: 'Try adjusting your filter criteria.',
        noGroupsTip: 'Create a new group to get started.',
      },
    },
    empty: {
      title: 'No Groups',
      description: 'You are not a member of any groups yet.',
    },
  },

  // --- Projects ---
  project: {
    name: 'Project Name',
    description: 'Description',
    group: 'Group',
    noDescription: 'No description',
    untitled: 'Untitled',
    idLabel: 'Project ID: {id}',
    requestSupport: 'Request Support',
    empty: 'No projects available.',
    groupId: 'Group ID',
    gpuResources: 'GPU Resources',
    gpuQuotaUnit: '{quota} GPU(s)',
    gpuAccessMode: 'Access Mode',
    gpuAccessShared: 'Shared',
    gpuAccessDedicated: 'Dedicated',
    mpsSettings: 'MPS Settings',
    mpsThreadLimit: 'Thread Limit: {value}%',
    mpsMemoryLimit: 'Memory Limit: {value} MB',
    mpsUnlimited: 'Unlimited',
    delete: 'Delete project: {name}',
    about: 'About Project',
    list: {
      title: 'Projects',
      create: 'New Project',
      searchPlaceholder: 'Search projects...',
      loading: 'Loading projects...',
      errorPrefix: 'Error:',
      colProject: 'Project',
      colStatus: 'Status',
      empty: {
        filter: 'No projects match "{term}".',
        noProjects: 'No projects found.',
        assigned: 'No projects assigned to your groups.',
      },
    },
    create: {
      title: 'Create New Project',
      error: 'Failed to create project',
      name: 'Project Name',
      namePlaceholder: 'Enter unique project name',
      description: 'Description',
      descriptionPlaceholder: 'Enter project description',
      group: 'Group',
      groupPlaceholder: 'Select a group',
      groupLabel: 'Group',
      gpuQuota: 'GPU Quota',
      gpuQuotaPlaceholder: 'e.g. 1',
      gpuLabel: 'GPU Quota',
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
    },
    edit: {
      title: 'Edit Project',
    },
    detail: {
      overview: 'Overview',
      members: 'Members',
      settings: 'Settings',
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
    members: {
      title: 'Members',
      description: 'Manage members of group {groupId}.',
      searchPlaceholder: 'Search members...',
      addMember: 'Add Member',
    },
    role: {
      admin: 'Administrator',
      manager: 'Manager',
      user: 'User',
    },
  },

  // --- Storage / File Browser ---
  storage: {
    pageTitle: 'Cloud Explorer',
    breadcrumb: 'Cloud Explorer',
    pageSubtitle: 'Browse and manage your storage volumes and project drives.',
    project: 'Project',
    starting: 'Starting storage browser...',
    stopping: 'Stopping storage browser...',
    actionFailed: 'Action failed. Please try again.',
    errLoadList: 'Failed to load storage list',
    tab: {
      personal: 'Personal Hub',
      project: 'Project Storage',
    },
    readWrite: 'Read/Write',
    readOnly: 'Read Only',
    online: 'Online',
    offline: 'Offline',
    scanning: 'Scanning volumes...',
    action: {
      start: 'Start Drive',
      stop: 'Stop Drive',
      open: 'Open Browser',
    },
    msg: {
      starting: 'Starting storage browser...',
      stopping: 'Stopping storage browser...',
      actionFailed: 'Action failed. Please try again.',
      loadFailed: 'Could not load storage list.',
    },
    personal: {
      title: 'Personal Storage Hub',
      description: 'Access your private storage space via Secure Ingress.',
      noStorageTitle: 'Storage Not Initialized',
      noStorageDesc: 'Your personal storage space has not been provisioned yet.',
      contactAdmin: 'Please contact an administrator to initialize your storage.',
    },
    colProject: 'Project',
    colStatus: 'Status',
    emptyFilter: 'No projects match "{term}".',
    emptyAssigned: 'No projects assigned to your groups.',
  },

  // --- Config Files ---
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

  config: {
    error: {
      filenameRequired: 'Filename is required',
      filenameSuffix: 'Filename must end with .yaml or .yml',
      yamlEmpty: 'YAML content cannot be empty',
    },
    createTitle: 'Create New Config',
    createSubtitle: 'Use wizard or edit YAML directly.',
    tab: {
      wizard: 'Wizard Mode',
      yaml: 'Raw YAML',
    },
    filename: {
      label: 'Config Filename',
      prefix: 'Filename:',
      note: 'Must be unique and end with .yaml or .yml',
    },
    wizard: {
      imageLabel: 'Container Image',
      imageNote: 'Specify the image to use.',
      gpuLabel: 'GPU Quota',
      pvcLabel: 'PVC',
    },
    pvc: {
      placeholder: 'Select PVC...',
      loading: 'Loading PVCs...',
      note: 'Select a PVC for storage.',
    },
    mountPath: 'Mount Path',
    commandLabel: 'Command',
    argsLabel: 'Arguments',
    yamlContentLabel: 'YAML Content',
    creating: 'Creating...',
    createButton: 'Create Config',
  },

  // --- Admin Storage ---
  admin: {
    dashboard: 'Dashboard',
    storage: {
      title: 'Storage Administration',
      tab: {
        user: 'User Hubs',
        project: 'Project PVCs',
      },
      user: {
        successInit: 'Storage initialized successfully',
        confirmDelete: 'Are you sure you want to delete this storage?',
        successDelete: 'Storage deleted successfully',
        successExpand: 'Storage expanded successfully',
        targetUser: 'Target User',
        username: 'Username',
        usernamePlaceholder: 'Enter username',
        checkStatus: 'Check Status',
        statusExists: 'Storage exists',
        statusMissing: 'Storage missing',
        lifecycleTitle: 'Storage Lifecycle',
        hintUnknown: 'Status unknown',
        hintMissing: 'No storage found',
        hintExists: 'Storage is active',
        processing: 'Processing...',
        initBtn: 'Initialize Storage',
        deleteBtn: 'Delete Storage',
        checkStatusFirst: 'Check Status First',
        expandTitle: 'Expand Storage',
        newSize: 'New Size (GB)',
        newSizePlaceholder: 'e.g., 50',
        expandBtn: 'Expand Storage',
      },
      project: {
        form: {
          projectPlaceholder: 'Select project...',
          project: 'Project',
          capacity: 'Capacity',
          capacityHint: 'e.g., 10Gi',
        },
        createSuccess: 'Project storage created successfully',
        createGuideTitle: 'Create Project Storage',
        createGuideDesc: 'Create a new PVC for project storage.',
        createSubmit: 'Create Storage',
        actionExpandPrompt: 'Expand Storage Capacity',
        actionConfirmDelete: 'Are you sure you want to delete this storage?',
        list: {
          project: 'Project',
          status: 'Status',
          capacity: 'Capacity',
          age: 'Age',
          actions: 'Actions',
          empty: 'No project storage found.',
        },
        actionEdit: 'Edit',
        actionDelete: 'Delete',
        tab: {
          list: 'List',
          create: 'Create',
        },
        errorSelectProject: 'Please select a project',
      },
      pvc: {
        title: 'PVC Management',
        createTitle: 'Create New PVC',
        expandTitle: 'Expand PVC',
        sizeLabel: 'Size (Gi)',
      },
      forms: 'Forms',
    },
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
  },

  // --- Authentication ---
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

  // --- User ---
  user: {
    profile: 'Profile',
    signOut: 'Sign out',
    login: 'Login',
    editProfile: 'Edit Profile',
    support: 'Support',
  },

  // --- Role ---
  role: {
    admin: 'Administrator',
    adminDesc: 'Full access to all resources and settings.',
    manager: 'Manager',
    managerDesc: 'Can manage projects, groups, and members.',
    user: 'User',
    userDesc: 'Can access and use assigned projects.',
    label: 'Role: {role}',
  },

  // --- Members ---
  members: {
    noneFound: 'No members found.',
    noMatch: 'No members match your search.',
  },

  // --- Forms ---
  form: {
    title: 'Submit Form',
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
    label: {
      title: 'Title',
      description: 'Description',
      project: 'Project',
    },
    select: {
      none: 'None',
    },
    error: {
      titleRequired: 'Title is required',
      submitFailed: 'Submission failed',
    },
    success: {
      submitted: 'Submitted successfully, admin will review soon.',
    },
    createFailed: 'Failed to create form',
    created: 'Form created successfully!',
    field: {
      title: 'Title',
      description: 'Description',
    },
    exampleTitle: 'Example Title',
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
    history: {
      title: 'History',
      empty: 'No history found.',
      loading: 'Loading history...',
    },
    apply: {
      title: 'Apply',
    },
    page: {
      title: 'Form Page',
      description: 'Submit and manage your forms.',
    },
  },

  // --- Table ---
  table: {
    id: 'ID',
    user: 'User',
    project: 'Project',
    titleDesc: 'Title / Description',
    status: 'Status',
    actions: 'Actions',
    role: 'Role',
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

  // --- Pagination ---
  pagination: {
    prev: 'Previous',
    next: 'Next',
    pageOf: 'Page {current} of {total}',
  },

  // --- View / Display ---
  view: {
    toggleToAdmin: 'Switch to Admin',
    toggleToUser: 'Switch to User',
    grid: 'Grid View',
    list: 'List View',
  },

  // --- Search ---
  search: {
    projectsPlaceholder: 'Search projects...',
    placeholder: 'Search...',
  },

  // --- Loading ---
  loading: {
    forms: 'Loading forms...',
  },

  // --- Terminal ---
  terminal: {
    connected: 'Connected',
    websocketError: 'WebSocket Error',
    disconnected: 'Disconnected',
  },

  // --- Badge ---
  badge: {
    new: 'New',
    pro: 'Pro',
  },

  // --- Button ---
  button: {
    newGroup: 'New Group',
    newProject: 'New Project',
  },
} as const;

export default en;
export type Dictionary = typeof en;
export type TranslationSchema<T> = {
  -readonly [K in keyof T]: T[K] extends string ? string : TranslationSchema<T[K]>;
};
