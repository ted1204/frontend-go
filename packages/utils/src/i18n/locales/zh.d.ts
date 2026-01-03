/**
 * 繁體中文 (Traditional Chinese) 翻譯字典 - 優化版
 * 純巢狀結構，移除所有重複的扁平 key
 * 性能優化：將原本 ~750 行精簡至 ~450 行
 */
declare const zh: {
  readonly brand: {
    readonly name: 'AI 平台';
  };
  readonly common: {
    readonly create: '建立';
    readonly edit: '編輯';
    readonly delete: '刪除';
    readonly cancel: '取消';
    readonly submit: '送出';
    readonly save: '儲存';
    readonly search: '搜尋...';
    readonly remove: '移除';
    readonly actions: '動作';
    readonly loading: '載入中...';
    readonly submitting: '提交中...';
    readonly success: '成功';
    readonly error: '錯誤';
    readonly id: 'ID';
    readonly name: '名稱';
    readonly description: '描述';
    readonly status: '狀態';
    readonly createdAt: '建立時間';
    readonly updatedAt: '更新時間';
    readonly noData: '無資料。';
    readonly untitled: '無標題';
    readonly confirmDelete: '您確定要刪除嗎？';
  };
  readonly status: {
    readonly active: '啟用中';
    readonly idle: '閒置';
    readonly pending: '待審核';
    readonly approved: '已核准';
    readonly rejected: '已駁回';
    readonly processing: '處理中';
    readonly completed: '已完成';
    readonly succeeded: '成功';
    readonly failed: '失敗';
    readonly running: '執行中';
    readonly unknown: '未知';
  };
  readonly breadcrumb: {
    readonly home: '首頁';
    readonly projects: '專案';
    readonly groups: '群組';
  };
  readonly sidebar: {
    readonly dashboard: '儀表板';
    readonly admin: '管理';
    readonly projects: '專案';
    readonly groups: '群組';
    readonly pods: 'Pods';
    readonly fileBrowser: '雲端檔案管理員';
    readonly forms: '我的表單';
    readonly menu: '菜單';
    readonly jobs: '工作';
    readonly ecommerce: '電子商務';
  };
  readonly error: {
    readonly fetch: '無法擷取資料';
    readonly fetchGroups: '讀取群組失敗';
    readonly fetchData: '讀取資料失敗';
    readonly createGroup: '建立群組失敗';
    readonly deleteGroup: '刪除群組失敗';
    readonly deleteFailed: '刪除失敗';
    readonly initData: '資料初始化失敗';
    readonly selectGroup: '請選擇群組';
    readonly invalidProjectData: '無效的專案資料';
    readonly createProject: '建立專案失敗';
    readonly deleteProject: '刪除專案失敗';
    readonly userNotLogged: '使用者未登入';
  };
  readonly page: {
    readonly admin: {
      readonly title: '管理儀表板';
      readonly description: '管理中心';
    };
    readonly adminForm: {
      readonly title: '表單儀表板';
      readonly description: '管理使用者提交的表單。';
    };
    readonly projects: {
      readonly title: '專案列表';
      readonly description: '查看可存取的專案。';
    };
    readonly manageGroups: {
      readonly title: '群組管理';
      readonly description: '管理您的組織群組。';
    };
    readonly notFound: {
      readonly title: '找不到頁面';
      readonly description: '這是 AI 平台的 404 頁面。';
      readonly message: '我們找不到您要瀏覽的頁面！';
      readonly back: '返回首頁';
    };
    readonly home: {
      readonly title: '儀表板';
      readonly description: '歡迎來到您的儀表板';
      readonly welcome: '歡迎使用 AI 平台';
      readonly subtitle: '在此管理您的專案、群組與 Pods。';
    };
  };
  readonly monitor: {
    readonly title: '即時監控';
    readonly panel: {
      readonly title: '即時監控';
      readonly subtitle: '即時日誌與狀態更新。';
    };
    readonly table: {
      readonly podName: 'Pod 名稱';
      readonly namespace: '命名空間';
      readonly status: '狀態';
      readonly actions: '動作';
      readonly kind: '類型';
      readonly name: '名稱';
      readonly details: '詳細資訊';
      readonly age: '存活時間';
      readonly images: '映像檔';
      readonly restarts: '重啟次數';
      readonly labels: '標籤';
    };
    readonly empty: {
      readonly noPods: '找不到 Pod。';
      readonly waitingForData: '等待叢集資料串流...';
    };
    readonly button: {
      readonly connect: '連線';
    };
    readonly agePrefix: '存在時間';
    readonly waiting: '等待叢集資料串流...';
    readonly websocketError: 'WebSocket 錯誤';
    readonly connected: '已連線';
    readonly disconnected: '已斷線';
  };
  readonly groups: {
    readonly title: '群組';
    readonly myGroups: '我的群組';
    readonly subtitle: '管理並加入群組。';
    readonly createNew: '建立新群組';
    readonly searchPlaceholder: '搜尋群組...';
    readonly name: '群組名稱';
    readonly description: '描述';
    readonly namePlaceholder: '輸入群組名稱...';
    readonly descriptionPlaceholder: '輸入描述...';
    readonly noDescription: '無描述';
    readonly creating: '正在建立群組...';
    readonly createButton: '建立群組';
    readonly error: {
      readonly userNotLogged: '使用者未登入';
      readonly userIdMissing: '缺少使用者 ID';
      readonly unknown: '未知錯誤';
      readonly loadFailed: '無法載入群組';
    };
    readonly noMatch: '找不到符合 "{term}" 的群組。';
    readonly page: {
      readonly title: '群組';
      readonly description: '在此管理您的群組。';
    };
    readonly infoTitle: '群組資訊';
    readonly inviteUser: '邀請使用者';
    readonly manageMembers: '管理';
    readonly membersList: '群組成員';
    readonly memberCount: '此群組中有 {count} 個成員。';
    readonly noMembers: '尚未邀請任何成員。';
    readonly notFound: '找不到群組。';
    readonly tab: {
      readonly overview: '概覽';
      readonly members: '成員';
      readonly info: '資訊';
    };
    readonly form: {
      readonly title: '建立群組';
      readonly nameRequired: '群組名稱為必填';
      readonly createFailed: '建立群組失敗';
      readonly creating: '建立中...';
      readonly cancel: '取消';
    };
    readonly list: {
      readonly title: '群組';
      readonly description: '瀏覽並管理群組。';
      readonly searchPlaceholder: '搜尋群組...';
      readonly loading: '載入群組中...';
      readonly deleteGroupAria: '刪除群組';
      readonly empty: {
        readonly filter: '沒有符合 "{term}" 的群組。';
        readonly noGroups: '找不到群組。';
        readonly filterTip: '請嘗試不同的搜尋詞。';
        readonly noGroupsTip: '建立一個新群組以開始使用。';
      };
    };
    readonly empty: {
      readonly title: '沒有群組';
      readonly description: '您尚未加入任何群組。';
    };
    readonly label: '群組名稱';
    readonly descriptionLabel: '描述';
  };
  readonly project: {
    readonly about: '關於專案';
    readonly name: '專案名稱';
    readonly description: '描述';
    readonly group: '群組';
    readonly noDescription: '無描述';
    readonly untitled: '無標題';
    readonly idLabel: '專案 ID: {id}';
    readonly requestSupport: '請求支援';
    readonly empty: '沒有可用的專案。';
    readonly groupId: '群組 ID';
    readonly gpuResources: 'GPU 資源';
    readonly gpuQuotaUnit: '{quota} GPU';
    readonly gpuAccessMode: '存取模式';
    readonly gpuAccessShared: '共享';
    readonly gpuAccessDedicated: '專用';
    readonly mpsSettings: 'MPS 設定';
    readonly mpsThreadLimit: '執行緒限制: {value}%';
    readonly mpsMemoryLimit: '記憶體限制: {value} MB';
    readonly mpsUnlimited: '無限制';
    readonly delete: '刪除專案: {name}';
    readonly list: {
      readonly title: '專案';
      readonly create: '新專案';
      readonly searchPlaceholder: '搜尋專案...';
      readonly loading: '載入專案中...';
      readonly errorPrefix: '錯誤：';
      readonly empty: {
        readonly filter: '沒有符合 "{term}" 的專案。';
        readonly noProjects: '找不到專案。';
      };
      readonly colProject: '專案';
      readonly colStatus: '狀態';
      readonly emptyFilter: '沒有符合 "{term}" 的專案。';
      readonly emptyAssigned: '您的群組未被指派任何專案。';
    };
    readonly create: {
      readonly title: '建立新專案';
      readonly error: '建立專案失敗';
      readonly name: '專案名稱';
      readonly namePlaceholder: '輸入唯一的專案名稱';
      readonly description: '描述';
      readonly descriptionPlaceholder: '輸入專案描述';
      readonly group: '群組';
      readonly groupPlaceholder: '選擇一個群組';
      readonly groupLabel: '群組';
      readonly gpuQuota: 'GPU 配額';
      readonly gpuQuotaPlaceholder: '例如：1';
      readonly gpuLabel: 'GPU 配額';
      readonly gpuThreadLimit: 'MPS 執行緒限制 (%)';
      readonly gpuThreadLimitPlaceholder: '例如：100';
      readonly gpuMemoryLimit: 'MPS 記憶體限制 (MB)';
      readonly gpuMemoryLimitPlaceholder: '例如：1024';
      readonly gpuAccessMode: 'GPU 存取模式';
      readonly gpuAccessShared: '共享 (MPS)';
      readonly gpuAccessDedicated: '專用';
      readonly mpsSettings: 'MPS 設定';
      readonly mpsThreadLimit: '執行緒限制';
      readonly mpsMemoryLimit: '記憶體限制';
      readonly noGroupsFound: '找不到群組。請先建立群組。';
      readonly selectedId: '已選群組 ID: {id}';
      readonly cancel: '取消';
      readonly submit: '建立專案';
      readonly creating: '建立中...';
    };
    readonly edit: {
      readonly title: '編輯專案';
    };
    readonly detail: {
      readonly overview: '概覽';
      readonly members: '成員';
      readonly settings: '設定';
      readonly needProjectId: '需要專案 ID';
      readonly fetchError: '無法讀取專案詳情';
      readonly createConfigError: '建立設定失敗';
      readonly updateConfigError: '更新設定失敗';
      readonly deleteConfigError: '刪除設定失敗';
      readonly instanceCreateSent: '實例建立請求已發送';
      readonly createInstanceError: '建立實例失敗';
      readonly confirmDeleteInstance: '您確定要刪除此實例嗎？';
      readonly instanceDeleteSent: '實例刪除請求已發送';
      readonly deleteInstanceError: '刪除實例失敗';
      readonly errorTitle: '錯誤';
      readonly notFoundTitle: '找不到專案';
      readonly notFoundMessage: '找不到 ID 為 {id} 的專案。';
      readonly titleSuffix: '專案詳情';
      readonly description: '管理專案 {name} 的設定、儲存與成員。';
      readonly tab: {
        readonly overview: '概覽';
        readonly configurations: '設定';
        readonly storage: '儲存';
        readonly members: '成員';
      };
      readonly infoLabel: '專案資訊';
      readonly createdAt: '建立時間';
      readonly updatedAt: '更新時間';
      readonly configTitle: '設定';
      readonly configDesc: '管理專案設定與部署。';
      readonly addConfig: '新增設定';
      readonly pvcTitle: '儲存 (PVC)';
      readonly pvcDesc: '管理專案持續性磁碟區宣告 (PVC)。';
    };
    readonly members: {
      readonly title: '成員';
      readonly description: '管理群組 {groupId} 的成員。';
      readonly searchPlaceholder: '搜尋成員...';
      readonly addMember: '新增成員';
    };
    readonly role: {
      readonly admin: '管理員';
      readonly manager: '經理';
      readonly user: '使用者';
    };
  };
  readonly storage: {
    readonly pageTitle: '雲端檔案管理員';
    readonly breadcrumb: '雲端檔案管理員';
    readonly pageSubtitle: '瀏覽並管理您的儲存磁碟區與專案磁碟。';
    readonly project: '專案';
    readonly starting: '正在啟動儲存瀏覽器...';
    readonly stopping: '正在停止儲存瀏覽器...';
    readonly actionFailed: '動作失敗。請重試。';
    readonly errLoadList: '無法載入儲存清單';
    readonly tab: {
      readonly personal: '個人中樞';
      readonly project: '專案儲存';
    };
    readonly readWrite: '讀寫';
    readonly readOnly: '唯讀';
    readonly online: '線上';
    readonly offline: '離線';
    readonly scanning: '掃描磁碟區中...';
    readonly action: {
      readonly start: '啟動磁碟';
      readonly stop: '停止磁碟';
      readonly open: '開啟瀏覽器';
    };
    readonly msg: {
      readonly starting: '正在啟動儲存瀏覽器...';
      readonly stopping: '正在停止儲存瀏覽器...';
      readonly actionFailed: '動作失敗。請重試。';
      readonly loadFailed: '無法載入儲存清單。';
    };
    readonly personal: {
      readonly title: '個人儲存中樞';
      readonly description: '透過安全登入存取您的私人儲存空間。';
      readonly noStorageTitle: '儲存空間未初始化';
      readonly noStorageDesc: '您的個人儲存空間尚未佈建。';
      readonly contactAdmin: '請聯繫管理員初始化您的儲存空間。';
    };
    readonly colProject: '專案';
    readonly colStatus: '狀態';
    readonly emptyFilter: '沒有符合 "{term}" 的專案。';
    readonly emptyAssigned: '您的群組未被指派任何專案。';
  };
  readonly form: {
    readonly title: '提交表單';
    readonly status: {
      readonly pending: '待審核';
      readonly approved: '已核准';
      readonly rejected: '已駁回';
      readonly processing: '處理中';
      readonly completed: '已完成';
    };
    readonly action: {
      readonly process: '處理';
      readonly reject: '駁回';
      readonly complete: '完成';
    };
    readonly label: {
      readonly title: '標題';
      readonly description: '描述';
      readonly project: '專案';
    };
    readonly select: {
      readonly none: '無';
    };
    readonly error: {
      readonly titleRequired: '標題為必填項';
      readonly submitFailed: '提交失敗';
    };
    readonly success: {
      readonly submitted: '提交成功，管理員將儘快審核。';
    };
    readonly createFailed: '建立表單失敗';
    readonly created: '表單建立成功！';
    readonly field: {
      readonly title: '標題';
      readonly description: '描述';
    };
    readonly exampleTitle: '範例標題';
    readonly placeholder: {
      readonly title: '輸入標題...';
      readonly description: {
        readonly base: '輸入描述...';
        readonly long: '輸入詳細描述...';
      };
    };
    readonly projectId: '專案 ID: {id}';
    readonly cancel: '取消';
    readonly submitting: '提交中...';
    readonly submit: '送出';
    readonly history: {
      readonly title: '歷史紀錄';
      readonly empty: '無歷史紀錄。';
      readonly loading: '載入歷史紀錄中...';
    };
    readonly apply: {
      readonly title: '申請';
    };
    readonly page: {
      readonly title: '表單頁面';
      readonly description: '提交並管理您的表單。';
    };
  };
  readonly table: {
    readonly id: 'ID';
    readonly user: '使用者';
    readonly project: '專案';
    readonly titleDesc: '標題 / 描述';
    readonly status: '狀態';
    readonly actions: '動作';
    readonly role: '角色';
  };
  readonly configFile: {
    readonly editFile: '編輯檔案';
    readonly destroyInstance: '銷毀實例';
    readonly deleteFile: '刪除檔案';
    readonly notFoundTitle: '未找到設定檔';
    readonly notFoundDesc: '按一下「新增設定」開始使用。';
    readonly toggleResources: '切換資源';
    readonly id: 'ID';
    readonly createdAt: '建立時間';
    readonly deployInstance: '部署實例';
    readonly deploy: '部署';
    readonly relatedResources: '相關資源';
    readonly noRelatedResources: '沒有相關資源';
    readonly notDeployed: '此設定檔尚未部署。';
  };
  readonly config: {
    readonly error: {
      readonly filenameRequired: '檔案名稱為必填';
      readonly filenameSuffix: '檔案名稱必須以 .yaml 或 .yml 結尾';
      readonly yamlEmpty: 'YAML 內容不得為空';
    };
    readonly createTitle: '建立新設定';
    readonly createSubtitle: '使用精靈模式或直接編輯 YAML。';
    readonly tab: {
      readonly wizard: '精靈模式';
      readonly yaml: '原始 YAML';
    };
    readonly filename: {
      readonly label: '設定檔名稱';
      readonly prefix: '檔名:';
      readonly note: '必須是唯一的且以 .yaml 或 .yml 結尾';
    };
    readonly wizard: {
      readonly imageLabel: '容器映像檔 (Image)';
      readonly imageNote: '指定要使用的映像檔。';
      readonly gpuLabel: 'GPU 配額';
      readonly pvcLabel: 'PVC';
    };
    readonly pvc: {
      readonly placeholder: '選擇 PVC...';
      readonly loading: '載入 PVC 中...';
      readonly note: '選擇用於儲存的 PVC。';
    };
    readonly mountPath: '掛載路徑 (Mount Path)';
    readonly commandLabel: '指令 (Command)';
    readonly argsLabel: '參數 (Arguments)';
    readonly yamlContentLabel: 'YAML 內容';
    readonly creating: '建立中...';
    readonly createButton: '建立設定';
  };
  readonly admin: {
    readonly dashboard: '儀表板';
    readonly storage: {
      readonly title: '儲存管理';
      readonly userStorage: {
        readonly successInit: '儲存空間初始化成功';
        readonly confirmDelete: '您確定要刪除此儲存空間嗎？';
        readonly successDelete: '儲存空間已成功刪除';
        readonly successExpand: '儲存空間已成功擴充';
        readonly targetUser: '目標使用者';
        readonly username: '使用者名稱';
        readonly usernamePlaceholder: '輸入使用者名稱';
        readonly checkStatus: '檢查狀態';
        readonly statusExists: '儲存空間存在';
        readonly statusMissing: '找不到儲存空間';
        readonly lifecycleTitle: '儲存空間生命週期';
        readonly hintUnknown: '狀態未知';
        readonly hintMissing: '未找到儲存空間';
        readonly hintExists: '儲存空間作用中';
        readonly processing: '處理中...';
        readonly initBtn: '初始化儲存';
        readonly deleteBtn: '刪除中樞';
        readonly checkStatusFirst: '先檢查狀態';
        readonly expandTitle: '擴充儲存';
        readonly newSize: '新大小 (GB)';
        readonly newSizePlaceholder: '例如：50';
        readonly expandBtn: '擴充儲存';
      };
      readonly projectStorage: {
        readonly projectPlaceholder: '選擇專案...';
        readonly createSuccess: '專案儲存建立成功';
        readonly createGuideTitle: '建立專案儲存';
        readonly createGuideDesc: '為專案儲存建立新 PVC。';
        readonly form: {
          readonly project: '專案';
          readonly capacity: '容量';
          readonly capacityHint: '例如：10Gi';
        };
        readonly createSubmit: '建立儲存';
        readonly actionExpandPrompt: '擴充儲存容量';
        readonly actionConfirmDelete: '您確定要刪除此儲存空間嗎？';
        readonly list: {
          readonly project: '專案';
          readonly status: '狀態';
          readonly capacity: '容量';
          readonly age: '存活時間';
          readonly actions: '動作';
          readonly empty: '未找到專案儲存。';
        };
        readonly actionEdit: '編輯';
        readonly actionDelete: '刪除';
        readonly tabList: '清單';
        readonly tabCreate: '建立';
        readonly errorSelectProject: '請選擇一個專案';
      };
      readonly pvc: {
        readonly title: 'PVC 管理';
        readonly createTitle: '建立新 PVC';
        readonly expandTitle: '擴充 PVC';
        readonly sizeLabel: '大小 (Gi)';
      };
      readonly forms: '表單';
    };
    readonly storageManagement: {
      readonly title: '儲存管理';
      readonly userTab: '使用者中樞';
      readonly projectTab: '專案 PVC';
      readonly initUser: '初始化儲存';
      readonly deleteUser: '刪除中樞';
      readonly expandUser: '擴充容量';
      readonly hintExists: '儲存空間作用中 (Ready)。';
      readonly hintMissing: '未找到儲存空間。';
      readonly confirmDelete: '您確定要「永久」刪除此儲存空間嗎？';
    };
  };
  readonly auth: {
    readonly login: {
      readonly title: '登入';
      readonly subtitle: '輸入您的使用者名稱和密碼以登入！';
      readonly username: '使用者名稱';
      readonly usernamePlaceholder: '輸入您的使用者名稱';
      readonly password: '密碼';
      readonly passwordPlaceholder: '輸入您的密碼';
      readonly forgotPassword: '忘記密碼？';
      readonly submit: '登入';
      readonly noAccount: '還沒有帳號？';
      readonly signUp: '註冊';
      readonly backToDashboard: '返回儀表板';
      readonly loginFailed: '登入失敗，請重試。';
      readonly pageTitle: '登入 | AI 平台';
      readonly pageDescription: '這是 AI 平台的登入頁面';
    };
    readonly signOut: '登出';
    readonly signIn: '登入';
  };
  readonly user: {
    readonly profile: '個人檔案';
    readonly signOut: '登出';
    readonly login: '登入';
    readonly editProfile: '編輯個人檔案';
    readonly support: '支援';
  };
  readonly role: {
    readonly admin: '管理員';
    readonly adminDesc: '對所有資源和設定擁有完整存取權限。';
    readonly manager: '經理';
    readonly managerDesc: '可以管理專案、群組和成員。';
    readonly user: '使用者';
    readonly userDesc: '可以存取和使用指派的專案。';
    readonly label: '角色: {role}';
  };
  readonly members: {
    readonly noneFound: '找不到成員。';
    readonly noMatch: '沒有符合搜尋條件的成員。';
  };
  readonly language: {
    readonly aria: '語言選擇器';
    readonly switchToEn: '切換至英文';
    readonly switchToZh: '切換至中文';
    readonly short: '中';
    readonly switchLabel: '切換語言';
  };
  readonly notification: {
    readonly title: '通知';
    readonly requestChange: '請求變更';
    readonly project: '專案';
    readonly viewAll: '查看全部';
    readonly time: {
      readonly '5min': '5 分鐘前';
      readonly '8min': '8 分鐘前';
      readonly '15min': '15 分鐘前';
      readonly '1hour': '1 小時前';
    };
  };
  readonly invite: {
    readonly selectUserError: '請選擇要邀請的使用者';
    readonly unknownError: '邀請使用者時發生未知錯誤';
    readonly title: '邀請使用者';
    readonly description: '邀請使用者加入專案或群組';
    readonly userLabel: '使用者';
    readonly userSearchPlaceholder: '搜尋使用者...';
    readonly noResults: '找不到使用者';
  };
  readonly pagination: {
    readonly prev: '上一頁';
    readonly next: '下一頁';
    readonly pageOf: '第 {current} 頁，共 {total} 頁';
  };
  readonly view: {
    readonly toggleToAdmin: '切換至管理員';
    readonly toggleToUser: '切換至使用者';
    readonly grid: '網格檢視';
    readonly list: '列表檢視';
  };
  readonly search: {
    readonly projectsPlaceholder: '搜尋專案...';
    readonly placeholder: '搜尋...';
  };
  readonly loading: {
    readonly forms: '載入表單中...';
  };
  readonly button: {
    readonly newGroup: '新群組';
    readonly newProject: '新專案';
  };
  readonly terminal: {
    readonly connected: '已連線';
    readonly websocketError: 'WebSocket 錯誤';
    readonly disconnected: '已斷線';
  };
  readonly badge: {
    readonly new: '新';
    readonly pro: '專業版';
  };
};
export default zh;
export type Dictionary = typeof zh;
export type TranslationSchema<T> = {
  -readonly [K in keyof T]: T[K] extends string ? string : TranslationSchema<T[K]>;
};
//# sourceMappingURL=zh.d.ts.map
