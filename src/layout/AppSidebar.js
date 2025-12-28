import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from '@tailadmin/utils';
// Assume these icons are imported from an icon library
import { BoxIcon, ChevronDownIcon, GridIcon, GroupIcon, HorizontaLDots, TaskIcon } from '../icons';
import { useSidebar } from '../context/useSidebar';
const navItems = [
    {
        icon: _jsx(TaskIcon, {}),
        name: 'sidebar.projects',
        path: '/projects',
    },
    {
        icon: _jsx(TaskIcon, {}),
        name: 'sidebar.jobs',
        path: '/jobs',
    },
    {
        icon: _jsx(GroupIcon, {}),
        name: 'sidebar.groups',
        path: '/groups',
    },
    {
        icon: _jsx(BoxIcon, {}),
        name: 'sidebar.pods',
        path: '/pod-tables',
    },
    {
        icon: _jsx(TaskIcon, {}),
        name: 'sidebar.fileBrowser',
        path: '/file-browser',
    },
    {
        icon: _jsx(GridIcon, {}),
        name: 'sidebar.dashboard',
        subItems: [{ name: 'sidebar.ecommerce', path: '/', pro: false }],
    },
    {
        icon: _jsx(BoxIcon, {}),
        name: 'sidebar.myForms',
        path: '/my-forms',
    },
];
const adminItems = [
    {
        icon: _jsx(GridIcon, {}),
        name: 'admin.dashboard',
        path: '/admin',
    },
    {
        icon: _jsx(TaskIcon, {}), // Use TaskIcon for Manage Projects
        name: 'admin.manageProjects',
        path: '/admin/manage-projects',
    },
    {
        icon: _jsx(GroupIcon, {}), // Use GroupIcon for Manage Groups
        name: 'admin.manageGroups',
        path: '/admin/manage-groups',
    },
    {
        icon: _jsx(BoxIcon, {}),
        name: 'admin.forms',
        path: '/admin/forms',
    },
];
const AppSidebar = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();
    const { t } = useTranslation();
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [subMenuHeight, setSubMenuHeight] = useState({});
    const subMenuRefs = useRef({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [viewMode, setViewMode] = useState('user');
    // const isActive = (path: string) => location.pathname === path;
    const isActive = useCallback((path) => location.pathname === path, [location.pathname]);
    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            const isSuperAdmin = parsedData.is_super_admin === true;
            setIsAdmin(isSuperAdmin);
            // If user is admin and on an admin route, switch to admin view automatically
            if (isSuperAdmin && location.pathname.startsWith('/admin')) {
                setViewMode('admin');
            }
        }
        let submenuMatched = false;
        ['main', 'admin'].forEach((menuType) => {
            // Only check the active menu type
            if (menuType === 'main' && viewMode === 'admin')
                return;
            if (menuType === 'admin' && viewMode === 'user')
                return;
            const items = menuType === 'main' ? navItems : adminItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({ type: menuType, index });
                            submenuMatched = true;
                        }
                    });
                }
                else if (nav.path && isActive(nav.path)) {
                    setOpenSubmenu(null); // If it's a single path, close submenu
                    submenuMatched = true;
                }
            });
        });
        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [location, isActive, viewMode]);
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
    const handleSubmenuToggle = (index, menuType) => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
                return null;
            }
            return { type: menuType, index };
        });
    };
    const renderMenuItems = (items, menuType) => (_jsx("ul", { className: "flex flex-col gap-4", children: items.map((nav, index) => (_jsxs("li", { children: [nav.subItems ? (_jsxs("button", { onClick: () => handleSubmenuToggle(index, menuType), className: `menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? 'menu-item-active'
                        : 'menu-item-inactive'} cursor-pointer ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'}`, children: [_jsx("span", { className: `menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                ? 'menu-item-icon-active'
                                : 'menu-item-icon-inactive'}`, children: nav.icon }), (isExpanded || isHovered || isMobileOpen) && (_jsx("span", { className: "menu-item-text", children: t(nav.name) })), (isExpanded || isHovered || isMobileOpen) && (_jsx(ChevronDownIcon, { className: `ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                ? 'rotate-180 text-brand-500'
                                : ''}` }))] })) : (nav.path && (_jsxs(Link, { to: nav.path, className: `menu-item group ${isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'}`, children: [_jsx("span", { className: `menu-item-icon-size ${isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'}`, children: nav.icon }), (isExpanded || isHovered || isMobileOpen) && (_jsx("span", { className: "menu-item-text", children: t(nav.name) }))] }))), nav.subItems && (isExpanded || isHovered || isMobileOpen) && (_jsx("div", { ref: (el) => {
                        subMenuRefs.current[`${menuType}-${index}`] = el;
                    }, className: "overflow-hidden transition-all duration-300", style: {
                        height: openSubmenu?.type === menuType && openSubmenu?.index === index
                            ? `${subMenuHeight[`${menuType}-${index}`]}px`
                            : '0px',
                    }, children: _jsx("ul", { className: "mt-2 space-y-1 ml-9", children: nav.subItems.map((subItem) => (_jsx("li", { children: _jsxs(Link, { to: subItem.path, className: `menu-dropdown-item ${isActive(subItem.path)
                                    ? 'menu-dropdown-item-active'
                                    : 'menu-dropdown-item-inactive'}`, children: [t(subItem.name), _jsxs("span", { className: "flex items-center gap-1 ml-auto", children: [subItem.new && (_jsx("span", { className: `ml-auto ${isActive(subItem.path)
                                                    ? 'menu-dropdown-badge-active'
                                                    : 'menu-dropdown-badge-inactive'} menu-dropdown-badge`, children: t('badge.new') })), subItem.pro && (_jsx("span", { className: `ml-auto ${isActive(subItem.path)
                                                    ? 'menu-dropdown-badge-active'
                                                    : 'menu-dropdown-badge-inactive'} menu-dropdown-badge`, children: t('badge.pro') }))] })] }) }, subItem.name))) }) }))] }, nav.name))) }));
    return (_jsxs("aside", { className: `fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`, onMouseEnter: () => !isExpanded && setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsx("div", { className: `py-8 flex ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`, children: _jsx(Link, { to: "/", children: _jsxs("div", { className: "overflow-hidden transition-all duration-300", style: {
                            width: isExpanded || isHovered || isMobileOpen ? 'auto' : '2ch',
                        }, children: [' ', _jsx("span", { className: "text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap", children: t('brand.name') })] }) }) }), _jsxs("div", { className: "flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar", children: [_jsx("nav", { className: "mb-6", children: _jsxs("div", { className: "flex flex-col gap-4", children: [viewMode === 'user' && (_jsxs("div", { children: [_jsx("h2", { className: `mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`, children: isExpanded || isHovered || isMobileOpen ? (t('sidebar.menu')) : (_jsx(HorizontaLDots, { className: "size-6" })) }), renderMenuItems(navItems, 'main')] })), isAdmin && viewMode === 'admin' && (_jsxs("div", { className: "", children: [_jsx("h2", { className: `mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`, children: isExpanded || isHovered || isMobileOpen ? (t('sidebar.admin')) : (_jsx(HorizontaLDots, {})) }), renderMenuItems(adminItems, 'admin')] }))] }) }), isAdmin && (isExpanded || isHovered || isMobileOpen) && (_jsx("div", { className: "mt-auto px-6 pb-6", children: _jsx("button", { onClick: () => setViewMode(viewMode === 'user' ? 'admin' : 'user'), className: "flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white", children: viewMode === 'user' ? (_jsxs(_Fragment, { children: [_jsx(TaskIcon, { className: "h-4 w-4" }), _jsx("span", { children: t('view.toggleToAdmin') })] })) : (_jsxs(_Fragment, { children: [_jsx(GroupIcon, { className: "h-4 w-4" }), _jsx("span", { children: t('view.toggleToUser') })] })) }) }))] })] }));
};
export default AppSidebar;
