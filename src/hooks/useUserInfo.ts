import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export const useUserInfo = () => {
    const { data: session } = useSession()
    const [userInfo, setUserInfo] = useState<any>([])
  
    useEffect(() => {
      let getUserInfo = async () => {
        const respUser = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/user`)
        let user = await respUser.json()
        setUserInfo(user)
      }
  
      getUserInfo()
  
    }, [session])

    return [
      userInfo, 
      session
    ]
}