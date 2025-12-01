import { useState } from 'react'
import { Link } from 'react-router-dom'
import ArrowIcon from '@/assets/arrow-right.svg?react'
import Kakao from '@/assets/kakao-icon.svg'
import { registerUser, checkUserIdDuplicate } from '@/apis/userApi'
import useToast from '@/hooks/useToast'
import FormField from '@/components/FormField'

const API_URL = import.meta.env.VITE_BACK_URL

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isUplus, setIsUplus] = useState('')

  const [nameError, setNameError] = useState('')
  const [userIdError, setUserIdError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')
  const [isUplusError, setIsUplusError] = useState('')

  const [isPasswordConfirmTouched, setIsPasswordConfirmTouched] = useState(false)
  const [userIdCheckStatus, setUserIdCheckStatus] = useState('')

  const { showSuccessRegister, showSuccessToast, showErrorToast } = useToast()

  const validations = {
    name: value => (/^[가-힣]+$/.test(value) ? '' : 'ⓘ 한글로 입력해주세요.'),
    userId: value =>
      /^[a-z0-9]{4,16}$/.test(value) ? '' : 'ⓘ 영문소문자 또는 숫자 4~16자로 입력해주세요.',
    password: value =>
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]).{8,20}$/.test(value)
        ? ''
        : 'ⓘ 영문자, 숫자, 특수문자 포함 8~20자로 입력해주세요.',
    passwordConfirm: (value, password) =>
      value === password ? '' : 'ⓘ 비밀번호가 일치하지 않습니다.',
  }

  const handleCheckDuplicate = async () => {
    alert('현재 이용하실 수 없는 기능입니다.')
    // const trimmedId = userId.trim()

    // if (!trimmedId) {
    //   showErrorToast('아이디를 입력해주세요.')
    //   setUserIdCheckStatus('error')
    //   return
    // }

    // if (!/^[a-z0-9]{4,16}$/.test(trimmedId)) {
    //   showErrorToast('사용할 수 없는 아이디입니다.')
    //   setUserIdCheckStatus('error')
    //   return
    // }

    // try {
    //   await checkUserIdDuplicate(trimmedId)
    //   setUserIdCheckStatus('success')
    //   showSuccessToast('사용 가능한 아이디입니다.')
    // } catch (err) {
    //   const msg = err?.response?.data?.message || '중복 확인 중 오류가 발생했습니다.'
    //   showErrorToast(msg)
    //   setUserIdCheckStatus('error')
    // }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    setNameError(validations.name(name.trim()))
    setUserIdError(validations.userId(userId.trim()))
    setPasswordError(validations.password(password))
    setPasswordConfirmError(validations.passwordConfirm(passwordConfirm, password))

    if (!isUplus) {
      setIsUplusError('ⓘ LG U+ 요금제 여부를 선택해주세요.')
    } else {
      setIsUplusError('')
    }

    const isValid =
      name.trim() &&
      userId.trim() &&
      password &&
      passwordConfirm &&
      isUplus &&
      !nameError &&
      !userIdError &&
      !passwordError &&
      !passwordConfirmError &&
      !isUplusError

    if (!isValid) return

    if (userIdCheckStatus !== 'success') {
      showErrorToast('아이디 중복 확인을 해주세요.')
      setUserIdCheckStatus('error')
      return
    }

    try {
      alert('현재 이용하실 수 없는 기능입니다.')
      // const payload = {
      //   name,
      //   userId,
      //   password,
      //   isUplus,
      //   planInfo: isUplus === 'yes' ? {} : null,
      // }

      // await registerUser(payload)

      // setName('')
      // setUserId('')
      // setPassword('')
      // setPasswordConfirm('')
      // setIsUplus('')
      // setUserIdCheckStatus('')
      // setIsPasswordConfirmTouched(false)

      // showSuccessRegister({
      //   message: '로그인 후 UNOA를 시작해보세요.',
      // })
    } catch {
      showErrorToast('회원가입에 실패했습니다.')
    }
  }

  const handleKakaoLogin = () => {
    alert('현재 이용하실 수 없는 기능입니다.')
    // window.location.href = `${API_URL}/api/auth/kakao/login`
  }

  return (
    <div className="flex flex-col items-center py-4 sm:pt-16">
      <h1 className="text-sub-title sm:text-page-header mb-2 font-bold md:mb-4 md:text-4xl">
        UNOA 계정 생성
      </h1>
      <p className="md:text-card-title mb-4 text-center">
        UNOA 계정을 가지고 계시나요?
        <Link
          to="/login"
          className="group text-primary-purple ml-2 inline-flex items-center hover:font-medium"
        >
          로그인
          <span className="ml-1 inline-block transition-transform duration-300 group-hover:-rotate-45">
            →
          </span>
        </Link>
      </p>

      <form className="w-full max-w-[320px] sm:max-w-sm md:max-w-md" onSubmit={handleSubmit}>
        <div className="space-y-1 sm:space-y-2">
          <FormField
            label="이름"
            required
            value={name}
            onChange={e => {
              setName(e.target.value)
              setNameError(validations.name(e.target.value))
            }}
            placeholder="이름을 입력해주세요"
            error={nameError}
          />

          <FormField
            label="아이디"
            required
            value={userId}
            onChange={e => {
              setUserId(e.target.value)
              setUserIdError(validations.userId(e.target.value))
              setUserIdCheckStatus('')
            }}
            placeholder="아이디를 입력해주세요"
            error={userIdError}
            rightText="중복 확인"
            onRightClick={handleCheckDuplicate}
          />

          <FormField
            label="비밀번호"
            required
            type="password"
            value={password}
            onChange={e => {
              const newPassword = e.target.value
              setPassword(newPassword)
              setPasswordError(validations.password(newPassword))
              if (isPasswordConfirmTouched) {
                setPasswordConfirmError(validations.passwordConfirm(passwordConfirm, newPassword))
              }
            }}
            placeholder="영문자, 숫자, 특수문자 포함 8~20자"
            error={passwordError}
            showToggle
          />

          <FormField
            label="비밀번호 확인"
            required
            type="password"
            value={passwordConfirm}
            onChange={e => {
              setPasswordConfirm(e.target.value)
              setIsPasswordConfirmTouched(true)
              setPasswordConfirmError(validations.passwordConfirm(e.target.value, password))
            }}
            placeholder="비밀번호를 확인해주세요"
            error={isPasswordConfirmTouched ? passwordConfirmError : ''}
            showToggle
          />

          <div className="mb-2 ml-2 flex flex-col justify-between sm:flex-row">
            <div className="flex flex-row items-center space-x-2">
              <span>
                LG U+ 요금제를 사용중이신가요? <span className="text-error">*</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="isUplus"
                  value="yes"
                  checked={isUplus === 'yes'}
                  onChange={e => {
                    setIsUplus(e.target.value)
                    setIsUplusError('')
                  }}
                  className="accent-primary-purple"
                />
                <span>예</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="isUplus"
                  value="no"
                  checked={isUplus === 'no'}
                  onChange={e => {
                    setIsUplus(e.target.value)
                    setIsUplusError('')
                  }}
                  className="accent-primary-purple"
                />
                <span>아니요</span>
              </label>
            </div>
          </div>
          <div
            className={`text-caption sm:text-small-body text-error mt-2 ml-2 overflow-hidden transition-all duration-300 ease-in-out ${
              isUplusError ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {isUplusError}
          </div>
        </div>

        <div className="border-text-main mt-2 mb-4 border-t sm:mb-6" />

        <button
          type="submit"
          className="group bg-primary-purple relative mb-2 w-full rounded-sm py-3 font-semibold text-white sm:mb-4 sm:rounded-lg sm:py-4"
        >
          가입하기
          <ArrowIcon className="absolute top-1/2 right-4 h-4 w-5 -translate-y-1/2 duration-300 group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={handleKakaoLogin}
          className="group bg-kakao relative w-full items-center justify-center rounded-sm py-3 font-semibold sm:rounded-lg sm:py-4"
        >
          <img
            src={Kakao}
            alt="카카오 아이콘"
            className="text-banner absolute top-1/2 left-4 -translate-y-1/2"
          />
          <span className="block text-center">카카오로 가입하기</span>
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
