import { redirect } from "next/navigation";
import Confirm from "./Confirm";
import { checkIsAdmin } from "../utils/adminActions/checkAdmin";
import { getUserCookie } from "../utils/getUserCookie";
import { cookies } from "next/headers";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

let notLogged = false;

const AdminRedirect = async (props: Props) => {
  const uc = await getUserCookie();
  const state = cookies().get("state")?.value;

  if (!uc) {
    return redirect("/sign-in");
  }

  if (uc && state) {
    notLogged = true;

    return <Confirm isAdmin={notLogged}>{props.children}</Confirm>;
  } else {
    const fetchedUser = await checkIsAdmin();
    if (fetchedUser?.isAdmin) {
      notLogged = true;

      return <Confirm isAdmin={notLogged}>{props.children}</Confirm>;
    }
  }
};

export default AdminRedirect;
