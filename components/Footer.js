import styles from "./footer.module.scss";
import Link from "next/link";
import { Row } from "react-bootstrap";

export default function Footer() {
	return (
		<Row className={styles.wrapper}>
			<Link href="/">The Fast Link</Link>
		</Row>
	);
}
