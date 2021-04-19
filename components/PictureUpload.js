import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";

export default function PictureUpload() {
	function handleSubmit() {}
	return (
		<>
			<Formik initialValues={{}} onSubmit={handleSubmit}>
				{({ values }) => (
					<>
						<label for="file">Picture upload</label>
						<input
							id="file"
							name="file"
							type="file"
							onChange={(event) => {
								setFieldValue("file", event.currentTarget.files[0]);
							}}
							className="form-control"
						/>
					</>
				)}
			</Formik>
		</>
	);
}
