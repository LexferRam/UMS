'use client'

import { useSelectedLayoutSegment } from "next/navigation";
import { ButtonNav } from "../ButtonNav";
import { adminNavLinks, specialistNavLinks } from "@/constants/linksByUser";
import { useUserInfo } from "@/hooks";

const AsideMenuOptions = () => (
    <div className="fixed overflow-y-scroll scrollbar-hide top-[100px] py-4 pr-4 mr-2 border-r-[0.1px] h-full">
        <NavItems />
    </div>
)

export const NavItems = () => {
    const activeSegment = useSelectedLayoutSegment()
    const [ userInfo ] = useUserInfo()
    const arrayLinks = userInfo[0]?.role === 'admin' 
        ? adminNavLinks 
        : specialistNavLinks;

    return (
        <>
            {arrayLinks?.map(item => (
                <>
                    <h4 className='rounded-md px-2 py-4 text-sm font-medium'>
                        {item.mainTitle}
                    </h4>
                    {item?.subItems?.map(subItem => {
                        let isActiveLink = (subItem.href.split('/')[2] || null) === activeSegment
                        return (
                            <ButtonNav
                                variant={isActiveLink ? 'active' : 'default'}
                                href={subItem.href}
                                iconComponent={subItem.iconComponent}
                                buttonTitle={subItem.buttonTitle}
                            />
                        )
                    })}
                </>
            ))}
        </>
    )
}

export default AsideMenuOptions