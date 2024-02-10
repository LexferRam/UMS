import { Drawer } from "@material-tailwind/react";
import { NavItems } from "./AsideMenuOptions";
import { XCircleIcon } from "@heroicons/react/24/outline";

export function DrawerWithNavigation({ open, setOpen }: any) {
    const closeDrawer = () => setOpen(false);

    return (
        <Drawer placeholder='' className="z-50 p-8 bg-white" open={open} onClose={closeDrawer}>
            <div className="flex justify-end cursor-pointer">
                <XCircleIcon className="h-10 w-10 text-gray-500" onClick={closeDrawer} />
            </div>
            <NavItems />
        </Drawer>
    );
}