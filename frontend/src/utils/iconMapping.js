// Icon mapping from lucide-react to @heroicons/react
// This helps with the migration to reduce bundle size

export const iconMapping = {
  // Common icons
  'Trash2': 'TrashIcon',
  'Eye': 'EyeIcon',
  'Download': 'ArrowDownTrayIcon',
  'CheckCircle': 'CheckCircleIcon',
  'Loader2': 'ArrowPathIcon',
  'Sparkles': 'SparklesIcon',
  'AlertCircle': 'ExclamationCircleIcon',
  'Wand2': 'WandMagicSparklesIcon',
  'FolderOpen': 'FolderIcon',
  'Zap': 'BoltIcon',
  'Palette': 'SwatchIcon',
  'Shield': 'ShieldCheckIcon',
  'X': 'XMarkIcon',
  'Copy': 'DocumentDuplicateIcon',
  'Settings': 'Cog6ToothIcon',
  'EyeOff': 'EyeSlashIcon',
  'Wifi': 'SignalIcon',
  'TestTube': 'BeakerIcon',
  'RefreshCw': 'ArrowPathIcon',
  'AlertTriangle': 'ExclamationTriangleIcon',
  'Lightbulb': 'LightBulbIcon',
  'Wallet': 'WalletIcon',
  'LogOut': 'ArrowRightOnRectangleIcon',
  'ExternalLink': 'ArrowTopRightOnSquareIcon',
  'ArrowRight': 'ArrowRightIcon',
  'FileText': 'DocumentTextIcon',
  'Share2': 'ShareIcon',
  'Plus': 'PlusIcon',
  'Image': 'PhotoIcon'
};

// Helper function to get the correct icon component
export const getIconComponent = (lucideIconName) => {
  return iconMapping[lucideIconName] || lucideIconName;
};
