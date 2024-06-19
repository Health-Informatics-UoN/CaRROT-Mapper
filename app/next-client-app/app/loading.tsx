import { BeatLoader } from "react-spinners";
import config from "@/tailwind.config";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <BeatLoader
        color={`${config.theme.extend.colors.carrot.DEFAULT}`}
        loading={true}
        size={20}
        style={{ margin: "0 auto" }}
      />
      <p className="mt-3 text-lg font-semibold text-gray-700">Loading...</p>
    </div>
  );
}
