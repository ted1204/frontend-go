import PageMeta from '../../components/common/PageMeta';
import AuthLayout from './AuthPageLayout';
import SignUpForm from '../../components/auth/SignUpForm';

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
