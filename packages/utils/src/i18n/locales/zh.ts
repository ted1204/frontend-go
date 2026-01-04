/**
 * 繁體中文 (Traditional Chinese) 翻譯字典 - 優化版
 * 純巢狀結構，移除所有重複的扁平 key
 * 性能優化：將原本 ~750 行精簡至 ~450 行
 */

const zh = {
  // --- 載入狀態 ---
  loading: {
    default: '載入中...',
    forms: '正在載入表單...',
  },
  // --- 品牌 / 全域 ---
  brand: {
    name: 'AI 平台',
  },

  // --- 通用 / 共享 ---
  common: {
    refresh: '重整',
    // 動作
    create: '建立',
    edit: '編輯',
    delete: '刪除',
    cancel: '取消',
    submit: '送出',
    save: '儲存',
    search: '搜尋...',
    remove: '移除',
    actions: '動作',
    // 狀態
    loading: '載入中...',
    submitting: '提交中...',
    success: '成功',
    error: '錯誤',
    // 標籤
    id: 'ID',
    name: '名稱',
    description: '描述',
    status: '狀態',
    createdAt: '建立時間',
    updatedAt: '更新時間',
    noData: '無資料。',
    untitled: '無標題',
    confirmDelete: '您確定要刪除嗎？',
  },

  // --- 狀態 ---
  status: {
    active: '啟用中',
    idle: '閒置',
    pending: '待審核',
    approved: '已核准',
    rejected: '已駁回',
    processing: '處理中',
    completed: '已完成',
    succeeded: '成功',
    failed: '失敗',
    running: '執行中',
    unknown: '未知',
  },

  // --- 導覽 ---
  breadcrumb: {
    home: '首頁',
    projects: '專案',
    groups: '群組',
  },

  sidebar: {
    dashboard: '儀表板',
    admin: '管理',
    projects: '專案',
    groups: '群組',
    pods: 'Pods',
    fileBrowser: '雲端檔案管理員',
    forms: '我的表單',
    menu: '菜單',
    jobs: '工作',
    ecommerce: '電子商務',
  },

  // --- 錯誤訊息 ---
  error: {
    fetch: '無法擷取資料',
    fetchGroups: '讀取群組失敗',
    fetchData: '讀取資料失敗',
    createGroup: '建立群組失敗',
    deleteGroup: '刪除群組失敗',
    deleteFailed: '刪除失敗',
    initData: '資料初始化失敗',
    selectGroup: '請選擇群組',
    invalidProjectData: '無效的專案資料',
    createProject: '建立專案失敗',
    deleteProject: '刪除專案失敗',
    userNotLogged: '使用者未登入',
  },

  // --- 頁面 ---
  page: {
    admin: {
      title: '管理儀表板',
      description: '管理中心',
      auditLogs: {
        title: '審計日誌',
        description: '系統安全與變更追蹤',
        breadcrumb: '審計日誌',
        heading: '系統軌跡',
        subHeading: '監控並分析管理操作與資源變更。',
        count: '顯示最近 {{count}} 筆記錄',
        emptyTitle: '未找到日誌',
        emptyDesc: '請調整篩選條件以查看更多結果。',
      },
    },
    adminForm: {
      title: '表單儀表板',
      description: '管理使用者提交的表單。',
    },
    projects: {
      title: '專案列表',
      description: '查看可存取的專案。',
    },
    manageGroups: {
      title: '群組管理',
      description: '管理您的組織群組。',
    },
    notFound: {
      title: '找不到頁面',
      description: '這是 AI 平台的 404 頁面。',
      message: '我們找不到您要瀏覽的頁面！',
      back: '返回首頁',
    },
    home: {
      title: '儀表板',
      description: '歡迎來到您的儀表板',
      welcome: '歡迎使用 AI 平台',
      subtitle: '在此管理您的專案、群組與 Pods。',
    },
  },

  // --- 監控 / Pods ---
  monitor: {
    title: '即時監控',
    panel: {
      title: '即時監控',
      subtitle: '即時日誌與狀態更新。',
    },
    table: {
      podName: 'Pod 名稱',
      namespace: '命名空間',
      status: '狀態',
      actions: '動作',
      kind: '類型',
      name: '名稱',
      details: '詳細資訊',
      age: '存活時間',
      images: '映像檔',
      restarts: '重啟次數',
      labels: '標籤',
    },
    empty: {
      noPods: '找不到 Pod。',
      waitingForData: '等待叢集資料串流...',
    },
    button: {
      connect: '連線',
    },
    agePrefix: '存在時間',
    waiting: '等待叢集資料串流...',
    websocketError: 'WebSocket 錯誤',
    connected: '已連線',
    disconnected: '已斷線',
  },

  // --- 群組 ---
  groups: {
    title: '群組',
    myGroups: '我的群組',
    subtitle: '管理並加入群組。',
    createNew: '建立新群組',
    searchPlaceholder: '搜尋群組...',
    name: '群組名稱',
    description: '描述',
    namePlaceholder: '輸入群組名稱...',
    descriptionPlaceholder: '輸入描述...',
    noDescription: '無描述',
    creating: '正在建立群組...',
    createButton: '建立群組',

    // 錯誤
    error: {
      userNotLogged: '使用者未登入',
      userIdMissing: '缺少使用者 ID',
      unknown: '未知錯誤',
      loadFailed: '無法載入群組',
    },
    noMatch: '找不到符合 "{term}" 的群組。',

    // 頁面
    page: {
      title: '群組',
      description: '在此管理您的群組。',
    },

    // 詳情
    infoTitle: '群組資訊',
    inviteUser: '邀請使用者',
    manageMembers: '管理',
    membersList: '群組成員',
    memberCount: '此群組中有 {count} 個成員。',
    noMembers: '尚未邀請任何成員。',
    notFound: '找不到群組。',

    // 頁籤
    tab: {
      overview: '概覽',
      members: '成員',
      info: '資訊',
    },

    // 表單
    form: {
      title: '建立群組',
      nameRequired: '群組名稱為必填',
      createFailed: '建立群組失敗',
      creating: '建立中...',
      cancel: '取消',
    },

    // 列表
    list: {
      title: '群組',
      description: '瀏覽並管理群組。',
      searchPlaceholder: '搜尋群組...',
      loading: '載入群組中...',
      deleteGroupAria: '刪除群組',
      empty: {
        filter: '沒有符合 "{term}" 的群組。',
        noGroups: '找不到群組。',
        filterTip: '請嘗試不同的搜尋詞。',
        noGroupsTip: '建立一個新群組以開始使用。',
      },
    },

    // 空白狀態
    empty: {
      title: '沒有群組',
      description: '您尚未加入任何群組。',
    },

    // 標籤
    label: '群組名稱',
    descriptionLabel: '描述',
  },

  // --- 專案 ---
  project: {
    about: '關於專案',
    name: '專案名稱',
    description: '描述',
    group: '群組',
    noDescription: '無描述',
    untitled: '無標題',
    idLabel: '專案 ID: {id}',
    requestSupport: '請求支援',
    empty: '沒有可用的專案。',
    groupId: '群組 ID',
    gpuResources: 'GPU 資源',
    gpuQuotaUnit: '{quota} GPU',
    gpuAccessMode: '存取模式',
    gpuAccessShared: '共享',
    gpuAccessDedicated: '專用',
    mpsSettings: 'MPS 設定',
    mpsThreadLimit: '執行緒限制: {value}%',
    mpsMemoryLimit: '記憶體限制: {value} MB',
    mpsUnlimited: '無限制',
    delete: '刪除專案: {name}',

    // 列表
    list: {
      title: '專案',
      description: '瀏覽並管理所有專案',
      create: '新專案',
      searchPlaceholder: '搜尋專案...',
      loading: '載入專案中...',
      errorPrefix: '錯誤：',
      empty: {
        filter: '沒有符合 "{term}" 的專案。',
        noProjects: '找不到專案。',
      },
      colProject: '專案',
      colStatus: '狀態',
      emptyFilter: '沒有符合 "{term}" 的專案。',
      emptyAssigned: '您的群組未被指派任何專案。',
    },

    // 建立
    create: {
      title: '建立新專案',
      error: '建立專案失敗',
      name: '專案名稱',
      namePlaceholder: '輸入唯一的專案名稱',
      description: '描述',
      descriptionPlaceholder: '輸入專案描述',
      group: '群組',
      groupPlaceholder: '選擇一個群組',
      groupLabel: '群組',
      gpuQuota: 'GPU 配額',
      gpuQuotaPlaceholder: '例如：1',
      gpuLabel: 'GPU 配額',
      gpuThreadLimit: 'MPS 執行緒限制 (%)',
      gpuThreadLimitPlaceholder: '例如：100',
      gpuMemoryLimit: 'MPS 記憶體限制 (MB)',
      gpuMemoryLimitPlaceholder: '例如：1024',
      gpuAccessMode: 'GPU 存取模式',
      gpuAccessShared: '共享 (MPS)',
      gpuAccessDedicated: '專用',
      mpsSettings: 'MPS 設定',
      mpsThreadLimit: '執行緒限制',
      mpsMemoryLimit: '記憶體限制',
      noGroupsFound: '找不到群組。請先建立群組。',
      selectedId: '已選群組 ID: {id}',
      cancel: '取消',
      submit: '建立專案',
      creating: '建立中...',
    },

    // 編輯
    edit: {
      title: '編輯專案',
    },

    // 詳情
    detail: {
      overview: '概覽',
      members: '成員',
      settings: '設定',
      needProjectId: '需要專案 ID',
      fetchError: '無法讀取專案詳情',
      createConfigError: '建立設定失敗',
      updateConfigError: '更新設定失敗',
      deleteConfigError: '刪除設定失敗',
      instanceCreateSent: '實例建立請求已發送',
      createInstanceError: '建立實例失敗',
      confirmDeleteInstance: '您確定要刪除此實例嗎？',
      instanceDeleteSent: '實例刪除請求已發送',
      deleteInstanceError: '刪除實例失敗',
      errorTitle: '錯誤',
      notFoundTitle: '找不到專案',
      notFoundMessage: '找不到 ID 為 {id} 的專案。',
      titleSuffix: '專案詳情',
      description: '管理專案 {name} 的設定、儲存與成員。',
      tab: {
        overview: '概覽',
        configurations: '設定',
        storage: '儲存',
        members: '成員',
      },
      infoLabel: '專案資訊',
      createdAt: '建立時間',
      updatedAt: '更新時間',
      configTitle: '設定',
      configDesc: '管理專案設定與部署。',
      addConfig: '新增設定',
      pvcTitle: '儲存 (PVC)',
      pvcDesc: '管理專案持續性磁碟區宣告 (PVC)。',
    },

    // 成員
    members: {
      title: '成員',
      description: '管理群組 {groupId} 的成員。',
      searchPlaceholder: '搜尋成員...',
      addMember: '新增成員',
    },

    // 角色
    role: {
      admin: '管理員',
      manager: '經理',
      user: '使用者',
    },
  },

  // --- 儲存 / 檔案瀏覽器 ---
  storage: {
    pageTitle: '雲端檔案管理員',
    breadcrumb: '雲端檔案管理員',
    pageSubtitle: '瀏覽並管理您的儲存磁碟區與專案磁碟。',
    project: '專案',
    starting: '正在啟動儲存瀏覽器...',
    stopping: '正在停止儲存瀏覽器...',
    actionFailed: '動作失敗。請重試。',
    errLoadList: '無法載入儲存清單',

    // 頁籤
    tab: {
      personal: '個人中樞',
      project: '專案儲存',
    },

    // 狀態
    readWrite: '讀寫',
    readOnly: '唯讀',
    online: '線上',
    offline: '離線',
    scanning: '掃描磁碟區中...',

    // 動作
    action: {
      start: '啟動磁碟',
      stop: '停止磁碟',
      open: '開啟瀏覽器',
    },

    // 訊息
    msg: {
      starting: '正在啟動儲存瀏覽器...',
      stopping: '正在停止儲存瀏覽器...',
      actionFailed: '動作失敗。請重試。',
      loadFailed: '無法載入儲存清單。',
    },

    // 個人中樞
    personal: {
      title: '個人儲存中樞',
      description: '透過安全登入存取您的私人儲存空間。',
      noStorageTitle: '儲存空間未初始化',
      noStorageDesc: '您的個人儲存空間尚未佈建。',
      contactAdmin: '請聯繫管理員初始化您的儲存空間。',
    },

    // 欄位
    colProject: '專案',
    colStatus: '狀態',
    emptyFilter: '沒有符合 "{term}" 的專案。',
    emptyAssigned: '您的群組未被指派任何專案。',
  },

  // --- 表單 ---
  form: {
    title: '提交表單',
    status: {
      pending: '待審核',
      approved: '已核准',
      rejected: '已駁回',
      processing: '處理中',
      completed: '已完成',
    },
    action: {
      process: '處理',
      reject: '駁回',
      complete: '完成',
    },
    label: {
      title: '標題',
      description: '描述',
      project: '專案',
    },
    select: {
      none: '無',
    },
    error: {
      titleRequired: '標題為必填項',
      submitFailed: '提交失敗',
    },
    success: {
      submitted: '提交成功，管理員將儘快審核。',
    },
    createFailed: '建立表單失敗',
    created: '表單建立成功！',
    field: {
      title: '標題',
      description: '描述',
    },
    exampleTitle: '範例標題',
    placeholder: {
      title: '輸入標題...',
      description: {
        base: '輸入描述...',
        long: '輸入詳細描述...',
      },
    },
    projectId: '專案 ID: {id}',
    cancel: '取消',
    submitting: '提交中...',
    submit: '送出',

    // 歷史紀錄
    history: {
      title: '歷史紀錄',
      empty: '無歷史紀錄。',
      loading: '載入歷史紀錄中...',
    },

    // 申請
    apply: {
      title: '申請',
    },

    // 頁面
    page: {
      title: '表單頁面',
      description: '提交並管理您的表單。',
    },
  },

  // --- 表格 ---
  table: {
    id: 'ID',
    user: '使用者',
    project: '專案',
    titleDesc: '標題 / 描述',
    status: '狀態',
    actions: '動作',
    role: '角色',
  },

  // --- 設定檔 ---
  configFile: {
    editFile: '編輯檔案',
    destroyInstance: '銷毀實例',
    deleteFile: '刪除檔案',
    notFoundTitle: '未找到設定檔',
    notFoundDesc: '按一下「新增設定」開始使用。',
    toggleResources: '切換資源',
    id: 'ID',
    createdAt: '建立時間',
    deployInstance: '部署實例',
    deploy: '部署',
    relatedResources: '相關資源',
    noRelatedResources: '沒有相關資源',
    notDeployed: '此設定檔尚未部署。',
  },

  config: {
    error: {
      filenameRequired: '檔案名稱為必填',
      filenameSuffix: '檔案名稱必須以 .yaml 或 .yml 結尾',
      yamlEmpty: 'YAML 內容不得為空',
    },
    createTitle: '建立新設定',
    createSubtitle: '使用精靈模式或直接編輯 YAML。',
    tab: {
      wizard: '精靈模式',
      yaml: '原始 YAML',
    },
    filename: {
      label: '設定檔名稱',
      prefix: '檔名:',
      note: '必須是唯一的且以 .yaml 或 .yml 結尾',
    },
    wizard: {
      imageLabel: '容器映像檔 (Image)',
      imageNote: '指定要使用的映像檔。',
      gpuLabel: 'GPU 配額',
      pvcLabel: 'PVC',
    },
    pvc: {
      placeholder: '選擇 PVC...',
      loading: '載入 PVC 中...',
      note: '選擇用於儲存的 PVC。',
    },
    mountPath: '掛載路徑 (Mount Path)',
    commandLabel: '指令 (Command)',
    argsLabel: '參數 (Arguments)',
    yamlContentLabel: 'YAML 內容',
    creating: '建立中...',
    createButton: '建立設定',
  },

  // --- 管理儲存 ---
  admin: {
    dashboard: '儀表板',
    storage: {
      title: '儲存管理',
      userStorage: {
        successInit: '儲存空間初始化成功',
        confirmDelete: '您確定要刪除此儲存空間嗎？',
        successDelete: '儲存空間已成功刪除',
        successExpand: '儲存空間已成功擴充',
        targetUser: '目標使用者',
        username: '使用者名稱',
        usernamePlaceholder: '輸入使用者名稱',
        checkStatus: '檢查狀態',
        statusExists: '儲存空間存在',
        statusMissing: '找不到儲存空間',
        lifecycleTitle: '儲存空間生命週期',
        hintUnknown: '狀態未知',
        hintMissing: '未找到儲存空間',
        hintExists: '儲存空間作用中',
        processing: '處理中...',
        initBtn: '初始化儲存',
        deleteBtn: '刪除中樞',
        checkStatusFirst: '先檢查狀態',
        expandTitle: '擴充儲存',
        newSize: '新大小 (GB)',
        newSizePlaceholder: '例如：50',
        expandBtn: '擴充儲存',
      },
      projectStorage: {
        projectPlaceholder: '選擇專案...',
        createSuccess: '專案儲存建立成功',
        createGuideTitle: '建立專案儲存',
        createGuideDesc: '為專案儲存建立新 PVC。',
        form: {
          project: '專案',
          capacity: '容量',
          capacityHint: '例如：10Gi',
        },
        createSubmit: '建立儲存',
        actionExpandPrompt: '擴充儲存容量',
        actionConfirmDelete: '您確定要刪除此儲存空間嗎？',
        list: {
          project: '專案',
          status: '狀態',
          capacity: '容量',
          age: '存活時間',
          actions: '動作',
          empty: '未找到專案儲存。',
        },
        actionEdit: '編輯',
        actionDelete: '刪除',
        tabList: '清單',
        tabCreate: '建立',
        errorSelectProject: '請選擇一個專案',
      },
      pvc: {
        title: 'PVC 管理',
        createTitle: '建立新 PVC',
        expandTitle: '擴充 PVC',
        sizeLabel: '大小 (Gi)',
      },
      forms: '表單',
    },
    storageManagement: {
      title: '儲存管理',
      userTab: '使用者中樞',
      projectTab: '專案 PVC',
      initUser: '初始化儲存',
      deleteUser: '刪除中樞',
      expandUser: '擴充容量',
      hintExists: '儲存空間作用中 (Ready)。',
      hintMissing: '未找到儲存空間。',
      confirmDelete: '您確定要「永久」刪除此儲存空間嗎？',
    },
  },

  // --- 驗證 ---
  auth: {
    login: {
      title: '登入',
      subtitle: '輸入您的使用者名稱和密碼以登入！',
      username: '使用者名稱',
      usernamePlaceholder: '輸入您的使用者名稱',
      password: '密碼',
      passwordPlaceholder: '輸入您的密碼',
      forgotPassword: '忘記密碼？',
      submit: '登入',
      noAccount: '還沒有帳號？',
      signUp: '註冊',
      backToDashboard: '返回儀表板',
      loginFailed: '登入失敗，請重試。',
      pageTitle: '登入 | AI 平台',
      pageDescription: '這是 AI 平台的登入頁面',
    },
    signOut: '登出',
    signIn: '登入',
  },

  // --- 使用者 ---
  user: {
    profile: '個人檔案',
    signOut: '登出',
    login: '登入',
    editProfile: '編輯個人檔案',
    support: '支援',
  },

  // --- 角色 ---
  role: {
    admin: {
      name: '管理員',
      desc: '對所有資源和設定擁有完整存取權限。',
    },
    manager: {
      name: '經理',
      desc: '可以管理專案、群組和成員。',
    },
    user: {
      name: '使用者',
      desc: '可以存取和使用指派的專案。',
    },
    label: '角色: {role}',
  },

  // --- 成員 ---
  members: {
    noneFound: '找不到成員。',
    noMatch: '沒有符合搜尋條件的成員。',
  },

  // --- 語言 / i18n ---
  language: {
    aria: '語言選擇器',
    switchToEn: '切換至英文',
    switchToZh: '切換至中文',
    short: '中',
    switchLabel: '切換語言',
  },

  // --- 通知 ---
  notification: {
    title: '通知',
    requestChange: '請求變更',
    project: '專案',
    viewAll: '查看全部',
    time: {
      '5min': '5 分鐘前',
      '8min': '8 分鐘前',
      '15min': '15 分鐘前',
      '1hour': '1 小時前',
    },
  },

  // --- 邀請 / 成員 ---
  invite: {
    selectUserError: '請選擇要邀請的使用者',
    unknownError: '邀請使用者時發生未知錯誤',
    title: '邀請使用者',
    description: '邀請使用者加入專案或群組',
    userLabel: '使用者',
    userSearchPlaceholder: '搜尋使用者...',
    noResults: '找不到使用者',
  },

  // --- 分頁 ---
  pagination: {
    prev: '上一頁',
    previous: '上一頁',
    next: '下一頁',
    pageOf: '第 {current} 頁，共 {total} 頁',
    pageInfo: '第 {current} 頁，共 {total} 頁',
  },

  // --- 檢視 / 顯示 ---
  view: {
    toggleToAdmin: '切換至管理員',
    toggleToUser: '切換至使用者',
    grid: '網格檢視',
    list: '列表檢視',
  },

  // --- 搜尋 ---
  search: {
    projectsPlaceholder: '搜尋專案...',
    placeholder: '搜尋...',
  },

  // --- 按鈕 ---
  button: {
    newGroup: '新群組',
    newProject: '新專案',
  },

  // --- 終端機 ---
  terminal: {
    connected: '已連線',
    websocketError: 'WebSocket 錯誤',
    disconnected: '已斷線',
  },

  // --- 徽章 ---
  badge: {
    new: '新',
    pro: '專業版',
  },

  // --- 審計 ---
  filter: {
    title: '篩選條件',
    userId: '用戶 ID',
    resource: '資源類型',
    action: '動作',
    limit: '顯示筆數',
    dateRange: '時間範圍',
    placeholder: {
      userId: '搜尋 ID...',
      resource: '例如：project, user',
      action: '例如：create, update',
    },
  },
  log: {
    noDescription: '未記錄描述',
    view: '查看變更',
    hide: '隱藏詳情',
    before: '變更前',
    after: '變更後',
  },
} as const;

export default zh;
export type Dictionary = typeof zh;
export type TranslationSchema<T> = {
  -readonly [K in keyof T]: T[K] extends string ? string : TranslationSchema<T[K]>;
};
