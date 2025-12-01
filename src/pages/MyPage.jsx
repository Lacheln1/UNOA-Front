import { useAuth } from '@/contexts/AuthContext'
import UserNoPlan from '@/components/MyPage/UserNoPlan'
import UserPlan from '@/components/MyPage/UserPlan'
import NoUser from '@/components/MyPage/NoUser'
import NoPlanBenefit from '@/components/MyPage/NoPlanBenefit'
import { UserBenefits } from '@/components/MyPage/UserBenefits'
import Footer from '@/components/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'

export default function MyPage() {
  const user = false
  let content

  if (!user) {
    content = (
      <>
        <NoUser />
        <NoPlanBenefit />
      </>
    )
  } else if (user.user.isUplus) {
    content = (
      <>
        <UserPlan />
        <UserBenefits />
        <ScrollToTopButton className="right-5 bottom-7 sm:bottom-6" />
      </>
    )
  } else {
    content = (
      <>
        <UserNoPlan />
        <NoPlanBenefit />
      </>
    )
  }

  return (
    <div className="bg-gray-20 flex min-h-[calc(100vh-var(--header-height))] flex-col items-center gap-4 overflow-y-auto py-6 sm:gap-8 sm:pt-12">
      {content}
      <div className="bg-gray-20 w-full">
        <Footer />
      </div>
    </div>
  )
}
