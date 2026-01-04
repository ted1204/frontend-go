/**
 * Authentication and User-related translations
 */
export const auth = {
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
  user: {
    profile: 'Profile',
    signOut: 'Sign out',
    login: 'Login',
    editProfile: 'Edit Profile',
    support: 'Support',
  },
} as const;
