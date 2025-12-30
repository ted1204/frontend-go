const en = {
  brand: {
    name: 'AI Platform',
  },
  common: {
    noDescription: 'No description',
    createdAt: 'Created',
    untitled: 'Untitled',
    cancel: 'Cancel',
    submit: 'Submit',
    submitting: 'Submitting...',
    loading: 'Loading...',
    error: 'Error',
    id: 'ID',
    success: 'Success',
    edit: 'Edit',
    delete: 'Delete',
  },
  badge: {
    new: 'New',
    pro: 'Pro',
  },
  pagination: {
    prev: 'Previous',
    next: 'Next',
    pageOf: 'Page {current} of {total}',
  },
  breadcrumb: {
    home: 'Home',
    projects: 'Projects',
    groups: 'Groups',
  },
  sidebar: {
    menu: 'Menu',
    admin: 'Admin',
    projects: 'Projects',
    jobs: 'Jobs',
    groups: 'Groups',
    pods: 'Pods',
    fileBrowser: 'File Browser',
    dashboard: 'Dashboard',
    ecommerce: 'E-commerce',
    myForms: 'My Forms',
  },
  search: {
    placeholder: 'Search or type a command...',
    projectsPlaceholder: 'Search projects...',
  },
  view: {
    toggleToAdmin: 'Switch to Admin',
    toggleToUser: 'Switch to User',
    grid: 'Grid view',
    list: 'List view',
  },
  language: {
    short: 'ZH',
    switchLabel: '中文 / EN',
    aria: 'Switch language',
  },
  user: {
    editProfile: 'Edit profile',
    support: 'Support',
    signOut: 'Sign out',
    notLogged: 'User not logged in.',
    idMissing: 'User ID not found.',
  },
  role: {
    label: 'Role: {role}',
    admin: {
      name: 'Administrator',
      desc: 'Has full access to all settings.',
    },
    manager: {
      name: 'Project Manager',
      desc: 'Can manage members and content.',
    },
    user: {
      name: 'Regular User',
      desc: 'Can view and interact with content.',
    },
  },
  page: {
    home: {
      title: 'Dashboard | AI Platform',
      description: 'AI Platform dashboard',
    },
    admin: {
      title: 'Admin Dashboard | TailAdmin',
      description: 'The central hub for administrative tasks.',
    },
    projects: {
      title: 'My Projects | TailAdmin',
      description: 'List of projects you have access to.',
    },
    manageGroups: {
      title: 'Manage Groups',
      description: 'Administrative panel for organizing groups.',
    },
    adminForm: {
      title: 'Forms Dashboard',
      description: 'Manage user submitted forms',
    },
    notFound: {
      title: 'Error',
      description: "This is AI Platform's 404 page",
      message: "We couldn't find the page you were looking for!",
      back: 'Back to home',
    },
  },
  home: {
    welcome: 'Welcome to AI Platform',
    subtitle: 'Manage your projects, groups and Pods here.',
  },
  admin: {
    dashboard: 'Dashboard',
    manageProjects: 'Manage Projects',
    manageGroups: 'Manage Groups',
    forms: 'Forms Management',
    storageManagement: 'Storage Management',
    storage: {
      title: 'Storage Administration',
      description: 'Centralized management for User Hubs and Project PVCs.',
      tab: {
        user: 'User Storage (Hub)',
        project: 'Project Storage (PVC)',
      },
      // [NEW] User Storage Hub Specifics
      user: {
        targetUser: 'Target User',
        username: 'Username',
        usernamePlaceholder: 'e.g. sky-lin',
        checkStatus: 'Check Status',
        checkStatusFirst: 'Check Status First',

        // Status Indicators
        statusExists: 'Storage Exists (Ready)',
        statusMissing: 'No Storage Found',

        // Lifecycle Card
        lifecycleTitle: 'Storage Lifecycle',
        hintUnknown: 'Please enter a username and check status to see available actions.',
        hintMissing: 'No storage hub found. You can initialize a new one now.',
        hintExists: 'Storage hub is active. You can delete it if necessary (Danger Zone).',

        // Actions
        initBtn: 'Initialize Storage',
        deleteBtn: 'Delete Storage Hub',
        confirmDelete:
          "Are you sure you want to PERMANENTLY delete this user's storage? This action cannot be undone.",

        // Expansion
        expandTitle: 'Expand Capacity',
        newSize: 'New Size',
        newSizePlaceholder: 'e.g. 1Ti',
        expandBtn: 'Expand Volume',

        // Feedback
        processing: 'Processing...',
        successInit: 'Storage for {{user}} initialized successfully.',
        successDelete: 'Storage for {{user}} has been deleted.',
        successExpand: 'Expanded {{user}} to {{size}}.',
      },
      project: {
        tab: {
          list: 'Storage List',
          create: 'New Project Storage',
        },
        create: {
          guideTitle: 'Create Project Shared Space',
          guideDesc:
            'This will provision a Persistent Volume Claim (PVC) for the selected project. All project members will have Read-Write access.',
          submit: 'Provision Storage',
          success: 'Project storage created successfully.',
        },
        form: {
          project: 'Target Project',
          projectPlaceholder: 'Select a project...',
          capacity: 'Storage Capacity (Gi)',
          capacityHint: 'Default: 10Gi. Can be expanded later.',
        },
        list: {
          project: 'Project Name',
          namespace: 'Namespace',
          status: 'Status',
          capacity: 'Capacity',
          age: 'Age',
          actions: 'Actions',
          empty: 'No project storage found.',
        },
        action: {
          edit: 'Edit Quota',
          delete: 'Delete',
          confirmDelete:
            'Are you sure you want to PERMANENTLY delete this project storage? This action cannot be undone.',
          expandPrompt: 'Please enter the new capacity (e.g., 20Gi):',
        },
      },
    },
    pvc: {
      title: 'PVC Management',
      tab: {
        list: 'List',
        create: 'Create',
        expand: 'Expand',
        delete: 'Delete',
      },
      create: {
        title: 'Create New PVC',
        description: 'Provision a new Persistent Volume Claim for your workload.',
        // ... existing
      },
      expand: {
        title: 'Expand PVC Capacity',
        description: 'Increase the storage size of an existing Persistent Volume Claim.',
        newSize: 'New Size',
        newSizePlaceholder: 'e.g., 20Gi',
        submit: 'Expand Volume',
        expanding: 'Expanding...',
        success: 'PVC expansion request submitted successfully!',
        error: 'Failed to expand PVC.',
        namespaceInvalid: 'Modification of system namespace (kube-system) is not allowed.',
      },
      list: {
        title: 'PVC List',
        namespace: 'Namespace',
        customNamespace: 'Custom Namespace',
        name: 'Name',
        status: 'Status',
        size: 'Size',
        loading: 'Loading PVC lists...',
        noData: 'No PVCs found.',
      },
    },
  },
  project: {
    idLabel: 'Project ID: {id}',
    untitled: 'Untitled Project',
    noDescription: 'No description provided.',
    requestSupport: 'Request Support',
    delete: 'Delete project {name}',
    gpuResources: 'GPU Resources',
    mpsSettings: 'MPS Settings',
    mps: {
      threadLimit: 'Thread limit',
      memoryLimit: 'Memory limit',
    },
    list: {
      title: 'Project List',
      myProjects: 'My Projects',
      searchPlaceholder: 'Search by name, description or ID...',
      loading: 'Loading projects...',
      errorPrefix: 'Error:',
      empty: {
        filter: 'No projects match "{term}". Try other keywords.',
        noProjects: 'No projects found. Create a new project to get started.',
        assigned: 'No projects assigned to your groups.',
      },
    },
    create: {
      title: 'Create New Project',
      editTitle: 'Edit Project', // from project.edit.title
      name: 'Project Name',
      namePlaceholder: 'Enter project name',
      description: 'Description (Optional)',
      descriptionPlaceholder: 'Briefly describe the project goal...',
      group: 'Group',
      groupPlaceholder: 'Search and select group...',
      noGroupsFound: 'No groups found.',
      selectedId: 'Selected ID:',
      creating: 'Creating...',
      success: 'Project created successfully!',
      error: 'Failed to create project',
      invalidData: 'Invalid project data received from server or creation failed.',
      gpu: {
        quota: 'GPU Quota (Unit: 1/10 GPU)',
        quotaPlaceholder: 'e.g., 10 (represents 1 full GPU)',
        threadLimit: 'GPU Thread Limit (%)',
        threadLimitPlaceholder: 'e.g., 10',
        memoryLimit: 'GPU Memory Limit (MB)',
        memoryLimitPlaceholder: 'e.g., 1280',
        accessMode: 'GPU Access Mode',
        shared: 'Shared',
        dedicated: 'Dedicated',
      },
      mps: {
        settings: 'MPS Settings (Shared Mode Only)',
        threadLimit: 'MPS Thread Limit (%)',
        memoryLimit: 'MPS Memory Limit (MB)',
      },
    },
    detail: {
      titleSuffix: 'Project Details',
      description: 'Details and settings for project {name}',
      infoLabel: 'Project Info',
      needId: 'Project ID required',
      errorTitle: 'An error occurred',
      notFoundTitle: 'Project not found',
      notFoundMessage: 'Cannot find project with ID {id}.',
      tabs: {
        overview: 'Overview',
        configurations: 'Configurations',
        storage: 'Storage',
        members: 'Members',
      },
    },
    members: {
      title: 'Project Members',
      description: 'Users who have access to this project (via Group ID: {groupId}).',
      searchPlaceholder: 'Search members...',
      addMember: 'Add Member',
      noneFound: 'No members found.',
      noMatch: 'No members match the search.',
    },
    actions: {
      new: 'New Project',
      delete: 'Delete project {name}',
      errorDelete: 'Unable to delete project.',
      errorCreate: 'Unable to create project.',
      errorSelectGroup: 'Please select a group first',
    },
  },
  group: {
    id: 'Group ID',
    myGroups: 'My Groups',
    pageTitle: 'My Groups | AI Platform',
    pageDescription: 'View and manage your groups.',
    subtitle: 'Access your project groups and collaborate with your team.',
    searchPlaceholder: 'Search groups...',
    createNew: 'Create new group',
    noMatch: 'No groups match "{term}"',
    button: {
      new: 'New Group',
    },
    error: {
      fetch: 'Unable to fetch groups',
      create: 'Unable to create group',
      delete: 'Unable to delete group.',
      deleteFailed: 'Error occurred while deleting.',
      unknown: 'An unknown error occurred.',
    },
  },
  invite: {
    title: 'Invite Member',
    description: 'Select a user and assign a role.',
    userLabel: 'User',
    userSearchPlaceholder: 'Search users...',
    noResults: 'No results found',
    inviting: 'Inviting...',
    submit: 'Invite Member',
    error: {
      selectUser: 'Please select a user to invite.',
      unknown: 'An unknown error occurred.',
    },
  },
  form: {
    page: {
      title: 'Forms',
      description: 'Submit your support requests',
    },
    title: 'Submit Form',
    adminTitle: 'Forms - Admin Requests',
    field: {
      title: 'Title',
      description: 'Description',
      project: 'Project (optional)',
    },
    placeholder: {
      title: 'Enter a short title for the issue',
      description: 'Describe your request...',
      descriptionLong: 'Describe the issue or request you encountered',
      exampleTitle: 'e.g. Increase PVC size',
      noneSelected: '-- Not selected --',
    },
    status: {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      rejected: 'Rejected',
    },
    action: {
      process: 'Process',
      reject: 'Reject',
      complete: 'Complete',
    },
    apply: {
      title: 'Apply',
    },
    history: {
      title: 'History',
      loading: 'Loading...',
      empty: 'No records yet',
    },
    messages: {
      created: 'Form created successfully!',
      createFailed: 'Create form failed: ',
      submitted: 'Submitted — admins will respond shortly.',
      submitFailed: 'Submit failed',
      titleRequired: 'Please provide a title',
    },
    misc: {
      projectId: 'Related Project ID: {id}',
    },
  },
  monitor: {
    panel: {
      title: 'Real-time Monitoring',
      subtitle: 'Live logs and status updates.',
    },
    table: {
      podName: 'Pod Name',
      namespace: 'Namespace',
      status: 'Status',
      actions: 'Actions',
    },
    col: {
      eventType: 'Event Type',
      kind: 'Kind',
      name: 'Name',
      endpoint: 'Endpoint / IP',
      status: 'Status',
    },
    status: {
      running: 'Running',
      active: 'Active',
      completed: 'Completed',
      succeeded: 'Succeeded',
      added: 'Added',
      pending: 'Pending',
      creating: 'Creating',
      modified: 'Modified',
      failed: 'Failed',
      error: 'Error',
      deleted: 'Deleted',
      idle: 'Idle',
    },
    empty: {
      noPods: 'No pods found.',
    },
    misc: {
      agePrefix: 'Age:',
      waiting: 'Waiting for events...',
      connect: 'Connect',
      namespaceLabel: 'Namespace: {ns}',
    },
  },
  config: {
    createTitle: 'Create new configuration',
    createSubtitle: 'Use the wizard to create a config or edit YAML directly.',
    tabs: {
      wizard: 'Wizard',
      yaml: 'Raw YAML',
    },
    filename: {
      label: 'Config name',
      prefix: 'Filename:',
      note: 'Must be unique and end with .yaml or .yml.',
    },
    wizard: {
      imageLabel: 'Container image',
      imageNote: 'Enter the Docker image name.',
      gpuLabel: 'GPU Count',
      pvcLabel: 'Mount PVC (optional)',
    },
    pvc: {
      placeholder: '-- Select PVC --',
      loading: 'Loading PVCs...',
      note: 'Select a Persistent Volume Claim to mount.',
    },
    fields: {
      mountPath: 'Mount path',
      command: 'Command (optional)',
      args: 'Arguments (optional)',
      yamlContent: 'YAML Content',
    },
    actions: {
      create: 'Create configuration',
      creating: 'Creating...',
    },
    storageClass: 'Storage Class',
    error: {
      filenameRequired: 'Filename is required.',
      filenameSuffix: 'Filename must end with .yaml or .yml',
      yamlEmpty: 'YAML content cannot be empty.',
    },
  },
  fileBrowser: {
    user: {
      title: 'My Personal Drive',
      description: 'Access your private storage space via Secure Ingress.',
      confirmStop: 'Are you sure you want to stop your personal drive?',
    },
    status: {
      checking: 'Checking system configuration...',
      noStorage: 'Storage space not initialized. Please contact administrator.',
    },
    label: {
      status: 'Status',
    },
    state: {
      running: 'Running (Ready)',
      pending: 'Starting...',
      terminating: 'Stopping...',
      stopped: 'Stopped',
      unknown: 'Unknown',
    },
    button: {
      start: 'Start Drive',
      starting: 'Requesting...',
      open: 'Open',
      stop: 'Stop',
      preparing: 'Preparing...',
      terminating: 'Terminating...',
    },
    error: {
      verifyStorage: 'Unable to verify storage configuration.',
      startFailed: 'Failed to start drive.',
      stopFailed: 'Failed to stop drive.',
    },
  },
  notification: {
    title: 'Notifications',
    requestChange: 'requests permission to change',
    project: 'Project',
    viewAll: 'View all notifications',
    time: {
      '5min': '5 min ago',
      '8min': '8 min ago',
      '15min': '15 min ago',
      '1hour': '1 hour ago',
    },
  },
  table: {
    id: 'ID',
    user: 'User',
    project: 'Project',
    titleDesc: 'Title / Description',
    status: 'Status',
    actions: 'Actions',
  },
  error: {
    fetchData: 'Unable to fetch data',
    initData: 'Unable to fetch initial data',
  },
} as const;

export default en;
export type TranslationSchema<T> = {
  -readonly [K in keyof T]: T[K] extends string ? string : TranslationSchema<T[K]>;
};

export type Dictionary = TranslationSchema<typeof en>;
