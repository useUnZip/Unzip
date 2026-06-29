import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SignIn from "./pages/SignIn.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import { AppShell } from "./components/cansa/app/AppShell";
import Overview from "./pages/app/Overview";
import Leads from "./pages/app/Leads";
import Outreach from "./pages/app/Outreach";
import Proposals from "./pages/app/Proposals";
import Clients from "./pages/app/Clients";
import Content from "./pages/app/Content";
import Reports from "./pages/app/Reports";
import Templates from "./pages/app/Templates";
import Settings from "./pages/app/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Overview />} />
            <Route path="leads" element={<Leads />} />
            <Route path="outreach" element={<Outreach />} />
            <Route path="proposals" element={<Proposals />} />
            <Route path="clients" element={<Clients />} />
            <Route path="content" element={<Content />} />
            <Route path="reports" element={<Reports />} />
            <Route path="templates" element={<Templates />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
