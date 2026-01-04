/**
 * Authentication and User-related translations
 */
export const auth = {
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
  user: {
    profile: '個人檔案',
    signOut: '登出',
    login: '登入',
    editProfile: '編輯個人檔案',
    support: '支援',
  },
} as const;
