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
			<h2 className={styles.description}>{postData.description}</h2>
			<div className={styles.picture}>
        <img src={postData.pictureUrl} alt={postData.title}></img>
      </div>

			<div className={styles.links}>
				{postData.links.map(({ title, url, pictureUrl, position }) => (
					<>
						<MainLink title={title} url={url} imgUrl={pictureUrl} position={position} />
						{position % 2 == 0 ? <div></div> : <br />}
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
	const postData = await getPageData(params.id);
	return {
		props: {
			postData,
		},
	};
}
