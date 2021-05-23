import { getPageData } from "../../lib/pages";
import styles from "./embed.module.scss";
import Layout from "../../components/Layout";
import MainLink from "../../components/MainLink";
import { Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

export default function Post({ postData }) {
	return (
		<>
			<style jsx global>{`
				main, html, body {
					background-color: rgb(255,255,255,0);
				}
			`}</style>

			<Layout title={postData.title} className={styles.layout}>
				<Row className={styles.links}>
					{postData.links.map(({ title, url, pictureUrl, position, activated }, index) => (
						<React.Fragment key={index}>
								<a href={url} className={styles.rectangle}>
								<h1 className={styles.title}>{title}</h1>
								<div className={styles.pictureContainer}>{pictureUrl != "" ? <img src={pictureUrl} alt={title} className={styles.pictureInside} /> : ""}</div>
							</a>

							{/* <MainLink title={title} url={url} imgUrl={pictureUrl} position={position} /> */}
						</React.Fragment>
					))}
				</Row>
				<Row className={styles.bottomLogo}>
					<Link href="/">The Fast Link</Link>
				</Row>
			</Layout>
		</>
	);
}

export async function getServerSideProps({ params }) {
	// if (params.id == "json") throw new Error("error");
	try {
		let postData = await getPageData(params.id);
		let filteredLinks = postData.links.filter((link) => !(!link.activated || link.url == ""));
		postData.links = filteredLinks;
		return {
			props: {
				postData,
			},
		};
	} catch (e) {
		console.log(e);
		throw new Error("error");
	}
}
