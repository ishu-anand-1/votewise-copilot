import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  children: ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    {
      className = "",
      activeClassName = "text-primary font-semibold",
      pendingClassName = "opacity-60",
      children,
      to,
      ...props
    },
    ref
  ) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(
            "transition-all duration-200 px-3 py-2 rounded-xl",
            className,
            isActive && activeClassName,
            isPending && pendingClassName
          )
        }
        {...props}
      >
        {children}
      </RouterNavLink>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };