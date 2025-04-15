// src/components/react/Navigation.tsx
import React, { useState, useEffect, useRef } from "react";

// Interfaz para cada item de navegación
interface NavItem {
  href: string;
  label: string;
}

// Interfaz para las props del componente Navigation
interface NavigationProps {
  navItems: NavItem[];
}

// Componente funcional de React tipado
function Navigation({ navItems }: NavigationProps): React.ReactElement {
  const [activeSection, setActiveSection] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0.4,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      let latestActiveSectionId: string | null = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          latestActiveSectionId = entry.target.getAttribute("id");
        }
      });

      if (latestActiveSectionId) {
        setActiveSection(latestActiveSectionId);
      }
    };

    // Creamos el observer solo una vez
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        observerCallback,
        observerOptions
      );
    }

    const observer = observerRef.current;
    const sections = document.querySelectorAll("main section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <nav
      className="hidden lg:block mt-12"
      aria-label="Navegación principal en página"
    >
      <ul className="space-y-3 text-xs font-medium uppercase tracking-wider">
        {navItems.map((item) => {
          const isActive = activeSection === item.href.substring(1);

          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={`block transition-colors duration-300 ease-in-out group ${
                  isActive
                    ? "text-slate-200"
                    : "text-slate-500 hover:text-slate-200"
                }`}
              >
                <span
                  className={`
                    inline-block h-px w-8 mr-3 bg-slate-600
                    group-hover:bg-slate-200 group-hover:w-16
                    transition-all duration-300 ease-in-out
                    ${isActive ? "w-16 bg-slate-200" : ""}
                  `}
                ></span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


export default Navigation;
