import { Drawer } from "@material-tailwind/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { adminNavLinks, specialistNavLinks } from "./constants/linksByUser";
import ItemsMenuOptions from "./ItemsMenuOptions";

export function DrawerWithNavigation({ open, setOpen, userInfo }: any) {
    const closeDrawer = () => setOpen(false);

    return (
        <Drawer placeholder='' className="z-50 p-8 bg-white" open={open} onClose={closeDrawer}>
            <div className="flex justify-end cursor-pointer">
                <XCircleIcon className="h-10 w-10 text-gray-500" onClick={closeDrawer} />
            </div>
            <NavItems userInfo={userInfo} />
        </Drawer>
    );
}

export const NavItems = ({ userInfo }: any) => {

    // if (isLoadingUserInfo) return <SidebarSkeleton />

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