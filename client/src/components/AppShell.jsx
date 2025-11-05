
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppShell({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "64vh" }}>{children}</main>
      <Footer />
    </>
  );
}
