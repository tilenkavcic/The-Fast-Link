import { getPageData, logRedirect } from "../lib/pages";
import styles from "./id.module.scss";
import Layout from "../components/Layout";
import MainLink from "../components/MainLink";
import { Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {useEffect} from "react"

export default function Post({ postData, error }) {
	useEffect(() => {
		if (error) {
			const router = useRouter();
			router.push(`/`);
		}
	}, [])
	// React.useEffect(() => {
	// 	var referrer = document.referrer;
	// 	console.log("referrer url",referrer);
	// }, [])
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
							<Image src={postData.pictureUrl} alt={postData.title}></Image>
						</Col>
					</Row>
				) : (
					""
				)}
			</Container>

			<Row className={styles.links}>
				{postData.links.map(({ title, url, pictureUrl, position, activated, name }, index) => (
					<React.Fragment key={index}>
						<MainLink title={title} url={url} imgUrl={pictureUrl} position={position} pageName={postData.name} linkName={name} />
						{index % 2 != 0 && index != postData.links.length - 1 ? <hr className={styles.hr} /> : ""}
					</React.Fragment>
				))}
			</Row>
			<Container>
				<Row>
					<Col className={styles.bottomLogo}>
						<Link href="/">The Fast Link</Link>
					</Col>
				</Row>
			</Container>
		</Layout>
	);
}

export async function getServerSideProps({ params }) {
	try {
		let postData = await getPageData(params.id);
		let filteredLinks = postData.links.filter((link) => !(!link.activated || link.url == ""));
		postData.links = filteredLinks;
		let res = await logRedirect(params.id);
		return {
			props: {
				postData,
			},
		};
	} catch (e) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},		
		};
	}
}
