/**
 * Pages translations (Home, Admin, Projects, Groups, etc.)
 */
export const pages = {
  page: {
    home: {
      title: '儀表板',
      description: '歡迎來到您的儀表板',
      welcome: '歡迎使用 AI 平台',
      subtitle: '在此管理您的專案、群組與 Pods。',
    },
    admin: {
      title: '管理儀表板',
      description: '管理中心',
      manageProjects: '專案管理',
      manageGroups: '群組管理',
      forms: '表單管理',
      auditLogs: {
        title: '審計日誌',
        subtitle: '系統安全與變更追蹤',
        description: '系統安全與變更追蹤',
        breadcrumb: '審計日誌',
        heading: '系統軌跡',
        subHeading: '監控並分析管理操作與資源變更。',
        count: '顯示最近 {{count}} 筆記錄',
        emptyTitle: '未找到日誌',
        emptyDesc: '請調整篩選條件以查看更多結果。',
      },
    },
    projects: {
      title: '專案列表',
      description: '查看可存取的專案。',
    },
    manageGroups: {
      title: '群組管理',
      description: '管理您的組織群組。',
    },
    adminForm: {
      title: '表單儀表板',
      description: '管理使用者提交的表單。',
    },
    notFound: {
      title: '找不到頁面',
      description: '這是 AI 平台的 404 頁面。',
      message: '我們找不到您要瀏覽的頁面！',
      back: '返回首頁',
    },
  },
} as const;
