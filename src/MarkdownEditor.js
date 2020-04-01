import React from "react"
import marked from "marked"
import hljs from "highlight.js"

function MarkdownTextArea(props) {
  let lineNums = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11"
  return (
    <div className="md-editor-editarea">
      <textarea cols="2" max-cols="20" className="md-editor-line-nums" readOnly>
        {lineNums}
      </textarea>
      <textarea
        onKeyUp={props.keyUpHandler}
        defaultValue={props.editorContents}
        className="md-editor-textarea"
        autoFocus
      ></textarea>
    </div>
  )
}

function MarkdownRenderArea(props) {
  return <div className="md-editor-renderarea">{props.textToRender}</div>
}

class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorContents: props.defaultContents
    }
  }

  handleOnKeyUp(event) {
    event.persist()
    this.setState(() => {
      return { editorContents: event.target.value }
    })
  }

  render() {
    return (
      <div className="md-editor-container">
        <MarkdownTextArea
          editorContents={this.state.editorContents}
          keyUpHandler={e => this.handleOnKeyUp(e)}
        />
        <MarkdownRenderArea textToRender={this.state.editorContents} />
      </div>
    )
  }
}

export default MarkdownEditor
