// "use client";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { crypto } from "../../../../../../../public/data/crypto";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import Cookies from "js-cookie";
// import { postToast } from "@/components/postToast";
// import { useRouter } from "next/navigation";
// import { startCryptoChat } from "@/lib/utils/actions";
// import { toast } from "sonner";
// import { SunIcon } from "@heroicons/react/24/outline";
// import Loading from "@/app/loading";

// type Props = {
//   params: {
//     id: string;
//   };
// };

// const CryptoPage = ({ params }: Props) => {
//   const [mount, setMount] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const user = Cookies.get("user");

//   const data = crypto.find((crypt) => {
//     return crypt.id === `crypto/${params.id}`;
//   });

//   const [price, setPrice] = useState<number>();

//   useEffect(() => {
//     if (!mount) {
//       setMount(true);
//     }

//     if (!user && mount) {
//       postToast("Not signed in!", {
//         description: "You can only sell a gift card when you are logged in",
//         action: {
//           label: "Login",
//           onClick: () => {
//             router.push("/sign-in");
//           },
//         },
//         duration: 8000,
//       });
//     }
//   }, [mount, router, user]);

//   if (!data) {
//     return (
//       <div className="max-w-screen-sm text-center text-xl p-16 mx-auto text-black/40 dark:text-white/60">
//         <h4 className="text-3xl font-bold mb-8 text-black dark:text-white">
//           Not found
//         </h4>
//         Looks like we dont buy that crypto. Try again soon.
//         <div className="mt-8 text-left p-4">
//           <p className="px-6 text-black">Here is what we buy:</p>
//         </div>
//       </div>
//     );
//   }

//   const startChatAction = startCryptoChat.bind(null, data);

//   const selectsWhatsapp = async () => {
//     const cryptoInfo = {
//       cryptoTitle: data.name,
//       price: `$${price}`,
//     };

//     const whatsappMessage = `Trade a ${cryptoInfo.cryptoTitle} worth ${cryptoInfo.price}`;
//     const whatsappLink = `https://api.whatsapp.com/send?phone=${
//       process.env.WHATSAPP_HANDLE
//     }&text=${encodeURIComponent(whatsappMessage)}`;

//     window.location.href = whatsappLink;
//   };

//   const submitChatAction = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const res = await startChatAction(
//         new FormData(e.target as HTMLFormElement)
//       );

//       if (!res?.logged) {
//         toast("Error!", {
//           description: "You need to login to continue",
//           dismissible: true,
//           duration: 4500,
//           action: {
//             label: "Login",
//             onClick: () => router.push("/sign-in"),
//           },
//         });
//         setLoading(false);
//       }
//       if (res?.proceed) {
//         router.refresh();
//         router.push(`/chat/${res.link}`);
//       }
//     } catch (error) {
//       toast("Error!", {
//         description: "An error occured!. Try again",
//         dismissible: true,
//         duration: 3500,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // return (
//   //   <>
//   //     {loading && <Loading />}
//   //     <div className="max-w-screen-md pb-6 mx-auto p-4 md:mt-4 mt-0 space-y-8 justify-center">
//   //       <div className="grid place-items-center justify-center gap-6">
//   //         <h5 className="text-center text-xl w-[60vw]">
//   //           Sell us your {data.name}
//   //         </h5>
//   //         <Image
//   //           src={data.image}
//   //           width={65}
//   //           height={65}
//   //           alt="Vender Logo"
//   //           priority={true}
//   //           className="text-xs"
//   //         />
//   //       </div>
//   //       <form onSubmit={submitChatAction} className="space-y-8">
//   //         <div className="max-w-md mx-auto">
//   //           <Input
//   //             onChange={(e) => setPrice(parseFloat(e.target.value))}
//   //             placeholder="Enter amount"
//   //             className="py-6"
//   //             name="price"
//   //           />
//   //         </div>

//   //         <div className="grid grid-flow-row gap-4 max-w-md mx-auto place-items-center">
//   //           <Button
//   //             disabled={(price && price <= 0) || !price || !user || loading}
//   //             type="submit"
//   //             className="py-6 w-full"
//   //           >
//   //             {loading ? (
//   //               <>
//   //                 <SunIcon width={18} className="animate-spin mr-1" /> Please
//   //                 wait...
//   //               </>
//   //             ) : (
//   //               "Live chat"
//   //             )}
//   //           </Button>
//   //           or
//   //           <Button
//   //             disabled={(price && price <= 0) || !price || loading}
//   //             onClick={() => selectsWhatsapp()}
//   //             type="button"
//   //             className="py-6 w-full"
//   //             variant={"outline"}
//   //           >
//   //             Continue to WhatsApp
//   //           </Button>
//   //         </div>
//   //       </form>

//   //       <div className="mt-10 text-center font-light text-[0.8em]">
//   //         Please read our{" "}
//   //         <Link
//   //           href={"/terms"}
//   //           className=" text-secondary font-semibold underline"
//   //         >
//   //           terms and conditions
//   //         </Link>
//   //       </div>
//   //     </div>
//   //   </>
//   // );
// };

// export default CryptoPage;

const CryptoPage = () => {
  return (
    <div className="max-w-screen-sm text-center text-xl p-16 mx-auto text-black/40 dark:text-white/60 flex flex-col gap-4 place-items-center justify-center h-[60dvh]">
      <h4 className="text-3xl font-bold">Under Improvement</h4>
      <p>
        We are working on improving your experience selling crypto. Please check
        back soon.
      </p>
    </div>
  );
};

export default CryptoPage;
