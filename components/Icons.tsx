export const MenuIcon = ({ color = "currentColor", className = "" }: { color?: string; className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 8.5H21" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 15.5H16" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PenIcon = ({ color = "currentColor", className = "" }: { color?: string; className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M16.9497 3.53553L18.364 2.12132C19.145 1.34027 20.4114 1.34027 21.1924 2.12132C21.9734 2.90237 21.9734 4.16871 21.1924 4.94975L19.7782 6.36396M16.9497 3.53553L6.34315 14.1421L5.63604 18.3848L9.87868 17.6777L20.4853 7.07107M16.9497 3.53553L20.4853 7.07107"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const StopIcon = ({ className = "" }: { className?: string }) => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="15" cy="15" r="15" fill="white" className="fill-white" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.5673 10.8333H17.4327C17.6524 10.8332 17.8419 10.8332 17.9979 10.846C18.1627 10.8594 18.3265 10.8892 18.4842 10.9695C18.7194 11.0893 18.9106 11.2806 19.0304 11.5158C19.1108 11.6734 19.1405 11.8373 19.1539 12.002C19.1667 12.1581 19.1667 12.3475 19.1667 12.5672V17.4327C19.1667 17.6523 19.1667 17.8418 19.1539 17.9978C19.1405 18.1626 19.1108 18.3264 19.0304 18.4841C18.9106 18.7193 18.7194 18.9105 18.4842 19.0303C18.3265 19.1107 18.1627 19.1404 17.9979 19.1538C17.8419 19.1666 17.6524 19.1666 17.4327 19.1666H12.5673C12.3476 19.1666 12.1582 19.1666 12.0021 19.1538C11.8374 19.1404 11.6735 19.1107 11.5159 19.0303C11.2807 18.9105 11.0894 18.7193 10.9696 18.4841C10.8893 18.3264 10.8595 18.1626 10.8461 17.9978C10.8333 17.8418 10.8333 17.6523 10.8333 17.4326V12.5672C10.8333 12.3475 10.8333 12.1581 10.8461 12.002C10.8595 11.8373 10.8893 11.6734 10.9696 11.5158C11.0894 11.2806 11.2807 11.0893 11.5159 10.9695C11.6735 10.8892 11.8374 10.8594 12.0021 10.846C12.1582 10.8332 12.3476 10.8332 12.5673 10.8333Z"
      fill="black"
    />
  </svg>
)

export const PlusIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const XIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ShareIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M16 6L12 2L8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronDownIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const MicrophoneIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C10.3431 2 9 3.34315 9 5V11C9 12.6569 10.3431 14 12 14C13.6569 14 15 12.6569 15 11V5C15 3.34315 13.6569 2 12 2ZM11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5V11C13 11.5523 12.5523 12 12 12C11.4477 12 11 11.5523 11 11V5Z"
      fill="currentColor"
    />
    <path
      d="M5 11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11H21C21 15.4952 17.7018 19.2223 13.4354 19.8973C13.6192 20.0682 13.7846 20.2582 13.9289 20.4645L15.3289 22.4645C15.5398 22.7658 15.3242 23.1818 14.9569 23.1818H9.04306C8.67584 23.1818 8.46019 22.7658 8.67106 22.4645L10.0711 20.4645C10.2154 20.2582 10.3808 20.0682 10.5646 19.8973C6.29819 19.2223 3 15.4952 3 11H5Z"
      fill="currentColor"
    />
  </svg>
)

export const HeadphoneIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V18.5C22 20.433 20.433 22 18.5 22C16.567 22 15 20.433 15 18.5V16.5C15 14.567 16.567 13 18.5 13C19.0368 13 19.5454 13.1208 20 13.3368V12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12V13.3368C4.45463 13.1208 4.9632 13 5.5 13C7.433 13 9 14.567 9 16.5V18.5C9 20.433 7.433 22 5.5 22C3.567 22 2 20.433 2 18.5V12Z"
      fill="currentColor"
    />
  </svg>
)

export const OpenAIIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z"
      fill="currentColor"
    />
  </svg>
)

export const SendIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 5V19M12 5L6 11M12 5L18 11"
      stroke="black"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const CopyIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 3H4V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7H20V20H8V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Logo = OpenAIIcon

export const CameraIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PhotoIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const FolderIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M22 19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V5C2 3.9 2.9 3 4 3H9L11 6H20C21.1 6 22 6.9 22 8V19Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const AppleIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M17.4725 15.6575C16.4807 17.0863 15.4057 19.1675 13.6826 19.1675C12.012 19.1675 11.4795 18.1762 9.54075 18.1762C7.57638 18.1762 6.96763 19.13 5.40763 19.1675C3.77263 19.205 2.45763 17.3912 1.39263 15.8562C-0.787375 12.7088 0.835125 7.82625 4.39263 7.78875C6.07638 7.75125 7.23513 8.91875 8.29013 8.91875C9.30388 8.91875 10.7489 7.55625 12.7839 7.72875C13.6364 7.76625 16.0351 8.07375 17.5589 10.3012C17.4351 10.3762 15.1964 11.6925 15.2226 14.415C15.2451 16.635 17.1689 17.4412 17.4725 15.6575Z"
      fill="black"
    />
    <path
      d="M11.6663 5.25375C12.4463 4.30875 12.9676 2.9925 12.8251 1.68375C11.6663 1.7325 10.2638 2.45625 9.43135 3.4275C8.68885 4.2825 8.02885 5.62125 8.21635 6.8925C9.5101 6.99 10.8863 6.19875 11.6663 5.25375Z"
      fill="black"
    />
  </svg>
)

export const GoogleIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)

export const BigEnvelopeIcon = ({ className = "" }: { className?: string }) => (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="48" cy="48" r="48" fill="#F3F4F6" />
    <path d="M28 38L48 52L68 38" stroke="#111827" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <rect
      x="28"
      y="32"
      width="40"
      height="32"
      rx="4"
      stroke="#111827"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const SettingsSlidersIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="8" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="16" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="10" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </svg>
)

export const NewChatIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 7V13M9 10H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const SidebarToggleIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <line x1="9" y1="4" x2="9" y2="20" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

export const CustomLoader = ({ className = "" }: { className?: string }) => (
  <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
      <line x1="50" y1="12" x2="50" y2="26" opacity="1" />
      <line x1="68" y1="18" x2="60" y2="30" opacity="0.9" />
      <line x1="82" y1="32" x2="70" y2="40" opacity="0.8" />
      <line x1="88" y1="50" x2="74" y2="50" opacity="0.7" />
      <line x1="82" y1="68" x2="70" y2="60" opacity="0.6" />
      <line x1="68" y1="82" x2="60" y2="70" opacity="0.5" />
      <line x1="50" y1="88" x2="50" y2="74" opacity="0.4" />
      <line x1="32" y1="82" x2="40" y2="70" opacity="0.3" />
      <line x1="18" y1="68" x2="30" y2="60" opacity="0.25" />
      <line x1="12" y1="50" x2="26" y2="50" opacity="0.2" />
      <line x1="18" y1="32" x2="30" y2="40" opacity="0.15" />
      <line x1="32" y1="18" x2="40" y2="30" opacity="0.1" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 50 50"
        to="360 50 50"
        dur="0.8s"
        repeatCount="indefinite"
      />
    </g>
  </svg>
)

export const SpinnerLoader = ({ className = "" }: { className?: string }) => (
  <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
      <line x1="50" y1="12" x2="50" y2="26" opacity="1" />
      <line x1="68" y1="18" x2="60" y2="30" opacity="0.9" />
      <line x1="82" y1="32" x2="70" y2="40" opacity="0.8" />
      <line x1="88" y1="50" x2="74" y2="50" opacity="0.7" />
      <line x1="82" y1="68" x2="70" y2="60" opacity="0.6" />
      <line x1="68" y1="82" x2="60" y2="70" opacity="0.5" />
      <line x1="50" y1="88" x2="50" y2="74" opacity="0.4" />
      <line x1="32" y1="82" x2="40" y2="70" opacity="0.3" />
      <line x1="18" y1="68" x2="30" y2="60" opacity="0.25" />
      <line x1="12" y1="50" x2="26" y2="50" opacity="0.2" />
      <line x1="18" y1="32" x2="30" y2="40" opacity="0.15" />
      <line x1="32" y1="18" x2="40" y2="30" opacity="0.1" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 50 50"
        to="360 50 50"
        dur="0.8s"
        repeatCount="indefinite"
      />
    </g>
  </svg>
)
