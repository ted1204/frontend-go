import { PageMeta } from '@nthucscc/components-shared';
import AuthLayout from './AuthPageLayout';
import SignUpForm from '@nthucscc/components-shared/auth/SignUpForm';

export default function SignUp() {
  return (
    <>
      <PageMeta title="註冊 | AI 平台" description="這是 AI 平台的註冊頁面" />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
