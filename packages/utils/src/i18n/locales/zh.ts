import type { Dictionary } from './en';

const zh: Dictionary = {
  brand: {
    name: 'AI 平台',
  },
  common: {
    noDescription: '無描述',
    createdAt: '建立時間',
    untitled: '未命名專案',
    cancel: '取消',
    success: "成功",
    edit: "編輯",
    delete: "刪除",
    submit: '送出',
    submitting: '送出中...',
    loading: '載入中...',
    error: '錯誤',
    id: 'ID',
  },
  badge: {
    new: '新',
    pro: '專業',
  },
  pagination: {
    prev: '上一頁',
    next: '下一頁',
    pageOf: '第 {current} 頁，共 {total} 頁',
  },
  breadcrumb: {
    home: '首頁',
    projects: '專案',
    groups: '群組',
  },
  sidebar: {
    menu: '選單',
    admin: '管理員',
    projects: '專案列表',
    jobs: '任務列表',
    groups: '群組列表',
    pods: 'Pods 列表',
    fileBrowser: '檔案瀏覽器',
    dashboard: '儀表板',
    ecommerce: '電子商務',
    myForms: '我的電子申請表單',
  },
  search: {
    placeholder: '搜尋或輸入指令...',
    projectsPlaceholder: '搜尋專案...',
  },
  view: {
    toggleToAdmin: '切換至管理員',
    toggleToUser: '切換至使用者',
    grid: '網格視圖',
    list: '列表視圖',
  },
  language: {
    short: '中',
    switchLabel: '中文 / EN',
    aria: '切換語言',
  },
  user: {
    editProfile: '帳號設定',
    support: '支援',
    signOut: '登出',
    notLogged: '使用者未登入。',
    idMissing: '找不到使用者 ID。',
  },
  role: {
    label: '角色: {role}',
    admin: {
      name: '管理員',
      desc: '擁有所有設定的完整權限。',
    },
    manager: {
      name: '專案管理者',
      desc: '可以管理成員和內容。',
    },
    user: {
      name: '一般使用者',
      desc: '可以檢視和互動內容。',
    },
  },
  page: {
    home: {
      title: '儀表板 | AI 平台',
      description: 'AI 平台儀表板',
    },
    admin: {
      title: '管理員儀表板 | TailAdmin',
      description: '管理任務的中心樞紐。',
    },
    projects: {
      title: '我的專案 | TailAdmin',
      description: '可存取的專案列表。',
    },
    manageGroups: {
      title: '管理群組',
      description: '管理組織群組的管理面板。',
    },
    adminForm: {
      title: '表單儀表板',
      description: '管理使用者提交的電子表單',
    },
    notFound: {
      title: '錯誤',
      description: '這是 AI 平台的 404 頁面',
      message: '我們似乎找不到您要尋找的頁面！',
      back: '返回首頁',
    },
  },
  home: {
    welcome: '歡迎來到 AI 平台',
    subtitle: '在這裡管理您的專案、群組和 Pod。',
  },
  admin: {
    dashboard: '儀表板',
    manageProjects: '專案管理',
    manageGroups: '群組管理',
    forms: '電子申請表單管理',
    storageManagement: 'Storage 管理',
    storage: {
      title: '儲存資源管理',
      description: '集中管理使用者儲存中心 (Hub) 與專案 PVC。',
      tab: {
        user: '使用者儲存中心 (Hub)',
        project: '專案儲存管理 (PVC)',
      },
      // [NEW] User Storage Hub Specifics
      user: {
        targetUser: '目標使用者',
        username: '使用者名稱',
        usernamePlaceholder: '例如：sky-lin',
        checkStatus: '檢查狀態',
        checkStatusFirst: '請先檢查狀態',

        // 狀態指示
        statusExists: '儲存空間已存在 (就緒)',
        statusMissing: '未找到儲存空間',

        // 週期管理卡片
        lifecycleTitle: '儲存週期管理',
        hintUnknown: '請輸入使用者名稱並檢查狀態，以執行後續操作。',
        hintMissing: '未找到儲存中心，您可以立即初始化。',
        hintExists: '儲存中心運作中。如有必要，您可以將其刪除 (危險操作)。',

        // 動作按鈕
        initBtn: '初始化儲存',
        deleteBtn: '刪除儲存中心',
        confirmDelete: '您確定要「永久刪除」此使用者的儲存空間嗎？此動作無法復原。',

        // 擴容
        expandTitle: '擴充容量',
        newSize: '新的容量',
        newSizePlaceholder: '例如：1Ti',
        expandBtn: '擴充容量',

        // 回饋訊息
        processing: '處理中...',
        successInit: '使用者 "{{user}}" 初始化成功。',
        successDelete: '使用者 "{{user}}" 的儲存空間已刪除。',
        successExpand: '使用者 "{{user}}" 已擴充至 {{size}}。',
      },
      project: {
        tab: {
          list: '儲存空間列表',
          create: '新增專案儲存'
        },
        create: {
          guideTitle: '建立專案共享空間',
          guideDesc: '這將為選定的專案配置一個 Persistent Volume Claim (PVC)。所有專案成員將擁有讀寫權限。',
          submit: '配置儲存空間',
          success: '專案儲存空間建立成功。'
        },
        form: {
          project: '目標專案',
          projectPlaceholder: '請選擇一個專案...',
          capacity: '儲存容量 (Gi)',
          capacityHint: '預設：10Gi。日後可再擴充。'
        },
        list: {
          project: '專案名稱',
          namespace: '命名空間',
          status: '狀態',
          capacity: '容量',
          age: '建立時間',
          actions: '操作',
          empty: '目前沒有專案儲存空間。'
        },
        action: {
          edit: '編輯配額',
          delete: '刪除',
          confirmDelete: '您確定要「永久刪除」此專案的儲存空間嗎？此動作無法復原。',
          expandPrompt: '請輸入新的容量大小 (例如：20Gi)：'
        }
      },
    },
    pvc: {
      title: 'PVC 管理',
      tab: {
        list: '列表',
        create: '建立',
        expand: '擴充',
        delete: '刪除',
      },
      create: {
        title: '建立新 PVC',
        description: '為您的工作負載配置新的持久卷聲明 (PVC)。',
      },
      list: {
        title: 'PVC 列表',
        namespace: '命名空間',
        customNamespace: '自定義命名空間',
        name: '名稱',
        status: '狀態',
        size: '容量',
        loading: '載入 PVC 列表中...',
        noData: '找不到 PVC 資料。',
      },
      expand: {
        title: '擴充 PVC 容量',
        description: '增加現有 Persistent Volume Claim 的儲存空間。',
        newSize: '新容量',
        newSizePlaceholder: '例如: 20Gi',
        submit: '擴充容量',
        expanding: '擴充中...',
        success: 'PVC 擴充請求已送出！',
        error: '擴充 PVC 失敗。',
        namespaceInvalid: '不允許修改系統命名空間 (kube-system)。',
      },
    },
  },
  project: {
    idLabel: '專案 ID: {id}',
    untitled: '未命名專案',
    noDescription: '未提供描述。',
    requestSupport: '請求支援',
    delete: '刪除專案 {name}',
    gpuResources: 'GPU 資源',
    mpsSettings: 'MPS 設定',
    mps: {
      threadLimit: '執行緒限制',
      memoryLimit: '記憶體限制',
    },
    list: {
      title: '專案列表',
      myProjects: '我的專案',
      searchPlaceholder: '依名稱、描述或 ID 搜尋專案...',
      loading: '載入專案中...',
      errorPrefix: '錯誤:',
      empty: {
        filter: '沒有專案符合 "{term}"。請嘗試其他關鍵字。',
        noProjects: '找不到專案。建立新專案以開始使用。',
        assigned: '您的群組中沒有指派任何專案。',
      },
    },
    create: {
      title: '建立新專案',
      editTitle: '編輯專案',
      name: '專案名稱',
      namePlaceholder: '輸入專案名稱',
      description: '描述 (選填)',
      descriptionPlaceholder: '簡述專案目標...',
      group: '群組',
      groupPlaceholder: '搜尋並選擇群組...',
      noGroupsFound: '找不到群組。',
      selectedId: '已選擇 ID:',
      creating: '建立中...',
      success: '專案建立成功！',
      error: '建立專案失敗',
      invalidData: '從伺服器接收到無效的專案資料或建立失敗。',
      gpu: {
        quota: 'GPU 配額 (單位: 1/10 GPU)',
        quotaPlaceholder: '例如: 10 (代表 1 張完整 GPU)',
        threadLimit: 'GPU 算力限制 (%)',
        threadLimitPlaceholder: '例如: 10',
        memoryLimit: 'GPU 記憶體限制 (MB)',
        memoryLimitPlaceholder: '例如: 1280',
        accessMode: 'GPU 存取模式',
        shared: 'Shared (共享)',
        dedicated: 'Dedicated (專用)',
      },
      mps: {
        settings: 'MPS 設定 (僅適用於 Shared 模式)',
        threadLimit: 'MPS 執行緒限制 (%)',
        memoryLimit: 'MPS 記憶體限制 (MB)',
      },
    },
    detail: {
      titleSuffix: '專案詳情',
      description: '專案 {name} 的詳情與設定',
      infoLabel: '專案資訊',
      needId: '需要專案 ID',
      errorTitle: '發生錯誤',
      notFoundTitle: '找不到專案',
      notFoundMessage: '無法找到 ID 為 {id} 的專案。',
      tabs: {
        overview: '總覽',
        configurations: '設定檔',
        storage: '儲存空間',
        members: '成員',
      },
    },
    members: {
      title: '專案成員',
      description: '擁有此專案存取權限的使用者 (透過群組 ID: {groupId})。',
      searchPlaceholder: '搜尋成員...',
      addMember: '新增成員',
      noneFound: '找不到成員。',
      noMatch: '沒有符合搜尋條件的成員。',
    },
    actions: {
      new: '新專案',
      delete: '刪除專案 {name}',
      errorDelete: '無法刪除專案。',
      errorCreate: '無法建立專案',
      errorSelectGroup: '請先選擇群組',
    },
  },
  group: {
    id: '群組 ID',
    myGroups: '我的群組',
    pageTitle: '我的群組 | AI 平台',
    pageDescription: '檢視並管理您的群組。',
    subtitle: '存取您的專案群組並與團隊協作。',
    searchPlaceholder: '搜尋群組...',
    createNew: '建立新群組',
    noMatch: '找不到符合 "{term}" 的群組',
    button: {
      new: '新群組',
    },
    error: {
      fetch: '無法取得群組',
      create: '無法建立群組',
      delete: '無法刪除群組。',
      deleteFailed: '刪除時發生錯誤。',
      unknown: '發生未知錯誤。',
    },
  },
  invite: {
    title: '邀請新成員',
    description: '選擇使用者並指派角色。',
    userLabel: '使用者',
    userSearchPlaceholder: '搜尋使用者...',
    noResults: '找不到結果。',
    inviting: '邀請中...',
    submit: '邀請成員',
    error: {
      selectUser: '請選擇要邀請的使用者。',
      unknown: '發生未知錯誤。',
    },
  },
  form: {
    page: {
      title: '電子表單',
      description: '送出您的支援請求',
    },
    title: '提交電子表單',
    adminTitle: '電子表單 - 管理者請求',
    field: {
      title: '標題',
      description: '描述',
      project: '所屬專案 (選填)',
    },
    placeholder: {
      title: '請輸入問題標題',
      description: '請描述您的請求...',
      descriptionLong: '請描述您遇到的問題或需求',
      exampleTitle: '例如：增加 PVC 大小',
      noneSelected: '-- 未選擇 --',
    },
    status: {
      pending: '待處理',
      processing: '處理中',
      completed: '已完成',
      rejected: '已駁回',
    },
    action: {
      process: '處理',
      reject: '駁回',
      complete: '完成',
    },
    apply: {
      title: '申請',
    },
    history: {
      title: '歷史紀錄',
      loading: '載入中...',
      empty: '目前沒有紀錄',
    },
    messages: {
      created: '表單建立成功！',
      createFailed: '建立表單失敗: ',
      submitted: '已送出，管理者會儘速回覆。',
      submitFailed: '送出失敗',
      titleRequired: '請填寫標題',
    },
    misc: {
      projectId: '關聯專案 ID: {id}',
    },
  },
  monitor: {
    panel: {
      title: '即時監控',
      subtitle: '即時日誌與狀態更新。',
    },
    table: {
      podName: 'Pod 名稱',
      namespace: '命名空間',
      status: '狀態',
      actions: '操作',
    },
    col: {
      eventType: '事件類型',
      kind: '種類',
      name: '名稱',
      endpoint: '端點/IP',
      status: '狀態',
    },
    status: {
      running: '執行中',
      active: '活躍',
      completed: '已完成',
      succeeded: '成功',
      added: '已新增',
      pending: '等待中',
      creating: '建立中',
      modified: '已修改',
      failed: '失敗',
      error: '錯誤',
      deleted: '已刪除',
      idle: '閒置',
    },
    empty: {
      noPods: '目前沒有 Pod。',
    },
    misc: {
      agePrefix: '存在時間:',
      waiting: '等待事件中...',
      connect: '連線',
      namespaceLabel: '命名空間: {ns}',
    },
  },
  config: {
    createTitle: '建立新設定檔',
    createSubtitle: '使用精靈建立設定或直接編輯 YAML。',
    tabs: {
      wizard: '精靈模式',
      yaml: '原始 YAML',
    },
    filename: {
      label: '設定檔名稱',
      prefix: '檔名:',
      note: '必須是唯一的名稱，且以 .yaml 或 .yml 結尾。',
    },
    wizard: {
      imageLabel: '容器映像檔',
      imageNote: '輸入 Docker 映像檔名稱。',
      gpuLabel: 'GPU 數量',
      pvcLabel: '掛載 PVC (選填)',
    },
    pvc: {
      placeholder: '-- 選擇 PVC --',
      loading: '載入 PVC 中...',
      note: '選擇要掛載的 Persistent Volume Claim。',
    },
    fields: {
      mountPath: '掛載路徑',
      command: '指令 (選填)',
      args: '參數 (選填)',
      yamlContent: 'YAML 內容',
    },
    actions: {
      create: '建立設定檔',
      creating: '建立中...',
    },
    storageClass: 'Storage Class',
    error: {
      filenameRequired: '檔名為必填。',
      filenameSuffix: '檔名必須以 .yaml 或 .yml 結尾',
      yamlEmpty: 'YAML 內容不能為空。',
    },
  },
  fileBrowser: {
    "user": {
      "title": "我的個人雲端硬碟",
      "description": "透過安全入口存取您的私有儲存空間。",
      "confirmStop": "確定要停止您的個人雲端硬碟嗎？"
    },
    "status": {
      "checking": "正在檢查系統配置...",
      "noStorage": "儲存空間尚未初始化，請聯繫管理員建立。"
    },
    "label": {
      "status": "目前狀態"
    },
    "state": {
      "running": "運行中 (就緒)",
      "pending": "啟動中...",
      "terminating": "停止中...",
      "stopped": "已停止",
      "unknown": "未知狀態"
    },
    "button": {
      "start": "啟動硬碟",
      "starting": "請求中...",
      "open": "開啟",
      "stop": "停止",
      "preparing": "環境準備中...",
      "terminating": "正在終止..."
    },
    "error": {
      "verifyStorage": "無法驗證儲存配置狀態。",
      "startFailed": "啟動硬碟失敗。",
      "stopFailed": "停止硬碟失敗。"
    }
  },
  notification: {
    title: '通知',
    requestChange: '請求變更權限',
    project: '專案',
    viewAll: '查看所有通知',
    time: {
      '5min': '5 分鐘前',
      '8min': '8 分鐘前',
      '15min': '15 分鐘前',
      '1hour': '1 小時前',
    },
  },
  table: {
    id: 'ID',
    user: '使用者',
    project: '專案',
    titleDesc: '標題 / 描述',
    status: '狀態',
    actions: '操作',
  },
  error: {
    fetchData: '無法取得資料',
    initData: '無法取得初始資料',
  },
};

export default zh;
