import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export const useUserInfo = () => {
    const { data: session } = useSession()
    const [userInfo, setUserInfo] = useState<any>([])
  
    useEffect(() => {
      let getUserInfo = async () => {
        const respUser = await fetch('http://localhost:3000/api/admin/user')
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