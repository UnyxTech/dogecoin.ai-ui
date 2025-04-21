import "./App.css";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TomoEVMKitProvider } from '@tomo-inc/tomo-evm-kit';
import { type Route as RouteConfig, routes } from "./router/routes";
import { MainContentLayout } from "./layout/mainContentLayout";
import { Toaster } from "./components/ui/toaster";
import { WagmiProvider } from "wagmi";
import { tomoConfig } from "./config/wagmiConfig";
import { WrapperConnectWallet } from "./components/WrapperConnectWallet";
import '@tomo-inc/tomo-evm-kit/styles.css';

function App() {
  const renderRoutes = (routes: RouteConfig[]) => {
    return routes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={<RouteComponent route={route} />}
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };
  const isDev = import.meta.env.DEV;

  return (
    <>
      {isDev && (
        <div className="fixed z-[99999] bottom-0 left-0 p-2 bg-black text-white text-sm z-50">
          <span className="block xs:hidden">XS1</span>
          <span className="hidden xs:block sm:hidden">XS2</span>
          <span className="hidden sm:block md:hidden">SM</span>
          <span className="hidden md:block mdd:hidden">MD</span>
          <span className="hidden md:block placeHolder_screen:hidden">mdd</span>
          <span className="hidden mdd:block lg:hidden">MDD</span>
          <span className="hidden lg:block lgg:hidden">LG</span>
          <span className="hidden lgg:block xl:hidden">LGG</span>
          <span className="hidden xl:block 2xl:hidden">XL</span>
          <span className="hidden 2xl:block">2XL</span>
        </div>
      )}
      <WagmiProvider config={tomoConfig as any}>
        <QueryClientProvider client={new QueryClient()}>
          <TomoEVMKitProvider>
            <MainContentLayout>
              <Toaster />
              <WrapperConnectWallet />
              <Routes>{renderRoutes(routes)}</Routes>
            </MainContentLayout>
          </TomoEVMKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;

function RouteComponent({ route }: { route: RouteConfig }) {
  const Com = route.Component;
  return <Com />;
}
