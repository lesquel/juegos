import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Navbar } from '@components/Navbar'
import { SaveAuthProvider } from '@modules/auth/providers/SaveAuthProvider'

import { useEffect } from "react";
import { GlobalClientData } from '@/services/globalClientData';



export function RootLayoutComponent() {
    useEffect(() => {
        GlobalClientData.getGlobalInfo()
            .then((globalInfo) => {
                const appName = globalInfo.site_name;
                document.title = appName;

            });
    }, []);

    return (
        <>
            <SaveAuthProvider />
            <div className="min-h-screen bg-gray-800">
                <Navbar />
                <main>
                    <Outlet />
                </main>
            </div>
            <TanStackRouterDevtools />
        </>
    );
}
