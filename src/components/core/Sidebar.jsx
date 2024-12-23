import * as Icons from "react-icons/vsc";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const sideLinks = [
    { icon: "VscGraphLine", name: "Track", link: "/dashboard/track" },
    { icon: "VscAccount", name: "Profile", link: "/dashboard/profile" },
    { icon: "VscOrganization", name: "Users", link: "/dashboard/users" },
    { icon: "VscGraphScatter", name: "Payroll", link: "/dashboard/payroll" },
  ];

  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="md:flex hidden h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-grey bg-slate-800 py-10">
      <div className="flex flex-col gap-2">
        {sideLinks.map((link, index) => {
          if (link.name === "Users" && user?.role === "User") return null;
          const Icon = Icons[link.icon];

          return (
            <NavLink
              to={link.link}
              key={index}
              className={`relative px-8 py-2 text-sm font-medium ${
                matchRoute(link.link)
                  ? "bg-white text-black"
                  : "bg-opacity-0 text-slate-400"
              } transition-all duration-200`}
            >
              <span
                className={`absolute left-0 top-0 h-full w-[0.15rem] bg-green-500 ${
                  matchRoute(link.link) ? "opacity-100" : "opacity-0"
                }`}
              ></span>

              <div className="flex items-center gap-x-2">
                {Icon && <Icon className="text-lg" />}
                <span>{link.name}</span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
