// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "el";

  return {
    locale,
    // Note: If your messages folder is in the root, this path is correct:
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
