import React from "react"
import { Container, Row, Col } from "reactstrap"

import PDF from "./pdf"
import ProfilForm from "./form"

const App = () => {
	return (
		<Container fluid>
			<Row>
				<Col>
					<ProfilForm />
				</Col>
				<Col>
					<PDF />
				</Col>
			</Row>
		</Container>
	)
}

export default App
