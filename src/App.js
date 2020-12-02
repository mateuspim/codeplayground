import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import Pusher from "pusher-js";
import pushid from "pushid";
import axios from "axios";

import "./App.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";

class App extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      html: "",
      css: "",
      js: ""
    };

    this.pusher = new Pusher("d1756448b16aae05eed0", {
      cluster: "ap3",
      forceTLS: true
    });

    this.channel = this.pusher.subscribe("editor");
  }

  componentDidUpdate() {
    this.runCode();
  }

  componentDidMount() {
    this.setState({
      id: pushid()
    });

    this.channel.bind("text-update", data => {
      const { id } = this.state;
      if (data.id === id) return;

      this.setState({
        html: data.html,
        css: data.css,
        js: data.js
      });
    });
  }

  syncUpdates = () => {
    const data = { ...this.state };

    axios
      .post("http://localhost:5000/update-editor", data)
      .catch(console.error);
  };

  runCode = () => {
    const { html, css, js } = this.state;

    const iframe = this.refs.iframe;
    const document = iframe.contentDocument;
    const documentContents = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script type="text/javascript">
          ${js}
        </script>
      </body>
      </html>
    `;

    document.open();
    document.write(documentContents);
    document.close();
  };

  render() {
    const { html, js, css } = this.state;
    const codeMirrorOptions = {
      theme: "material",
      lineNumbers: true,
      scrollbarStyle: null,
      lineWrapping: true
    };

    return (
      <div className="App">
        <section className="cabecalho">
        <a href="principal.html" target="frameaula"><img src="tryAlgo.png" alt="TryAlgo!" style={{height:48 }}/> - MVP</a>
        </section>
        <section className="sidebar">
            <div className="sidebar"><table className="tablesb"><tr><td><a href="aulas.html" target="frameaula">Aulas</a></td></tr><tr><td>Forum</td></tr><tr><td>Salas</td></tr></table></div>
        </section>
        <section className="aula">
            <iframe name="frameaula" title="frameaula" className="frameaula" src="principal.html"/>
        </section>
        <section className="playground">
          <div className="code-editor html-code">
            <div className="editor-header">HTML</div>
            <CodeMirror
              value={html}
              options={{
                mode: "htmlmixed",
                ...codeMirrorOptions
              }}
              onBeforeChange={(editor, data, html) => {
                this.setState({ html }, () => this.syncUpdates());
              }}
            />
          </div>
          <div className="code-editor css-code">
            <div className="editor-header">CSS</div>
            <CodeMirror
              value={css}
              options={{
                mode: "css",
                ...codeMirrorOptions
              }}
              onBeforeChange={(editor, data, css) => {
                this.setState({ css }, () => this.syncUpdates());
              }}
            />
          </div>
          <div className="code-editor js-code">
            <div className="editor-header">JavaScript</div>
            <CodeMirror
              value={js}
              options={{
                mode: "javascript",
                ...codeMirrorOptions
              }}
              onBeforeChange={(editor, data, js) => {
                this.setState({ js }, () => this.syncUpdates());
              }}
            />
          </div>
        </section>
        <section className="lselect">
          <div class="dropdown">
    <button className="dropbtn">Linguagem: 
      <i className="fa fa-caret-down"></i>
    </button>
    <div className="dropdown-content">
      <a href="#">HTML+CSS+JS</a>
      <a href="#"><strike>Linguagem C</strike></a>
      <a href="#"><strike>JAVA</strike></a>
    </div>
  </div> </section>
        <section className="result">
          <iframe title="result" className="iframe" ref="iframe" />
        </section>
      </div>
    );
  }
}

export default App;
  
  