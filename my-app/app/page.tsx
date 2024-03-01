import Image from "next/image";
import styles from "./page.module.css";
import HouseList from "./component/page";

export default function Home() {
  return (
    <main>
      <HouseList />
    </main>
  );
}
