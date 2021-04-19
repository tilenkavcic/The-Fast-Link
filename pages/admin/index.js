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

	const uploadData = useCallback(
		async (data) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL("/api/addNewPage");
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
					uid: AuthUser.id,
				},
				body: JSON.stringify(data),
			});
			const respData = await response.json();
			if (!response.ok) {
				console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(respData)}`);
				return null;
			}
			return respData;
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

	return (
		<>
			<Head></Head>
			<h1>Admin panel</h1>
			<div>
				<Header email={AuthUser.email} signOut={AuthUser.signOut} />
				<div>
					<div>
						<h1>Hey there</h1>
						<h2>Your podcasts</h2>
						{userData.pages ? (
							<>
								<Formik
									initialValues={userData}
									onSubmit={async (pageName) => {
										const newArr = userData.pages.concat([{ title: pageName.newPage }]);
										const newUser = { ...userData, pages: newArr };
										console.log(newUser);
										await uploadData(newUser);
									}}
								>
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
													</div>
												)}
											</FieldArray>
											<Field id=" " name="newPage" placeholder="thepodcast" />
											<button type="submit">New</button>
										</Form>
									)}
								</Formik>
							</>
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
