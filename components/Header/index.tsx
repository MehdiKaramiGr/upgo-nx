import Image from "next/image";
import Link from "next/link";
import HeaderLinks from "./header-links";
import ThemeChangeButton from "./theme-change-button";
import UserBox from "./user-box";

const Header = () => {
  return (
    <header
      className="relative flex justify-between items-center shadow-md p-4 h-15 overflow-hidden text-white dark:text-black transition-all duration-300"
      style={{ backgroundColor: "transparent !important" }}>
      <div className="top-0 right-0 bottom-0 left-0 -z-1 absolute bg-linear-to-r from-secondary-500 to-primary-400 opacity-30 container"></div>
      <div className="top-0 right-0 bottom-0 left-0 -z-10 absolute bg-linear-to-r from-secondary-500 to-primary-400"></div>
      <Link className="flex" href="/">
        <Image
          src="/nx-light.png"
          alt="Next.js logo"
          width={60}
          height={20}
          className="dark:hidden block"
        />
        <Image
          src="/nx-dark.png"
          alt="Next.js logo"
          width={60}
          height={20}
          className="hidden dark:block"
        />
        <h1 className="font-semibold text-2xl tracking-tight">
          UpGo <span className="text-transparent">NX</span>{" "}
        </h1>
      </Link>
      <div className="flex justify-center items-center gap-5">
        <HeaderLinks />
        <ThemeChangeButton />
        <UserBox />
      </div>
    </header>
  );
};

export default Header;
