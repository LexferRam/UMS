'use client'

import { useSelectedLayoutSegment } from "next/navigation";
import { ButtonNav } from "../ButtonNav";
import { useUserInfo } from "@/hooks";
import { adminNavLinks, specialistNavLinks } from "./constants/linksByUser";
import SidebarSkeleton from "./SidebarSkeleton";

const AsideMenuOptions = () => (
    <div className="fixed overflow-y-scroll scrollbar-hide top-[100px] py-4 pr-4 mr-2 border-r-[0.1px] h-[100vh]">
        <NavItems />
    </div>
)

export const NavItems = () => {
    const activeSegment = useSelectedLayoutSegment()
    const [ userInfo, isLoadingUserInfo ] = useUserInfo()

    if (isLoadingUserInfo) return <SidebarSkeleton />

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
                    {item?.subItems?.map(subItem => {
                        let isActiveLink = (subItem.href.split('/')[2] || null) === activeSegment
                        return (
                            <ButtonNav
                                key={subItem.buttonTitle}
                                variant={isActiveLink ? 'active' : 'default'}
                                href={subItem.href}
                                iconComponent={subItem.iconComponent}
                                buttonTitle={subItem.buttonTitle}
                            />
                        )
                    })}
                </div>
            ))}
        </>
    )
}

export default AsideMenuOptions