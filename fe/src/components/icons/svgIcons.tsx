export const HomeIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 2}
    className="w-7 h-7"
  >
    <path d="M22.58 7.35L12.475 1.897a1 1 0 00-.95 0L1.425 7.35A2 2 0 00.5 9.057V21a1 1 0 001 1h8a1 1 0 001-1v-4h3v4a1 1 0 001 1h8a1 1 0 001-1V9.057a2 2 0 00-.92-1.707z" />
  </svg>
);
export const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
export const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
export const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
export const GrokIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);
export const UsersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
export const ProfileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
);
export const MoreIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);
export const DotsHIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);
export const VerifyBadge = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4 inline-block text-[#1d9bf0]"
    fill="currentColor"
  >
    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91-1.01-1-2.52-1.26-3.91-.78C14.91 2.86 13.68 2 12.25 2c-1.43 0-2.67.88-3.34 2.19-1.39-.46-2.9-.2-3.91.81-1 1.01-1.26 2.52-.78 3.91C2.86 9.59 2 10.82 2 12.25c0 1.43.88 2.67 2.19 3.34-.46 1.39-.2 2.9.81 3.91 1.01 1 2.52 1.26 3.91.78 .67 1.11 1.9 1.97 3.34 1.97 1.43 0 2.67-.88 3.34-2.19 1.39.46 2.9.2 3.91-.81 1-1.01 1.26-2.52.78-3.91 1.11-.67 1.97-1.9 1.97-3.34z" />
    <path fill="white" d="M9.75 14.75l-2-2-1.5 1.5 3.5 3.5 6-6-1.5-1.5z" />
  </svg>
);

export const MediaIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1d9bf0"
    strokeWidth={2}
    className="w-5 h-5"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export const ReplyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    className="w-5 h-5"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
export const RetweetIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    className="w-5 h-5"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
export const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "#f91880" : "none"}
    stroke={filled ? "#f91880" : "currentColor"}
    strokeWidth={1.75}
    className="w-5 h-5"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
export const ViewsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    className="w-5 h-5"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const ShareIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    className="w-5 h-5"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
