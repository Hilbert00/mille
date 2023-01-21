import Link from "next/link";
import { useEffect, useState } from "react";

import { TbHexagon } from "react-icons/tb";
import { TbUsers } from "react-icons/tb";
import { TbSwords } from "react-icons/tb";

export default function Menubar(props: { active: number }) {
    const [menus, setMenus] = useState([
        { name: "Social", color: "#00A6ED", icon: <TbUsers className="inline-block" />, page: "/social" },
        { name: "Solo", color: "#F6511D", icon: <TbHexagon className="inline-block" />, page: "/" },
        { name: "Duelo", color: "#FFB400", icon: <TbSwords className="inline-block" />, page: "/duel" },
    ]);

    useEffect(() => {
        const menusUpdated = menus.map((menu, i) => {
            if (props.active !== i) {
                menu.color = "";
            }
            return menu;
        });

        setMenus(menusUpdated);
    }, []);

    return (
        <nav className="fixed bottom-0 w-full border-t border-[#b9b9b9] bg-primary-white py-1 dark:border-[#000] dark:bg-primary">
            <ul className="mx-auto flex w-full max-w-[calc(100vw-40px)] items-center justify-between md:max-w-3xl">
                {menus.map((menu, i) => {
                    return (
                        <li key={i} className="w-16">
                            <Link href={menu.page} className="flex flex-col text-center">
                                <span style={{ color: menu.color }} className="text-4xl sm:text-4xl">
                                    {menu.icon}
                                </span>
                                <span style={{ color: menu.color }}>{menu.name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
