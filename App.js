import Providers from "./Provider";
import AppNavigation from "./navigations/AppNavigation";

export default function App() {
  return <Providers children={<AppNavigation />} />;
}
