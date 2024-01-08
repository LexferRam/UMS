import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export const useUserInfo = () => {
    const { data: session } = useSession()
    const [userInfo, setUserInfo] = useState<any>([])
  
    useEffect(() => {
      let getUserInfo = async () => {
        const respUser = await fetch(`${process.env.NEXTAUTH_BASE_API}/api/admin/user`)
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