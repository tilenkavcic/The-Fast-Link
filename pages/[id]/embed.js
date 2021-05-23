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
			{/* <style jsx>{`
				.body {
					background-color: rgba(255, 255, 255, 0);
				}
			`}</style> */}

			<Layout title={postData.title} className={styles.layout}>
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
					{postData.links.map(({ title, url, pictureUrl, position, activated }, index) => (
						<React.Fragment key={index}>
							<MainLink title={title} url={url} imgUrl={pictureUrl} position={position} />
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
