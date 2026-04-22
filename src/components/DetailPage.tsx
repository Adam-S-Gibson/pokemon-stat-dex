import { NavigationBar } from "@/components/NavigationBar";
import { ContentArea } from "@/components/ContentArea";

export const DetailPage = () => {
  return (
    <div className="flex flex-col h-screen items-center">
      <NavigationBar />
      <ContentArea />
    </div>
  );
};
