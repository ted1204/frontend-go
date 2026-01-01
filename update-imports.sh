#!/bin/bash
# Script to update import paths after restructuring

echo "Updating import paths..."

# Update imports from '../components/' to feature-based paths
find src/features -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  # Update common component imports
  sed -i '' "s|from '../components/common/|from '@/shared/components/common/|g" "$file"
  sed -i '' "s|from '../../components/common/|from '@/shared/components/common/|g" "$file"
  sed -i '' "s|from '../../../components/common/|from '@/shared/components/common/|g" "$file"
  
  # Update layout imports
  sed -i '' "s|from '../layout/|from '@/core/layout/|g" "$file"
  sed -i '' "s|from '../../layout/|from '@/core/layout/|g" "$file"
  
  # Update services imports
  sed -i '' "s|from '../services/|from '@/core/services/|g" "$file"
  sed -i '' "s|from '../../services/|from '@/core/services/|g" "$file"
  sed -i '' "s|from '../../../services/|from '@/core/services/|g" "$file"
  
  # Update interfaces imports
  sed -i '' "s|from '../interfaces/|from '@/core/interfaces/|g" "$file"
  sed -i '' "s|from '../../interfaces/|from '@/core/interfaces/|g" "$file"
  sed -i '' "s|from '../../../interfaces/|from '@/core/interfaces/|g" "$file"
  
  # Update context imports
  sed -i '' "s|from '../context/|from '@/core/context/|g" "$file"
  sed -i '' "s|from '../../context/|from '@/core/context/|g" "$file"
  sed -i '' "s|from '../../../context/|from '@/core/context/|g" "$file"
  
  # Update utils imports
  sed -i '' "s|from '../utils/|from '@/shared/utils/|g" "$file"
  sed -i '' "s|from '../../utils/|from '@/shared/utils/|g" "$file"
  
  # Update config imports
  sed -i '' "s|from '../config/|from '@/core/config/|g" "$file"
  sed -i '' "s|from '../../config/|from '@/core/config/|g" "$file"
done

echo "Import paths updated!"
