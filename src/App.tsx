import "./App.css";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type Route as RouteConfig, routes } from "./router/routes";
import { MainContentLayout } from "./layout/mainContentLayout";
import { Toaster } from "./components/ui/toaster";
import { WagmiProvider } from "wagmi";
import { config } from "./config/wagmiConfig";

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
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={new QueryClient()}>
          <MainContentLayout>
            <Toaster />
            <Routes>{renderRoutes(routes)}</Routes>
          </MainContentLayout>
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
