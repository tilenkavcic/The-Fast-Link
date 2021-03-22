import React, { useCallback, useEffect, useState } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import Link from "next/link";
import Head from "next/head";
import Header from "../../components/Header";
import FullPageLoader from "../../components/FullPageLoader";
import getAbsoluteURL from "../../utils/getAbsoluteURL";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import AdminLinks from "../../components/AdminLinks";

const Page = () => {
	const AuthUser = useAuthUser();

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
				console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(data)}`);
				return null;
			}
			return data;
		},
		[AuthUser]
	);

	const [userData, setUserData] = useState({});

	useEffect(() => {
		const fetchUserData = async () => {
			const data = await fetchData("/api/getUserData");
			setUserData(data);
		};
		fetchUserData();
	}, [fetchData]);

	const makeNewPage = () => {
		
	}

	return (
		<>
			<Head></Head>
			<h1>Admin panel</h1>
			<div>
				<Header email={AuthUser.email} signOut={AuthUser.signOut} />
				<div>
					<div>
						<h1>Hey there</h1>
						<h2>Your pages</h2>
						{userData.pages ? (
							<Formik initialValues={userData}>
								{({ values }) => (
									<Form>
										<FieldArray name="pages">
											{({ insert, remove, push, move }) => (
												<div>
													{values.pages.length > 0 &&
														values.pages.map((pageData, index) => (
															<div key={index}>
																<Link
																	className="pageBtn"
																	href={{
																		pathname: "/admin/[pageIndx]",
																		query: { pageIndx: index },
																	}}
																>
																	<a>{pageData.title}</a>
																</Link>
															</div>
														))}
													<button type="button" className="addPageBtn" onClick={() => makeNewPage()}>
														New page
													</button>
												</div>
											)}
										</FieldArray>
									</Form>
								)}
							</Formik>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default withAuthUser({
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	LoaderComponent: FullPageLoader,
})(Page);
