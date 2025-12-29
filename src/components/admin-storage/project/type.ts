export interface ProjectPVC {
  id: string;
  projectName: string;
  namespace: string;
  capacity: string;
  status: 'Bound' | 'Pending' | 'Lost';
  accessMode: string;
  age: string;
}