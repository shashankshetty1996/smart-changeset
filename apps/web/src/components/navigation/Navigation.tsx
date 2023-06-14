import { usePathname } from "next/navigation";
import Link from "next/link";

import type { NavItem } from "../../types";

const navigationBar: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
];

export default function Navigation() {
  const pathname = usePathname() ?? "/";
  return (
    <nav>
      {navigationBar.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            className={isActive ? "text-blue" : "text-black"}
            href={link.href}
            key={link.label}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
