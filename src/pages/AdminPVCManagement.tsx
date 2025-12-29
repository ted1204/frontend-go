import React, { useState } from 'react';
import PVCList from '../components/admin-pvc/PVCList';
import PVCCreate from '../components/admin-pvc/PVCCreate';
import PVCExpand from '../components/admin-pvc/PVCExpand';
import PVCDelete from '../components/admin-pvc/PVCDelete';

const AdminPVCManagement: React.FC = () => {
  const [tab, setTab] = useState<'list' | 'create' | 'expand' | 'delete'>('list');

  return (
    <div className="admin-pvc-management">
      <h1>PVC Management</h1>
      <div className="tab-bar">
        <button onClick={() => setTab('list')} className={tab === 'list' ? 'active' : ''}>
          List PVCs
        </button>
        <button onClick={() => setTab('create')} className={tab === 'create' ? 'active' : ''}>
          Create PVC
        </button>
        <button onClick={() => setTab('expand')} className={tab === 'expand' ? 'active' : ''}>
          Expand PVC
        </button>
        <button onClick={() => setTab('delete')} className={tab === 'delete' ? 'active' : ''}>
          Delete PVC
        </button>
      </div>
      <div className="tab-content">
        {tab === 'list' && <PVCList />}
        {tab === 'create' && <PVCCreate />}
        {tab === 'expand' && <PVCExpand />}
        {tab === 'delete' && <PVCDelete />}
      </div>
    </div>
  );
};

export default AdminPVCManagement;
