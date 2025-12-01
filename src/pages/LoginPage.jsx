import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ArrowIcon from '@/assets/arrow-right.svg?react'
import KakaoIcon from '@/assets/kakao-icon.svg'
import { loginUser } from '@/apis/userApi'
import { useAuth } from '@/contexts/AuthContext'
import useToast from '@/hooks/useToast'
import FormField from '@/components/FormField'

const API_URL = import.meta.env.VITE_BACK_URL

export default function LoginPage() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')

  const [userIdError, setUserIdError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const { login } = useAuth()

  const navigate = useNavigate()
  const { showErrorToast, showDefaultToast } = useToast()

  const handleSubmit = async e => {
    e.preventDefault()

    let hasError = false

    if (!userId) {
      setUserIdError('ⓘ 아이디를 입력해주세요.')
      hasError = true
    } else {
      setUserIdError('')
    }

    if (!password) {
      setPasswordError('ⓘ 비밀번호를 입력해주세요.')
      hasError = true
    } else {
      setPasswordError('')
    }

    if (hasError) return

    try {
      alert('현재 이용하실 수 없는 기능입니다.')
      // await loginUser({ userId, password })
      // await login()

      setUserId('')
      setPassword('')
      // showDefaultToast('NOA가 요금제를 추천해드릴게요!')
      // navigate('/chatbot')
    } catch {
      showErrorToast(
        <>
          아이디 또는 비밀번호가 <br />
          잘못되었습니다.
        </>
      )
    }
  }

  const handleKakaoLogin = () => {
    alert('현재 이용하실 수 없는 기능입니다.')
    // window.location.href = `${API_URL}/api/auth/kakao/login`
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center px-4">
      <h1 className="text-sub-title sm:text-page-header mb-2 text-center font-bold md:mb-4 md:text-4xl">
        UNOA 계정
      </h1>
      <p className="md:text-card-title mb-4 text-center">
        아직 UNOA 계정이 없으신가요?
        <Link
          to="/register"
          className="group text-primary-purple ml-2 inline-flex items-center hover:font-medium"
        >
          회원가입
          <span className="ml-1 inline-block transition-transform duration-300 group-hover:-rotate-45">
            →
          </span>
        </Link>
      </p>

      <form
        className="w-full max-w-[320px] space-y-1 sm:max-w-sm sm:space-y-2 md:max-w-md"
        onSubmit={handleSubmit}
      >
        <FormField
          label="아이디"
          value={userId}
          onChange={e => {
            setUserId(e.target.value)
            if (e.target.value) setUserIdError('')
          }}
          placeholder="아이디를 입력해주세요"
          error={userIdError}
        />

        <FormField
          label="비밀번호"
          type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value)
            if (e.target.value) setPasswordError('')
          }}
          placeholder="비밀번호를 입력해주세요"
          error={passwordError}
          showToggle
        />

        <div className="border-text-main mt-2 mb-4 border-t sm:mb-6" />

        <button
          type="submit"
          className="group bg-primary-purple relative mb-2 w-full rounded-sm py-3 font-semibold text-white sm:mb-4 sm:rounded-lg sm:py-4"
        >
          로그인
          <ArrowIcon className="absolute top-1/2 right-4 h-4 w-5 -translate-y-1/2 duration-300 group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={handleKakaoLogin}
          className="group bg-kakao relative w-full items-center justify-center rounded-sm py-3 font-semibold sm:rounded-lg sm:py-4"
        >
          <img
            src={KakaoIcon}
            alt="카카오 아이콘"
            className="text-banner absolute top-1/2 left-4 -translate-y-1/2"
          />
          <span className="block text-center">카카오 로그인</span>
          <ArrowIcon className="absolute top-1/2 right-4 h-4 w-5 -translate-y-1/2 duration-300 group-hover:translate-x-1" />
        </button>
      </form>
      <footer className="text-text-secondary text-caption sm:text-small-body mt-6 flex w-full max-w-[320px] flex-row justify-between px-2 max-[350px]:flex-col max-[350px]:text-center sm:mt-12 sm:max-w-sm md:max-w-md md:px-6">
        <p>김현우A | 송은재 | 심영민 | 홍성현 | 황주경</p>
        <p>© UNOA Corp.</p>
      </footer>
    </div>
  )
}
