import { getAllPageIds, getPageData } from "../lib/pages";
import Head from "next/head";
import styles from "./id.module.scss";

import Layout from "../components/Layout";
import MainLink from "../components/MainLink";
import Footer from "../components/Footer";

export default function Post({ postData }) {
	return (
		<Layout title={postData.title}>
			<Head>
				<title>{postData.title}</title>
			</Head>

			<h1 className={styles.title}>{postData.title}</h1>
			{styles.description ? <h2 className={styles.description}>{postData.description}</h2> : ""}
			{postData.pictureUrl ? (
				<div className={styles.picture}>
					<img src={postData.pictureUrl} alt={postData.title}></img>
				</div>
			) : (
				""
			)}

			<div className={styles.links}>
				{postData.links.map(({ title, url, pictureUrl, position, activated }, index) => (
					<>
						<MainLink key={index} title={title} url={url} imgUrl={pictureUrl} position={position} />
						{index % 2 != 0 && index != postData.links.length - 1 ? <br /> : ""}
					</>
				))}
			</div>
			<Footer />
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
