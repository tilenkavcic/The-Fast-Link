import styles from "./footer.module.scss";
import Link from "next/link";
import { Row, Button, Col } from "react-bootstrap";
import { useEffect } from "react";

export default function Footer() {
	return (
		<>
			<Row className={styles.wrapper}>
				<Link href="/">The Fast Link</Link>
			</Row>
			<Row className={styles.feedback}>
				<a href="https://p2qcnnnd216.typeform.com/to/a5XRmUvV" className={styles.feedbackLink} data-hide-footer="true" target="_blank">
					Report a bug
				</a>
				&emsp;
				<a href="https://p2qcnnnd216.typeform.com/to/zovRfPGp" className={styles.feedbackLink} data-hide-footer="true" target="_blank">
					Feedback
				</a>
			</Row>
		</>
	);
}
