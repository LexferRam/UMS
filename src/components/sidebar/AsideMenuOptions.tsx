
import { adminNavLinks, specialistNavLinks } from "./constants/linksByUser";
import { getSession } from "@/util/authOptions";
import ItemsMenuOptions from "./ItemsMenuOptions";

const AsideMenuOptions = async () => {

    const session = await getSession() as any

    const arrayLinks = session?.role === 'admin' 
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

export default AsideMenuOptions