import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="儀表板 | AI 平台"
        description="AI 平台儀表板"
      />
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            歡迎來到 AI 平台
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            在這裡管理您的專案、群組和 Pod。
          </p>
        </div>
      </div>
    </>
  );
}
