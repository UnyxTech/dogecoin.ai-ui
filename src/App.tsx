import "./App.css";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type Route as RouteConfig, routes } from "./router/routes";
import { MainContentLayout } from "./layout/mainContentLayout";
import { Toaster } from "./components/ui/toaster";

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
      <QueryClientProvider client={new QueryClient()}>
        <MainContentLayout>
          <Toaster />
          <Routes>{renderRoutes(routes)}</Routes>
        </MainContentLayout>
      </QueryClientProvider>
    </>
  );
}

export default App;

function RouteComponent({ route }: { route: RouteConfig }) {
  const Com = route.Component;
  return <Com />;
}
