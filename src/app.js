import React, { useEffect, useState } from "react"
import { generatePdf } from "./pdf"
import { Document, Page } from "react-pdf/dist/esm/entry.parcel"
import { useLocalStorage } from "react-use-storage"
import { Container, Row, Col } from "reactstrap"
import certificate from "./certificate.pdf"

import ProfilForm from "./form"

const App = () => {
	const [pdf, setPDF] = useState({ blob: false, bytes: false })
	const [formData] = useLocalStorage("formData")
	const [canvasImage] = useLocalStorage("signatureImage")

	useEffect(() => {
		genCertificate(formData, canvasImage)
	}, [formData, canvasImage])

	const genCertificate = (formData, canvasImage) => {
		const profile = {
			lastname: formData?.nom || "",
			firstname: formData?.prenom || "",
			birthday: formData?.dateNaissance || "",
			placeofbirth: formData?.lieuNaissance || "",
			address: formData?.adresse || "",
			zipcode: formData?.codePostal || "",
			city: formData?.ville || "",
		}

		generatePdf(profile, "achats", certificate, canvasImage)
			.then(([bytes, blob]) => {
				blob = window.URL.createObjectURL(blob)
				setPDF({ bytes, blob })
			})
			.catch(console.error)
	}

	return (
		<Container fluid>
			<Row>
				<Col>
					<ProfilForm />
				</Col>
				<Col>
					{pdf.bytes && (
						<a href={pdf.blob} className="btn btn-primary" target="_blank">
							Télécharger
						</a>
					)}

					{pdf.bytes && (
						<Document file={{ data: pdf.bytes }}>
							<Page pageNumber={1} />
							<Page pageNumber={2} />
						</Document>
					)}
				</Col>
			</Row>
		</Container>
	)
}

export default App
