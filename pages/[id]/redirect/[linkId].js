import React, { useEffect } from "react";
import { logRedirect } from "../../../lib/pages";
import { useRouter } from "next/router";

export default function Post(props) {
	const router = useRouter();
	const pageName = router.query.url;
	console.log("routing to", pageName);
	useEffect(() => {
		window.location.href = pageName;
	}, []);

	return <>redirecting to {pageName}...</>;
}

export async function getServerSideProps({ params }) {
	try {
		let postData = await logRedirect(params.id, params.linkId);
		return {
			props: {},
		};
	} catch (e) {
		console.log(e);
		throw new Error("error");
	}
}
