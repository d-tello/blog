import "../styles/globals.css";
import "../styles/nprogress.css";
import NProgress from "nprogress";
import Router from "next/router";
import { ThemeProvider } from "next-themes";
import { Provider as AuthProvider } from "next-auth/client";
import { Toaster } from "react-hot-toast";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider session={pageProps.session}>
      <ThemeProvider enableSystem={true} attribute="class">
        <Component {...pageProps} />
        {/* <Toaster /> */}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
