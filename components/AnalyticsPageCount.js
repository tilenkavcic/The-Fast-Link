import React from "react";
import styles from "./analyticsPageCount.module.scss";

const AnalyticsPageCount = ({ clicks }) => {
	return (
		<>
			<div className={styles.numberCircle}>{clicks}</div>
		</>
	);
};
export default AnalyticsPageCount;
