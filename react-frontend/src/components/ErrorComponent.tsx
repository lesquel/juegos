import { memo } from "react";
import { useMatch, Link } from "@tanstack/react-router";

export const RootErrorComponent = memo(() => {
    const match = useMatch({ strict: false });
    const error = match?.error as Error | undefined;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white" >
            <div className="text-center space-y-6">
                <h1 className="text-9xl font-bold text-gradient bg-gradient-to-r from-red-500 to-pink-400 bg-clip-text text-transparent">
                    ¡Error!
                </h1>
                <h2 className="text-3xl font-bold">Algo salió mal</h2>
                <p className="text-gray-400 max-w-md">
                    Se produjo un error inesperado al procesar tu solicitud.
                </p>
                {error?.message && (
                    <p className="text-red-300 italic text-sm max-w-md">
                        Detalles: {error.message}
                    </p>
                )}
                <Link
                    to="/"
                    className="inline-block bg-gradient-to-r from-red-500 to-pink-400 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-300"
                >
                    Volver al inicio
                </Link>
            </div>
        </div >
    );
});
