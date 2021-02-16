import styles from "./footer.module.scss";
import Link from "next/link";

export default function Footer() {
  return (
    <div className={styles.wrapper}>
      <Link href="/">
        <a>
          <div className={styles.logo}></div>
        </a>
      </Link>
      <span class={styles.srOnly}>Provided by The Fast Link</span>
    </div>
  );
}
