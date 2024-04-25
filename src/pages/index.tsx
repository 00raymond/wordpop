import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <div className={"h-screen w-screen fixed flex justify-center top-0 pt-12"}>
        <Header />
      </div>

        <div className={"bottom-0 flex-col flex space-y-7"}>


        <div className={"flex fixed inset-x-0 justify-center bottom-0 text-center space-x-4"}>

          <button>github</button>
          <button>discord</button>
        </div>
      </div>
    </>
  );
}
