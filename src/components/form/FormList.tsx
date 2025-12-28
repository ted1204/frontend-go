import React from 'react';
import { Form } from '../../interfaces/form';
import FormCard from './FormCard';
import { useTranslation } from '@tailadmin/utils';

interface FormListProps {
  viewMode: 'grid' | 'list';
  currentForms: Form[];
  statusText: (s?: string) => string;
}

const FormList: React.FC<FormListProps> = ({ viewMode, currentForms, statusText }) => {
  const { t } = useTranslation();

  if (currentForms.length === 0) {
    return <div className="py-8 text-center text-gray-400">{t('form.history.empty')}</div>;
  }

  return viewMode === 'grid' ? (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {currentForms.map((f) => (
        <FormCard key={f.ID} form={f} statusText={statusText} t={t} />
      ))}
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
          <tr>
            <th className="px-4 py-2">{t('form.label.title')}</th>
            <th className="px-4 py-2">{t('form.label.description')}</th>
            <th className="px-4 py-2">{t('form.label.project')}</th>
            <th className="px-4 py-2">{t('table.status')}</th>
            <th className="px-4 py-2">{t('createdAt')}</th>
          </tr>
        </thead>
        <tbody>
          {currentForms.map((f) => (
            <tr key={f.ID} className="border-t">
              <td className="px-4 py-2 font-medium text-gray-800 dark:text-white">{f.title}</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{f.description}</td>
              <td className="px-4 py-2">{f.project?.ProjectName || '-'}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${f.status === 'Completed' ? 'bg-green-100 text-green-800' : f.status === 'Rejected' ? 'bg-red-100 text-red-800' : f.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'} dark:bg-opacity-20`}
                >
                  {statusText(f.status) || f.status}
                </span>
              </td>
              <td className="px-4 py-2">{new Date(f.CreatedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormList;
