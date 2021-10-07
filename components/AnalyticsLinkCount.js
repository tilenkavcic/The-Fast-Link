import React from "react";
import styles from "./analyticsLinkCount.module.scss";

const AnalyticsLinkCount = ({ clicks }) => {
	return (
		<>
			<div className={styles.numberCircle}>{clicks}</div>
		</>
	);
};
export default AnalyticsLinkCount;
