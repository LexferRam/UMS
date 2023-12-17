import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export const useUserInfo = () => {
    const { data: session } = useSession()
    const [userInfo, setUserInfo] = useState([])
    const [events, setEvents] = useState([])
  
    useEffect(() => {
      let getUserInfo = async () => {
        let respUser = await fetch('http://localhost:3000/api/admin/user',{
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: session?.user?.email})
        })
  
        let user = await respUser.json()
        setUserInfo(user)
        setEvents(user.events)
      }
  
      getUserInfo()
  
    }, [session])

    return [
      userInfo, 
      session,
      events
    ] as const
}