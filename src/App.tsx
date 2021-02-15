import React, { useEffect, useRef, useState } from "react";
import { Liquid } from "liquidjs";
import logo from "./logo.svg";
import useBreakpoint from "@w11r/use-breakpoint";
import AceEditor, { split as SplitAceEditor } from "react-ace";
import { Container, Row, Col } from "react-bootstrap";
import { xml2js } from "xml-js";
import Split from "react-split";
import "./App.css";

import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-liquid";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import { NavBar } from "./Navbar";
import { CollapsibleObject } from "./CollapsibleObject";
import { getEffectiveTypeParameterDeclarations } from "typescript";
import { EditorContainer } from "./EditorContainer";

type OutputType = "json" | "xml" | "yaml" | "html";
type InputType = "json" | "xml" | "yaml";

const OUTPUT_TYPES: OutputType[] = ["json", "xml", "yaml", "html"];
const INPUT_TYPES: InputType[] = ["json", "xml", "yaml"];

const EDITOR_BASE_PROPS = {
  height: "100%",
  theme: "github",
  width: "100%",
};

// const breakpoints = {
//   smallWidth: [800, 2000],
//   smallHeight: [2000, 800],
// }


const STARTING_INPUTS = {
  simpleJson: '{"name": "doug"}',
  nestedJson: '{"people": [{"name": "clide"}, {"name": "doug"}, {"name": "bob"}]}',
}

function App() {
  const [inputText, setInputText] = useState(STARTING_INPUTS.nestedJson);
  const [templateText, setTemplateText] = useState("<div>hello {{name}}</div>");
  const [outputType, setOutputType] = useState<OutputType>("html");
  const [inputType, setInputType] = useState<InputType>("json");
  const [output, setOutput] = useState("");
  const breakpoint = useBreakpoint();
  const [sizes, setSizes] = useState([33, 33, 33]);

  useEffect(() => {
    const editorContainers = document.querySelectorAll(".editor-list > *");
    editorContainers.forEach((elt) => {
      const element = elt as HTMLDivElement;
      console.log(elt);
      if (breakpoint.isLandscape) {
        element.style.removeProperty("height");
      } else {
        element.style.removeProperty("width");
      }
    });

  }, [breakpoint.isLandscape]);

  useEffect(() => {
    console.log("evaluating...");
    evaluateTemplate(inputText, templateText, inputType).then((out) => {
      setOutput(out);
      console.log(out);
    });
  }, [templateText, inputText]);

  return (
    <div className="App">
      <NavBar />
      <Split
        className="editor-list"
        sizes={sizes}
        direction={breakpoint.isLandscape ? "horizontal" : "vertical"}
        gutterSize={10}
        gutterAlign="center"
        cursor="col-resize"
      >
        <EditorContainer
          title="Input"
          currentMode={inputType}
          onTypeChange={(inType) => setInputType(inType)}
          options={INPUT_TYPES}
        >
          <AceEditor
            {...EDITOR_BASE_PROPS}
            mode={inputType}
            value={inputText}
            onChange={(value: string) => setInputText(value)}
          ></AceEditor>
          <CollapsibleObject obj={parseInput(inputText, inputType)} name="root" isOpen={true}/>
        </EditorContainer>
        <EditorContainer title="Template" currentMode={outputType} options={OUTPUT_TYPES}>
          <AceEditor
            {...EDITOR_BASE_PROPS}
            mode={outputType}
            onChange={(value: string) => setTemplateText(value)}
            value={templateText}
          ></AceEditor>
        </EditorContainer>
        <EditorContainer
          title="Output"
          currentMode={outputType}
          onTypeChange={(outType) => setOutputType(outType)}
          typeLabel="Output Type"
          options={OUTPUT_TYPES}
        >
          <AceEditor
            {...EDITOR_BASE_PROPS}
            value={output}
            mode={outputType}
            readOnly={true}
          ></AceEditor>
        </EditorContainer>
      </Split>
    </div>
  );
}

async function evaluateTemplate(
  inputText: string,
  templateText: string,
  inputType: InputType
): Promise<string> {
  const liquid = new Liquid();
  try {
    const vars = parseInput(inputText, inputType);
    console.log(vars);
    return await liquid.parseAndRender(templateText, vars);
  } catch (err) {
    return err.toString();
  }
}

function parseInput(inputText: string, inputType: InputType) {
  try {
    switch (inputType) {
      case "json":
        return JSON.parse(inputText);
      case "xml":
        return xml2js(inputText, { compact: true });
    }
  } catch(err) {
    return err
  }
}

class ConvertedXMLObject {
  public text: string;
  constructor(obj: any) {
    this.text = obj._text;
  }
  toString() {
    return this.text;
  }
}

export default App;
