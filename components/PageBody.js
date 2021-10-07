import React, { useCallback, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import {
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
	AuthAction,
} from "next-firebase-auth";
import getAbsoluteURL from "../utils/getAbsoluteURL";
import AdminLinks from "./AdminLinks";
import AdminPageTitle from "./AdminPageTitle";
import { PageContext } from "../context/PageContext";

const PageBody = () => {
	const AuthUser = useAuthUser();
	const router = useRouter();
	const { pageName } = router.query;

	const [userData, setUserData] = useState({});
	const [pageData, setPageData] = useContext(PageContext);

	const fetchData = useCallback(
		async (endpointUrl) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL(endpointUrl);
			const response = await fetch(endpoint, {
				method: "GET",
				headers: {
					Authorization: token,
					uid: AuthUser.id,
				},
			});
			const data = await response.json();
			if (!response.ok) {
				console.error(
					`Data fetching failed with status ${
						response.status
					}: ${JSON.stringify(data)}`
				);
				return null;
			}
			return data;
		},
		[AuthUser]
	);

	const fetchPage = useCallback(
		async (endpointUrl, thisPage) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL(endpointUrl);
			const response = await fetch(endpoint, {
				method: "GET",
				headers: {
					Authorization: token,
					uid: AuthUser.id,
					page: thisPage,
				},
			});
			const data = await response.json();
			if (!response.ok) {
				console.error(
					`Data fetching failed with status ${
						response.status
					}: ${JSON.stringify(data)}`
				);
				return null;
			}
			return data;
		},
		[AuthUser]
	);

	useEffect(() => {
		const fetchUserPageData = async () => {
			const data = await fetchData("/api/getUserData");
			setUserData(data);
			console.log(pageName);
			const ret = await fetchPage("/api/getPageData", pageName);
			setPageData(ret);
		};
		fetchUserPageData();
	}, [fetchData, fetchPage]);

	return (
		<>
			<h1>{pageData.name}</h1>
			{pageData.title ? (
				<>
					<AdminLinks />
				</>
			) : (
				// no page title (this is a new page)
				<>
					<AdminPageTitle />
				</>
			)}
		</>
	);
};

export default PageBody;
