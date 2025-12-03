import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="登入 | AI 平台"
        description="這是 AI 平台的登入頁面"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
