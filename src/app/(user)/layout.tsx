import { Suspense } from "react";
import Loading from "../loading";
import Link from "next/link";
import { checkRole } from "@/lib/utils/role";
import { FaWhatsapp } from "react-icons/fa6";
import { TopBanner } from "@/components/banner/top-banner";
import { BannerProvider } from "@/lib/context/BannerContext";

type Props = {
  children: React.ReactNode;
};

const UserLayout = async (props: Props) => {
  const isAdmin = checkRole("admin");

  return (
    <div className="max-w-screen-lg mx-auto">
      {isAdmin ? (
        <div className="bg-neutral-800 grid place-items-center justify-center gap-4 grid-flow-col p-2 text-sm">
          You an admin
          <Link className="text-primary font-bold" href="/admin">
            Go to dashboard
          </Link>
        </div>
      ) : null}
      <Suspense fallback={<Loading />}>
        {/* <div
          className={
            "z-[99999999] w-fit px-2 rounded-sm md:px-16 mx-auto  grid place-items-center scale-[0.5]  py-2 text-xs dark:bg-neutral-950 bg-pink-200"
          }
        >
          We&apos;re pleased to announce that we&apos;ve resolved the WhatsApp.
          we are now ready to process your transactions through{" "}
          <span className="text-green-500 font-bold text-lg flex align-middle place-items-center justify-start  gap-3 mt-1">
            <FaWhatsapp color={"green"} size={24} /> 08165837925
          </span>
        </div> */}
        <BannerProvider>
          <TopBanner />
          {props.children}
        </BannerProvider>
      </Suspense>
    </div>
  );
};

export default UserLayout;
