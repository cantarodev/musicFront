import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import LoginPage from 'src/pages/auth/login';

const Page = () => {
  usePageView();

  return (
    <>
      <Seo />
      <main>
        <LoginPage />
      </main>
    </>
  );
};

export default Page;
