import { getAllPageIds, getPageData } from "../lib/pages";
import Head from "next/head";
import styles from "./id.module.scss";

import Layout from "../components/Layout";
import MainLink from "../components/MainLink";
import Footer from "../components/Footer";
import { Col, Container, Row } from "react-bootstrap";
import Link from "next/link";

export default function Post({ postData }) {
	return (
		<Layout title={postData.title}>
			<Container>
				<Row>
					<Col>
						<h1 className={styles.title}>{postData.title}</h1>
					</Col>
				</Row>
				<Row>
					<Col>{styles.description ? <h2 className={styles.description}>{postData.description}</h2> : ""}</Col>
				</Row>
				{postData.pictureUrl ? (
					<Row>
						<Col className={styles.picture}>
							<img src={postData.pictureUrl} alt={postData.title}></img>
						</Col>
					</Row>
				) : (
					""
				)}
			</Container>

			<Row className={styles.links}>
				{postData.links.map(({ title, url, pictureUrl, position, activated }, index) => (
					<>
						<MainLink key={index} title={title} url={url} imgUrl={pictureUrl} position={position} />
						{index % 2 != 0 && index != postData.links.length - 1 ? <hr className={styles.hr} /> : ""}
					</>
				))}
			</Row>
			<Container>
				<Row>
					<Col className={styles.bottomLogo}>
						<Link href="/">The Fast Link</Link>
					</Col>
				</Row>
			</Container>
			{/* <Footer /> */}
		</Layout>
	);
}

export async function getStaticPaths() {
	const paths = await getAllPageIds();
	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params }) {
	let postData = await getPageData(params.id);
	let filteredLinks = postData.links.filter((link) => !(!link.activated || link.url == ""));
	postData.links = filteredLinks;
	console.log(postData);
	return {
		props: {
			postData,
		},
	};
}
