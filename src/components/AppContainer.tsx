import { NavigationBar } from "@/components/SearchBar";
import { ContentArea } from "@/components/ContentArea";

export const Main = () => {
  return (
    <div className="flex flex-col h-screen items-center">
      <NavigationBar />
      <ContentArea />
    </div>
  );
};
