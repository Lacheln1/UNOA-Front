import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Logo from '@/assets/Logo.svg'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const isHome = location.pathname === '/'

  const headerBgClass = isHome ? 'bg-black' : 'bg-white'
  const headerShadow = isHome ? '' : 'shadow-sm'
  const headerTextColorClass = isHome ? 'text-white' : 'text-text-main'
  const menuIconColorClass = isHome ? 'bg-white' : 'bg-black'
  const navLinkBaseClass = 'hover:text-primary-purple transition-colors duration-200'
  const navLinkActiveClass = isHome
    ? 'relative font-bold'
    : 'text-primary-purple relative font-bold'

  const navItems = [
    { to: '/chatbot', label: '요금제 추천 받기' },
    { to: '/planlist', label: '요금제 한눈에 보기' },
    { to: '/mypage', label: '마이페이지' },
  ]

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  return (
    <header
      className={`${isHome ? 'absolute' : 'fixed'} top-0 left-0 z-50 w-full ${headerBgClass} ${headerShadow}`}
    >
      <div className="md:px-8lg:px-16 mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          onClick={() => {
            setIsMenuOpen(false)
            location.reload()
          }}
          className="lg:hidden"
        >
          <img src={Logo} alt="U+NOA 로고" className="h-8" />
        </Link>

        <div
          className={`text-card-title ${headerTextColorClass} hidden w-full items-center justify-between lg:flex`}
        >
          <div className="flex items-center space-x-8">
            <Link to="/">
              <img src={Logo} alt="U+NOA 로고" className="h-10" />
            </Link>
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${navLinkBaseClass} ${isActive ? navLinkActiveClass : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${navLinkBaseClass} ${isActive ? navLinkActiveClass : ''}`
            }
          >
            로그인
          </NavLink>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative flex h-8 w-8 flex-col items-center justify-center lg:hidden"
          aria-label="메뉴 버튼"
        >
          <span
            className={`absolute block h-[2px] w-6 ${menuIconColorClass} transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'rotate-45' : '-translate-y-2'
            }`}
          ></span>
          <span
            className={`absolute block h-[2px] w-6 ${menuIconColorClass} transition-opacity duration-300 ease-in-out ${
              isMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          ></span>
          <span
            className={`absolute block h-[2px] w-6 ${menuIconColorClass} transition-transform duration-300 ease-in-out ${
              isMenuOpen ? '-rotate-45' : 'translate-y-2'
            }`}
          ></span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setIsMenuOpen(false)}></div>
      )}

      {/* 모바일 메뉴 영역 */}
      <div
        className={`absolute top-15 left-0 z-40 w-full overflow-hidden transition-all duration-300 lg:hidden ${
          isMenuOpen ? 'max-h-[300px] pb-4 opacity-100' : 'max-h-0 opacity-0'
        } ${headerBgClass}`}
        style={{ boxShadow: isMenuOpen ? '0px 2px 4px rgba(0, 0, 0, 0.05)' : 'none' }}
      >
        <div
          className={`text-body ${headerTextColorClass} flex flex-col items-start space-y-4 px-6 pt-2 md:px-8 lg:px-16`}
        >
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `${navLinkBaseClass} ${isActive ? navLinkActiveClass : ''}`
              }
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <button onClick={handleLogout} className={navLinkBaseClass}>
              로그아웃
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `${navLinkBaseClass} ${isActive ? navLinkActiveClass : ''}`
              }
            >
              로그인
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}
