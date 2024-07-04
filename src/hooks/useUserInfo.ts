import { useSession } from "next-auth/react"
import { useQuery } from "react-query"

export const useUserInfo = () => {
  const { data: session } = useSession()

  const {
    isLoading: isLoadingUserInfo,
    error: userInfoError,
    data: userInfo = [],
    refetch: refetchUserInfo
  } = useQuery(['userInfo'], async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/user`,{ signal }).then(res =>
      res.json()
    ),
    {
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    })

  return [
    userInfo,
    isLoadingUserInfo,
    session
  ]
}