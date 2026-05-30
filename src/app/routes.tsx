import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { HeroSection } from "./components/HeroSection";
import { OperativeProfile } from "./components/OperativeProfile";
import { SkillsMatrix } from "./components/SkillsMatrix";
import { ServiceRecords } from "./components/ServiceRecords";
import { DataArchives } from "./components/DataArchives";
import { SecureChannel } from "./components/SecureChannel";

function HomePage()    { return <HeroSection />; }
function ProfilePage() { return <><OperativeProfile /><SkillsMatrix /></>; }
function ServicePage() { return <ServiceRecords />; }
function ProjectsPage(){ return <DataArchives />; }
function ContactPage() { return <SecureChannel />; }

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,        Component: HomePage    },
      { path: "profile",    Component: ProfilePage },
      { path: "service",    Component: ServicePage },
      { path: "projects",   Component: ProjectsPage },
      { path: "contact",    Component: ContactPage },
    ],
  },
]);
