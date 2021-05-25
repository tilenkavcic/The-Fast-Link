import { logRedirect } from "../../../lib/pages";

export default function Post() {
	return <>redirecting ...</>;
}

export async function getServerSideProps({ params }) {
	console.log(params);
	// if (params.id == "json") throw new Error("error");

	try {
		let postData = await logRedirect(params);
		return {};
	} catch (e) {
		console.log(e);
		throw new Error("error");
	}
}
