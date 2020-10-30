import React from "react"
import { render } from "react-dom"
import App from "./app"
import "core-js"
import "regenerator-runtime/runtime"
import "./scss/index.scss"

render(<App />, document.getElementById("app"))
