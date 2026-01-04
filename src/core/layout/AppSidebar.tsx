import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useTranslation, LocaleKey } from '@nthucscc/utils';
import {
  BoxIcon,
  ChevronDownIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  TaskIcon,
} from '../../shared/icons';
import { useSidebar } from '../context/useSidebar';
type NavItem = {
  name: LocaleKey;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: LocaleKey; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <TaskIcon />,
    name: 'sidebar.projects',
    path: '/projects',
  },
  {
    icon: <TaskIcon />,
    name: 'sidebar.jobs',
    path: '/jobs',
  },
  {
    icon: <GroupIcon />,
    name: 'sidebar.groups',
    path: '/groups',
  },
  {
    icon: <BoxIcon />,
    name: 'sidebar.pods',
    path: '/pod-tables',
  },
  {
    icon: <TaskIcon />,
    name: 'sidebar.fileBrowser',
    path: '/file-browser',
  },
  {
    icon: <GridIcon />,
    name: 'sidebar.dashboard',
    subItems: [{ name: 'sidebar.ecommerce', path: '/', pro: false }],
  },
  {
    icon: <BoxIcon />,
    name: 'sidebar.forms',
    path: '/my-forms',
  },
];

const adminItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: 'admin.dashboard',
    path: '/admin',
  },
  {
    icon: <TaskIcon />, // Use TaskIcon for Manage Projects
    name: 'page.admin.manageProjects',
    path: '/admin/manage-projects',
  },
  {
    icon: <GridIcon />, // Audit logs
    name: 'page.admin.auditLogs.title',
    path: '/admin/audit-logs',
  },
  {
    icon: <GroupIcon />, // Use GroupIcon for Manage Groups
    name: 'page.admin.manageGroups',
    path: '/admin/manage-groups',
  },
  {
    icon: <BoxIcon />,
    name: 'page.admin.forms',
    path: '/admin/forms',
  },
  {
    icon: <BoxIcon />, // You can replace with a storage icon if available
    name: 'admin.storageManagement.title',
    path: '/admin/storage-management',
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Checks if the given path is active (matches current location)
  const isActive = (path: string) => location.pathname === path;

  // --- Sidebar State ---
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main' | 'admin';
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // --- View/Admin State ---
  const [viewMode, setViewMode] = useState<'user' | 'admin'>(() => {
    const stored = localStorage.getItem('viewMode');
    return stored === 'admin' ? 'admin' : 'user';
  });
  const [isAdmin, setIsAdmin] = useState(false);
  // Session flag to prevent unwanted auto-switching
  const hasManuallySwitchedToUser = useRef(false);

  // Only auto-switch to admin view on first mount if on /admin and no viewMode in localStorage
  useEffect(() => {
    // Auto-switch to admin view only on first load, if on /admin and no viewMode is set
    // Prevent auto-switch if user has manually switched to user view in this session
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
        !hasManuallySwitchedToUser.current // Block auto-switch if user manually switched to user view
      ) {
        setViewMode('admin');
      }
    }
  }, []); // Only run on mount

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
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: 'main' | 'admin') => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? 'menu-item-active'
                  : 'menu-item-inactive'
              } cursor-pointer ${
                !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive'
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{t(nav.name)}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? 'rotate-180 text-brand-500'
                      : ''
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{t(nav.name)}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : '0px',
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? 'menu-dropdown-item-active'
                          : 'menu-dropdown-item-inactive'
                      }`}
                    >
                      {t(subItem.name)}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            {t('badge.new')}
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            {t('badge.pro')}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}
      >
        {/* <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link> */}
        <Link to="/">
          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              width: isExpanded || isHovered || isMobileOpen ? 'auto' : '2ch',
            }}
          >
            {' '}
            {/* Adjust '2ch' to "AI" width */}
            <span className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
              {t('brand.name')}
            </span>
          </div>
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {viewMode === 'user' && (
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    t('sidebar.menu')
                  ) : (
                    <HorizontaLDots className="size-6" />
                  )}
                </h2>
                {renderMenuItems(navItems, 'main')}
              </div>
            )}
            {isAdmin && viewMode === 'admin' && (
              <div className="">
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    t('sidebar.admin')
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {renderMenuItems(adminItems, 'admin')}
              </div>
            )}
          </div>
        </nav>
        {isAdmin && (isExpanded || isHovered || isMobileOpen) && (
          <div className="mt-auto px-6 pb-6">
            <button
              onClick={() => {
                if (viewMode === 'user') {
                  setViewMode('admin');
                  localStorage.setItem('viewMode', 'admin');
                } else {
                  // Set session flag BEFORE setViewMode to prevent auto-switch back
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
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {viewMode === 'user' ? (
                <>
                  <TaskIcon className="h-4 w-4" />
                  <span>{t('view.toggleToAdmin')}</span>
                </>
              ) : (
                <>
                  <GroupIcon className="h-4 w-4" />
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
