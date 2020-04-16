import React from "react"
import "./App.css"
import MarkdownEditor from "./MarkdownEditor.js"

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <MarkdownEditor />
      </div>
    )
  }
}

export default App
