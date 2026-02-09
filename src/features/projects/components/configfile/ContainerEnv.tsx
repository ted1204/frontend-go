import EnvVarManager from './EnvVarManager';
import type { EnvVar } from '@/pkg/types/configFile';

type Props = {
  env: EnvVar[];
  onChange: (next: EnvVar[]) => void;
};

export default function ContainerEnv({ env, onChange }: Props) {
  return <EnvVarManager envVars={env} onChange={onChange} />;
}
