import React from "react"
import marked from "marked"
import hljs from "highlight.js"
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync"

const countLines = str => str.split("\n").length

const generateLineNumbers = count =>
  Array.from(Array(count).keys())
    .map(i => i + 1)
    .join("\n")

function LineNumbers(props) {
  return (
    <ScrollSyncPane>
      <textarea
        className="md-editor-line-nums"
        defaultValue={generateLineNumbers(props.numLines)}
        readOnly
      ></textarea>
    </ScrollSyncPane>
  )
}

class MarkdownTextArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorContents: props.editorContents
    }

    this.handleOnChange = e => {
      e.persist()
      this.setState(() => {
        return {
          ...this.state,
          editorContents: e.target.value
        }
      })
      props.onChangeHandler(e)
    }
  }

  componentDidMount() {}

  render() {
    return (
      <div className="md-editor-editarea">
        <LineNumbers
          key={countLines(this.state.editorContents)}
          numLines={countLines(this.state.editorContents)}
        />
        <ScrollSyncPane>
          <textarea
            onChange={this.handleOnChange}
            defaultValue={this.state.editorContents}
            className="md-editor-textarea"
            autoFocus
          ></textarea>
        </ScrollSyncPane>
      </div>
    )
  }
}

function MarkdownRenderArea(props) {
  return (
    <ScrollSyncPane>
      <div className="md-editor-renderarea">{props.textToRender}</div>{" "}
    </ScrollSyncPane>
  )
}

class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorContents: props.defaultContents
    }
  }

  handleOnChange(event) {
    event.persist()
    this.setState(() => {
      return {
        ...this.state,
        editorContents: event.target.value
      }
    })
  }

  render() {
    return (
      <ScrollSync>
        <div className="md-editor-container">
          <MarkdownTextArea
            editorContents={this.state.editorContents}
            onChangeHandler={e => this.handleOnChange(e)}
          />
          <MarkdownRenderArea textToRender={this.state.editorContents} />
        </div>
      </ScrollSync>
    )
  }
}

export default MarkdownEditor
