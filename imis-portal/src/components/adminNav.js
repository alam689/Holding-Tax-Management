// Sidebar tree — mirrors the section order of the IMIS Web App user manual.
import { MODULES, MODULE_GROUPS } from '../data/modules'

const modulesOf = (group) => MODULES
  .filter((m) => m.group === group)
  .map((m) => ({ to: m.path, en: m.title.en, bn: m.title.bn }))

export const ADMIN_NAV = [
  { to: '/admin', icon: '▦', end: true, perm: 'dashboard', en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  {
    icon: MODULE_GROUPS.building.icon, perm: 'dashboard',
    en: MODULE_GROUPS.building.en, bn: MODULE_GROUPS.building.bn,
    children: modulesOf('building'),
  },
  {
    icon: MODULE_GROUPS.utility.icon, perm: 'dashboard',
    en: MODULE_GROUPS.utility.en, bn: MODULE_GROUPS.utility.bn,
    children: modulesOf('utility'),
  },
  {
    icon: MODULE_GROUPS.fsm.icon, perm: 'dashboard',
    en: MODULE_GROUPS.fsm.en, bn: MODULE_GROUPS.fsm.bn,
    children: modulesOf('fsm'),
  },
  { to: '/admin/data-export', icon: '⬇', perm: 'dashboard', en: 'Data Export', bn: 'ডেটা রপ্তানি' },
  { to: '/admin/data-import', icon: '⬆', perm: 'dashboard', en: 'Data Import', bn: 'ডেটা আমদানি' },
  {
    icon: '⚙', perm: 'dashboard', en: 'Settings', bn: 'সেটিংস',
    children: [
      { to: '/admin/settings/users', en: 'Users', bn: 'ইউজার', perm: 'users' },
      { to: '/admin/settings/roles', en: 'Roles', bn: 'ভূমিকা', perm: 'users' },
      { to: '/admin/settings/permissions', en: 'Permissions', bn: 'অনুমতি', perm: 'users' },
      { to: '/admin/profile', en: 'My Profile', bn: 'আমার প্রোফাইল' },
    ],
  },
  { to: '/admin/map', icon: '🗺️', perm: 'dashboard', en: 'View Map', bn: 'মানচিত্র' },
]
