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
                const faviconUrl = globalInfo.site_icon;
                document.title = appName;
                let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
                if (!favicon) {
                    favicon = document.createElement("link") as HTMLLinkElement;
                    favicon.rel = "icon";
                    document.head.appendChild(favicon);
                }

                // Establece el nuevo ícono
                favicon.href = faviconUrl;

            });
    }, []);

    return (
        <>
            <SaveAuthProvider />
            <div className="app-layout app-container">
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20">
                    <Navbar />
                    <div className="main-content">
                        <div className="content-wrapper">
                            <main className="py-8 sm:py-12 md:py-16">
                                <Outlet />
                            </main>
                        </div>
                    </div>
                </div>
            </div>
            <TanStackRouterDevtools />
        </>
    );
}
