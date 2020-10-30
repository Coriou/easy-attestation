import React, { cloneElement } from "react"
import {
	Container,
	Row,
	Col,
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	FormText,
} from "reactstrap"
import Joi from "joi"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import Cleave from "cleave.js/react"
import { useLocalStorage } from "react-use-storage"
import Signature from "./signature"

const schema = Joi.object({
	prenom: Joi.string().min(3).required(),
	nom: Joi.string().min(3).required(),
	dateNaissance: Joi.string().min(9).max(10).required(),
	lieuNaissance: Joi.string().min(3).required(),
	adresse: Joi.string().min(3).required(),
	ville: Joi.string().min(3).required(),
	codePostal: Joi.string().regex(/^\d+$/).min(5).max(5).required(),
})

const ProfilForm = () => {
	const [formData, setFormData, removeFormData] = useLocalStorage("formData")

	const { register, handleSubmit, errors } = useForm({
		resolver: joiResolver(schema),
	})

	// Display help or error message
	const helpOrError = (key, placeholder) => {
		let message = ""

		if (errors[key]) {
			const error = errors[key]
			if (error.type === "string.empty" || error.type === "any.required")
				message = "Ce champ est requis"
			else if (error.type === "string.max") message = "Trop long"
			else if (error.type === "string.min") message = "Trop court"
			else if (error.type === "any.only") message = "Valeur interdite"
			else message = "Mauvais format"
		}

		return message ? (
			<FormText color="danger">{message}</FormText>
		) : (
			<FormText color="secondary">
				<b>Exemple</b>: {placeholder}
			</FormText>
		)
	}

	// Handle form submit
	const onSubmit = data => {
		setFormData(data)

		return false
	}

	const FormInput = ({
		name,
		displayName,
		placeholder,
		type = "text",
		children,
	}) => {
		return (
			<FormGroup>
				<Label for={name}>{displayName}</Label>
				{children ? (
					cloneElement(children, {
						type: type,
						name: name,
						id: name,
						placeholder: placeholder,
						value: formData?.[name],
						htmlRef: register,
					})
				) : (
					<Input
						type={type}
						name={name}
						id={name}
						placeholder={placeholder}
						defaultValue={formData?.[name]}
						innerRef={register}
					/>
				)}
				{helpOrError(name, placeholder)}
			</FormGroup>
		)
	}

	return (
		<Container>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row>
					<Col>
						<FormInput
							name="prenom"
							displayName="Prénom"
							placeholder="Camille"
						/>

						<FormInput name="nom" displayName="Nom" placeholder="Dupont" />
					</Col>

					<Col>
						<FormInput
							name="dateNaissance"
							displayName="Date de naissance"
							placeholder="01/01/1970"
						>
							<Cleave
								options={{
									blocks: [2, 2, 4],
									delimiter: "/",
									numericOnly: true,
								}}
								className="form-control"
							/>
						</FormInput>

						<FormInput
							name="lieuNaissance"
							displayName="Lieu de naissance"
							placeholder="Paris"
						/>
					</Col>
				</Row>

				<Row>
					<Col>
						<FormInput
							name="adresse"
							displayName="Adresse"
							placeholder="99 avenue de France"
						/>

						<FormInput name="ville" displayName="Ville" placeholder="Paris" />

						<FormInput
							name="codePostal"
							displayName="Code postal"
							placeholder="75001"
						/>
					</Col>
				</Row>

				<Row>
					<Col>
						<Label>Signature</Label>
						<Signature />
					</Col>
				</Row>

				<Row>
					<Col>
						<Button type="submit" color="primary" className="mt-4">
							GÉNÉRER ATTESTATION
						</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	)
}

export default ProfilForm
