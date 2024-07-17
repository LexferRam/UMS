'use client'

import React from 'react'
import { useSelectedLayoutSegment } from 'next/navigation'
import {ButtonNav} from '../ButtonNav'

const ItemsMenuOptions = ({
    item
}: any) => {
    const activeSegment = useSelectedLayoutSegment()
    return (
        <>
            {item?.subItems?.map((subItem:any) => {
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
        </>
    )
}

export default ItemsMenuOptions