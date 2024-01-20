import { useSession } from "next-auth/react"
import { useQuery } from "react-query"

export const useUserInfo = () => {
  const { data: session } = useSession()

  const {
    isLoading: isLoadingUserInfo,
    error: userInfoError,
    data: userInfo = [],
    refetch: refetchUserInfo
  } = useQuery(['userInfo'], () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/user`).then(res =>
      res.json()
    ))

  return [
    userInfo,
    isLoadingUserInfo,
    session
  ]
}