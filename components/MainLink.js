import styles from "./mainLink.module.scss";

export default function MainLink({ title, url, imgUrl, position, pageName, linkName }) {
	const redirectUrl = `/${pageName}/redirect/${linkName}?url=${url}`
	return (
		<a href={redirectUrl} className={styles.rectangle}>
			<h1 className={styles.title}>{title}</h1>
			<div className={styles.pictureContainer}>
				{imgUrl != "" ? <img src={imgUrl} alt={title} className={styles.picture} /> : ""}
			</div>
		</a>
	);
}
