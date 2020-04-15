import React from "react"
import marked, { Renderer } from "marked"
import hljs from "highlight.js"
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync"
import DOMPurify from "dompurify"

// count the number of lines in a string.
const countLines = (str) => str.split("\n").length

const generateLineNumbers = (count) =>
  Array.from(Array(count).keys())
    .map((i) => i + 1)
    .join("\n")

// our component for displaying line numbers in the editor. Takes a simple count as the input.
function LineNumbers({ numLines }) {
  return (
    <ScrollSyncPane>
      <textarea
        className="md-editor-line-nums"
        defaultValue={generateLineNumbers(numLines)}
        tabIndex="-1"
        readOnly
      ></textarea>
    </ScrollSyncPane>
  )
}

// The MarkdownTextArea component.
class MarkdownTextArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorContents: props.editorContents,
    }

    this.handleOnChange = (e) => {
      e.persist()
      this.setState(() => {
        return {
          ...this.state,
          editorContents: e.target.value,
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

const renderMarkdown = (markdown) => {
  const renderer = new Renderer()
  const linkRenderer = renderer.link

  // make links open in a new tab.
  renderer.link = (href, title, text) =>
    linkRenderer
      .call(renderer, href, title, text)
      .replace(/^a /, '<a target="_blank" rel="nofollow" ')

  return {
    // sanitize the inputs, and pass it to the marked function, also passing in
    // our customized renderer, and tell it to use hljs for syntax highlighting
    // of code snippets.
    __html: DOMPurify.sanitize(
      marked(markdown, {
        renderer,
        highlight: (code) => hljs.highlightAuto(code).value,
      })
    ),
  }
}

// our rendering area functional component. Takes markdown as the input,
// and renders it.
function MarkdownRenderArea({ textToRender }) {
  return (
    <ScrollSyncPane>
      <div
        className="md-editor-renderarea"
        // 'dangerously' set the inner HTML here to the output of the renderMarkdown function.
        // We should be alright, as renderMarkdown sanitizes its input.
        dangerouslySetInnerHTML={renderMarkdown(textToRender)}
        tabIndex="-1"
      ></div>
    </ScrollSyncPane>
  )
}

// The MarkdownEditor component. Contains the textarea that users input their text into, as well
// as the rendering area that dipslays the rendered markdown.
class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorContents: props.defaultContents,
    }
  }

  // On change, we want to grab what's in the textarea.
  handleOnChange(event) {
    event.persist()
    this.setState(() => {
      return {
        ...this.state,
        editorContents: event.target.value,
      }
    })
  }

  render() {
    return (
      <ScrollSync>
        <div className="md-editor-container">
          <MarkdownTextArea
            editorContents={this.state.editorContents}
            // call our handleOnChange method every time the editor changes.
            onChangeHandler={(e) => this.handleOnChange(e)}
          />
          <MarkdownRenderArea textToRender={this.state.editorContents} />
        </div>
      </ScrollSync>
    )
  }
}

MarkdownEditor.defaultProps = {
  defaultContents: "",
}

export default MarkdownEditor
