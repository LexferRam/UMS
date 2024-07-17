
import { adminNavLinks, specialistNavLinks } from "./constants/linksByUser";
// import SidebarSkeleton from "./SidebarSkeleton";
import ItemsMenuOptions from "./ItemsMenuOptions";
import { headers } from "next/headers";

export const getUserResp = async () => {
    try {
      const userResp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/api/admin/user`,
        {
          headers: headers(),
          next: {
            revalidate: 5000 // revalidate after 1 day ==>  ISR
          }
        }
      )
      const userResponse = await userResp.json()
      return userResponse
    } catch (error) {
      console.error(error)
    }
  }

const AsideMenuOptions = async () => {

    const userInfo: any = await getUserResp()

    const arrayLinks = userInfo[0]?.role === 'admin' 
        ? adminNavLinks 
        : specialistNavLinks;
    
    return(
    <div className="fixed overflow-y-scroll scrollbar-hide top-[100px] py-4 pr-4 mr-2 border-r-[0.1px] h-[100vh]">
       {arrayLinks?.map(item => (
                <div key={item.mainTitle}>
                    <h4 className='rounded-md px-2 py-4 text-sm font-medium'>
                        {item.mainTitle}
                    </h4>

                    <ItemsMenuOptions item={item} />
                </div>
            ))}
    </div>
)}

export const NavItems = async () => {

    // if (isLoadingUserInfo) return <SidebarSkeleton />
    const userInfo: any = await getUserResp()

    const arrayLinks = userInfo[0]?.role === 'admin' 
        ? adminNavLinks 
        : specialistNavLinks;


    return (
        <>
            {arrayLinks?.map(item => (
                <div key={item.mainTitle}>
                    <h4 className='rounded-md px-2 py-4 text-sm font-medium'>
                        {item.mainTitle}
                    </h4>

                    <ItemsMenuOptions item={item} />
                </div>
            ))}
        </>
    )
}

export default AsideMenuOptions