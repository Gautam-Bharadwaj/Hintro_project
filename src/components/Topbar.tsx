"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { IconChevronDown, IconMenu, IconPlay } from "./icons";
import { useUser } from "@/context/UserContext";
import LogoutModal from "./LogoutModal";
import TutorialModal from "./TutorialModal";
import ProfileModal from "./ProfileModal";

interface TopbarProps {
  title: string;
  userName: string;
  photo?: string;
  defaultFirstName: string;
  defaultLastName: string;
  onOpenMobileSidebar: () => void;
}

export default function Topbar({
  title,
  userName,
  photo,
  defaultFirstName,
  defaultLastName,
  onOpenMobileSidebar,
}: TopbarProps) {
  const { userId, setUserId } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  return (
    <>
      <header className="h-14 lg:h-16 sticky top-0 z-30 flex items-center justify-between gap-4 px-4 lg:px-8 border-b border-border bg-surface/95 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            aria-label="Open menu"
            className="lg:hidden p-1 -ml-1 text-text"
          >
            <IconMenu width={22} height={22} />
          </button>
          <h1 className="text-base lg:text-lg font-semibold truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTutorialOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs lg:text-sm text-text hover:bg-surface-2 transition-colors"
          >
            <IconPlay width={12} height={12} className="text-text" />
            Watch Tutorial
          </button>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full hover:bg-surface-2 transition-colors p-0.5 pr-1.5"
            >
              <Avatar name={userName} size={32} src={photo} />
              <IconChevronDown width={14} height={14} className="text-text-soft" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-lg border border-border bg-surface shadow-modal anim-scale overflow-hidden">
                <div className="flex items-center gap-3 px-3 py-3 border-b border-border">
                  <Avatar name={userName} size={36} src={photo} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text truncate">{userName}</p>
                    <p className="text-[11px] text-text-soft truncate">
                      {userId === "u1" ? "Empty state user" : "Filled state user"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setProfileOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-surface-2 text-text"
                >
                  Edit profile
                </button>

                <div className="border-t border-border">
                  <div className="px-3 py-2 text-[11px] text-text-soft">Switch user</div>
                  <button
                    onClick={() => {
                      setUserId("u1");
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-2 ${userId === "u1" ? "font-semibold" : ""
                      }`}
                  >
                    John Doe <span className="text-text-soft">(empty state)</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserId("u2");
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-2 ${userId === "u2" ? "font-semibold" : ""
                      }`}
                  >
                    Jane Smith <span className="text-text-soft">(filled)</span>
                  </button>
                </div>

                <div className="border-t border-border">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setLogoutOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-surface-2 text-text"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {logoutOpen && <LogoutModal onClose={() => setLogoutOpen(false)} />}
      {tutorialOpen && <TutorialModal onClose={() => setTutorialOpen(false)} />}
      {profileOpen && (
        <ProfileModal
          onClose={() => setProfileOpen(false)}
          defaultFirstName={defaultFirstName}
          defaultLastName={defaultLastName}
        />
      )}
    </>
  );
}
