import { Formik } from "formik";
import next from "next";

export default function Thumb(nextProps) {
	console.log("asd", nextProps);
	if (!nextProps.file) {
		return;
	}

	const [state, setState] = useState({
		loading: false,
		thumb: undefined,
	});

	setState({ loading: true }, () => {
		let reader = new FileReader();

		reader.onloadend = () => {
			this.setState({ loading: false, thumb: reader.result });
		};

		reader.readAsDataURL(nextProps.file);
	});

	const { file } = nextProps.file;
	const { loading, thumb } = state;

	if (!file) {
		return null;
	}

	if (loading) {
		return <p>loading...</p>;
	}

	return (
		<img
			src={thumb}
			alt={file.name}
			className="img-thumbnail mt-2"
			height={200}
			width={200}
		/>
	);
}
