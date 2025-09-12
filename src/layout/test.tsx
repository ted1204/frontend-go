const renderMenuItems = (items: NavItem[], menuType: "main" | "admin") => (
  <ul className="flex flex-col gap-4">
    {items.map((nav, index) => (
      <li key={nav.name}>
        {nav.subItems ? (
          <button
            onClick={() => handleSubmenuToggle(index, menuType)}
            className={`menu-item group ${
              openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
            } cursor-pointer ${
              !isExpanded && !isHovered
                ? "lg:justify-center"
                : "lg:justify-start"
            }`}
          >
            <span
              className={`menu-item-icon-size ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}
            >
              {nav.icon}
            </span>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                width:
                  isExpanded || isHovered || isMobileOpen
                    ? "auto"
                    : `${nav.name.length * 0.5}ch`, // 粗略估計縮減寬度，需微調
              }}
            >
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text whitespace-nowrap">{nav.name}</span>
              )}
            </div>
            {(isExpanded || isHovered || isMobileOpen) && (
              <ChevronDownIcon
                className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                }`}
              />
            )}
          </button>
        ) : (
          nav.path && (
            <Link
              to={nav.path}
              className={`menu-item group ${
                isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  width:
                    isExpanded || isHovered || isMobileOpen
                      ? "auto"
                      : `${nav.name.length * 0.5}ch`, // 粗略估計，需微調
                }}
              >
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text whitespace-nowrap">{nav.name}</span>
                )}
              </div>
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
                  : "0px",
            }}
          >
            <ul className="mt-2 space-y-1 ml-9">
              {nav.subItems.map((subItem) => (
                <li key={subItem.name}>
                  <Link
                    to={subItem.path}
                    className={`menu-dropdown-item ${
                      isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                    }`}
                  >
                    {subItem.name}
                    <span className="flex items-center gap-1 ml-auto">
                      {subItem.new && (
                        <span
                          className={`ml-auto ${
                            isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                          } menu-dropdown-badge`}
                        >
                          new
                        </span>
                      )}
                      {subItem.pro && (
                        <span
                          className={`ml-auto ${
                            isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                          } menu-dropdown-badge`}
                        >
                          pro
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