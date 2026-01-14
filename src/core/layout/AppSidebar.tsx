import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useTranslation, LocaleKey } from '@nthucscc/utils';
import { BoxIcon, ChevronDownIcon, GridIcon, GroupIcon, TaskIcon } from '../../shared/icons';
import { useSidebar } from '../context/useSidebar';

// --- Types ---
type NavItem = {
  name: LocaleKey;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: LocaleKey; path: string; pro?: boolean; new?: boolean }[];
};

// --- Navigation Data ---
const navItems: NavItem[] = [
  { icon: <TaskIcon />, name: 'sidebar.projects', path: '/projects' },
  { icon: <TaskIcon />, name: 'sidebar.jobs', path: '/jobs' },
  { icon: <GroupIcon />, name: 'sidebar.groups', path: '/groups' },
  { icon: <BoxIcon />, name: 'sidebar.pods', path: '/pod-tables' },
  { icon: <TaskIcon />, name: 'sidebar.fileBrowser', path: '/file-browser' },
  // {
  //   icon: <GridIcon />,
  //   name: 'sidebar.dashboard',
  //   subItems: [{ name: 'sidebar.ecommerce', path: '/', pro: false }],
  // },
  { icon: <BoxIcon />, name: 'sidebar.forms', path: '/my-forms' },
];

const adminItems: NavItem[] = [
  { icon: <GridIcon />, name: 'admin.dashboard', path: '/admin' },
  { icon: <TaskIcon />, name: 'page.admin.manageProjects', path: '/admin/manage-projects' },
  { icon: <GridIcon />, name: 'page.admin.auditLogs.title', path: '/admin/audit-logs' },
  { icon: <GroupIcon />, name: 'page.admin.manageGroups', path: '/admin/manage-groups' },
  { icon: <BoxIcon />, name: 'page.admin.forms', path: '/admin/forms' },
  { icon: <BoxIcon />, name: 'admin.storageManagement.title', path: '/admin/storage-management' },
  { icon: <BoxIcon />, name: 'sidebar.manageImages', path: '/admin/manage-images' },
  { icon: <BoxIcon />, name: 'sidebar.imageRequests', path: '/admin/image-requests' },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  // --- State ---
  const [openSubmenu, setOpenSubmenu] = useState<{ type: 'main' | 'admin'; index: number } | null>(
    null,
  );
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [viewMode, setViewMode] = useState<'user' | 'admin'>(() => {
    const stored = localStorage.getItem('viewMode');
    return stored === 'admin' ? 'admin' : 'user';
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const hasManuallySwitchedToUser = useRef(false);

  // --- Theme Configuration ---
  const themeConfig = {
    // User Mode: Standard Brand Blue (Unchanged)
    user: {
      sidebarBg: 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800',
      itemActive: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-100',
      itemHover: 'hover:bg-gray-50 text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800/50',
      iconActive: 'text-blue-600 dark:text-blue-400',
      iconInactive:
        'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300',
      logoText: 'text-gray-900 dark:text-white',
      badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      adminTag:
        'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800',
      sectionTitle: 'text-gray-400',
      toggleButton:
        'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300',
    },

    // Admin Mode: Custom Pastel/Muted Blue-Purple Theme (#7D84B2, #8E9DCC)
    admin: {
      // Sidebar: Very faint cool white in light mode, Deep Navy in dark mode
      sidebarBg: 'bg-[#FDFDFE] border-[#8E9DCC]/40 dark:bg-[#0B1121] dark:border-[#7D84B2]/30',

      // Active Item: Uses #8E9DCC with low opacity for BG, #7D84B2 for text
      itemActive: 'bg-[#8E9DCC]/20 text-[#7D84B2] dark:bg-[#7D84B2]/20 dark:text-[#8E9DCC]',

      // Hover Item: Very subtle #8E9DCC tint
      itemHover:
        'hover:bg-[#8E9DCC]/10 text-slate-600 dark:text-slate-400 dark:hover:bg-[#7D84B2]/10',

      // Icon Colors: Primary accent #7D84B2
      iconActive: 'text-[#7D84B2] dark:text-[#8E9DCC]',
      iconInactive:
        'text-slate-400 group-hover:text-[#7D84B2] dark:text-slate-500 dark:group-hover:text-[#8E9DCC]',

      // Branding text
      logoText: 'text-[#7D84B2] dark:text-[#8E9DCC]',

      // Badges and Tags
      badgeBg: 'bg-[#8E9DCC]/20 text-[#7D84B2] dark:bg-[#7D84B2]/20 dark:text-[#8E9DCC]',
      adminTag:
        'bg-[#8E9DCC]/10 text-[#7D84B2] border border-[#8E9DCC]/40 dark:border-[#7D84B2]/50 dark:text-[#8E9DCC]',

      // Section Titles
      sectionTitle: 'text-[#8E9DCC] dark:text-[#7D84B2]',

      // Switch Button
      toggleButton:
        'bg-white border-[#8E9DCC]/40 text-[#7D84B2] hover:bg-[#8E9DCC]/10 dark:bg-[#151e32] dark:border-[#7D84B2]/40 dark:text-[#8E9DCC]',
    },
  };

  const currentTheme = themeConfig[viewMode];

  // --- Effects ---
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      const roleValue = (
        parsedData.role ||
        parsedData.Role ||
        (Array.isArray(parsedData.roles) ? parsedData.roles[0] : '')
      )
        .toString()
        .toLowerCase();
      const isSuperAdmin = parsedData.is_super_admin === true;
      const isAdminLike = isSuperAdmin || roleValue === 'admin' || roleValue === 'manager';

      setIsAdmin(isAdminLike);

      if (
        isAdminLike &&
        window.location.pathname.startsWith('/admin') &&
        localStorage.getItem('viewMode') === null &&
        !hasManuallySwitchedToUser.current
      ) {
        setViewMode('admin');
      }
    }
  }, []);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'admin') => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  // --- Render Helpers ---
  const renderMenuItems = (items: NavItem[], menuType: 'main' | 'admin') => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => {
        const isMenuOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        const active = nav.path ? isActive(nav.path) : isMenuOpen;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              // Parent Item with Submenu
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`group flex items-center w-full rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200
                  ${active ? currentTheme.itemActive : currentTheme.itemHover}
                  ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'}
                `}
              >
                {/* Icon Wrapper: 24px Size */}
                <span
                  className={`shrink-0 transition-colors duration-200 [&>svg]:w-6 [&>svg]:h-6 
                    ${active ? currentTheme.iconActive : currentTheme.iconInactive}`}
                >
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="ml-3 flex-1 text-left whitespace-nowrap">{t(nav.name)}</span>
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isMenuOpen ? `rotate-180 ${currentTheme.iconActive}` : 'text-gray-400'
                      }`}
                    />
                  </>
                )}
              </button>
            ) : (
              // Standard Link Item
              nav.path && (
                <Link
                  to={nav.path}
                  className={`group flex items-center w-full rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200
                    ${active ? currentTheme.itemActive : currentTheme.itemHover}
                    ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'}
                  `}
                >
                  <span
                    className={`shrink-0 transition-colors duration-200 [&>svg]:w-6 [&>svg]:h-6
                      ${active ? currentTheme.iconActive : currentTheme.iconInactive}`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="ml-3 whitespace-nowrap">{t(nav.name)}</span>
                  )}
                </Link>
              )
            )}

            {/* Dropdown Content */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  height: isMenuOpen ? `${subMenuHeight[`${menuType}-${index}`]}px` : '0px',
                }}
              >
                <ul className="mt-1 space-y-1 pl-10 pr-2">
                  {nav.subItems.map((subItem) => {
                    const isSubActive = isActive(subItem.path);
                    return (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
                            ${
                              isSubActive
                                ? currentTheme.itemActive
                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                            }
                          `}
                        >
                          <span className="truncate">{t(subItem.name)}</span>

                          {/* Badges */}
                          <div className="ml-auto flex items-center gap-1.5">
                            {subItem.new && (
                              <span
                                className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${currentTheme.badgeBg}`}
                              >
                                {t('badge.new')}
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r transition-all duration-300 ease-in-out mt-16 lg:mt-0
        ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        ${currentTheme.sidebarBg}
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- Branding / Logo --- */}
      <div
        className={`flex h-20 items-center ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start px-8'}`}
      >
        <Link to="/">
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ width: isExpanded || isHovered || isMobileOpen ? 'auto' : '2ch' }}
          >
            <span
              className={`text-xl font-bold whitespace-nowrap transition-colors ${currentTheme.logoText}`}
            >
              {t('brand.name')}
              {viewMode === 'admin' && (isExpanded || isHovered || isMobileOpen) && (
                <span
                  className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${currentTheme.adminTag}`}
                >
                  Admin
                </span>
              )}
            </span>
          </div>
        </Link>
      </div>

      {/* --- Menu Links --- */}
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar pb-4">
        <nav className="flex-1 space-y-6 px-3">
          {viewMode === 'user' && (
            <div>
              <div
                className={`mb-3 px-3 text-xs font-bold uppercase tracking-wider ${currentTheme.sectionTitle} ${!isExpanded && !isHovered ? 'lg:hidden' : ''}`}
              >
                {t('sidebar.menu')}
              </div>
              {renderMenuItems(navItems, 'main')}
            </div>
          )}

          {isAdmin && viewMode === 'admin' && (
            <div>
              <div
                className={`mb-3 px-3 text-xs font-bold uppercase tracking-wider ${currentTheme.sectionTitle} ${!isExpanded && !isHovered ? 'lg:hidden' : ''}`}
              >
                {t('sidebar.admin')}
              </div>
              {renderMenuItems(adminItems, 'admin')}
            </div>
          )}
        </nav>

        {/* --- View Mode Switcher --- */}
        {isAdmin && (isExpanded || isHovered || isMobileOpen) && (
          <div className="mt-auto px-5 pt-4">
            <button
              onClick={() => {
                if (viewMode === 'user') {
                  setViewMode('admin');
                  localStorage.setItem('viewMode', 'admin');
                } else {
                  if (location.pathname.startsWith('/admin')) {
                    hasManuallySwitchedToUser.current = true;
                    localStorage.removeItem('viewMode');
                    setViewMode('user');
                    navigate('/projects');
                  } else {
                    setViewMode('user');
                  }
                }
              }}
              className={`flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 shadow-sm
                ${currentTheme.toggleButton}
              `}
            >
              {viewMode === 'user' ? (
                <>
                  <GridIcon className="h-5 w-5" />
                  <span>{t('view.toggleToAdmin')}</span>
                </>
              ) : (
                <>
                  <GroupIcon className="h-5 w-5" />
                  <span>{t('view.toggleToUser')}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
