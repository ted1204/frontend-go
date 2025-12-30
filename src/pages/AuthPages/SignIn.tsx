import { PageMeta } from '@nthucscc/ui';
import { useTranslation } from '@nthucscc/utils';
import AuthLayout from './AuthPageLayout';
import SignInForm from '../../components/auth/SignInForm';

export default function SignIn() {
  const { t } = useTranslation();
  return (
    <>
      <PageMeta title={t('auth.login.pageTitle')} description={t('auth.login.pageDescription')} />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
