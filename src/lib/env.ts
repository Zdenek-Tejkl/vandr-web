import "server-only";

// Ostrý provoz na Vercelu: žádný demo režim ani záložní tajné klíče.
export const isProduction = () =>
  process.env.VERCEL_ENV === "production" || (process.env.NODE_ENV === "production" && Boolean(process.env.VERCEL));
