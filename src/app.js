import React from "react"
import { Container, Row, Col } from "reactstrap"

import ProfilForm from "./form"

const App = () => {
	return (
		<Container>
			<Row>
				<Col>
					<ProfilForm />
				</Col>
			</Row>
		</Container>
	)
}

export default App
