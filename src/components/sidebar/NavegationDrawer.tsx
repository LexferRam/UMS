import { XCircleIcon } from "@heroicons/react/24/outline";
import { adminNavLinks, specialistNavLinks } from "./constants/linksByUser";
import ItemsMenuOptions from "./ItemsMenuOptions";
import { SwipeableDrawer } from "@mui/material";

export function DrawerWithNavigation({ open, setOpen, userInfo }: any) {
    const closeDrawer = () => setOpen(false);
    const openDrawer = () => setOpen(true);

    return (
        <SwipeableDrawer  className="z-50" open={open} onClose={closeDrawer} onOpen={openDrawer}>
            <div className="flex justify-end cursor-pointer p-8">
                <XCircleIcon className="h-10 w-10 text-gray-500" onClick={closeDrawer} />
            </div>
            <NavItems userInfo={userInfo} />
        </SwipeableDrawer>
    );
}

export const NavItems = ({ userInfo }: any) => {

    const arrayLinks = userInfo?.role === 'admin' 
        ? adminNavLinks 
        : specialistNavLinks;


    return (
        <>
            {arrayLinks?.map(item => (
                <div key={item.mainTitle} className="px-12">
                    <h4 className='rounded-md px-2 py-4 text-sm font-medium'>
                        {item.mainTitle}
                    </h4>

                    <ItemsMenuOptions item={item} />
                </div>
            ))}
        </>
    )
}