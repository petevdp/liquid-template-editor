import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Liquid } from "liquidjs";
import logo from "./logo.svg";
import AceEditor, { split as SplitAceEditor } from "react-ace";
import { Dropdown, Container, Row, Col, DropdownButton } from "react-bootstrap";
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

type OutputType = "json" | "xml" | "yaml" | "html";
type InputType = "json" | "xml" | "yaml";

const OUTPUT_TYPES: OutputType[] = ["json", "xml", "yaml", "html"];
const INPUT_TYPES: InputType[] = ["json", "xml", "yaml"];

const EDITOR_BASE_PROPS: any = {
  height: "calc(100% - 31px)",
  theme: "github",
  width: "100%",
};

function App() {
  const [inputText, setInputText] = useState('{"name": "doug"}');
  const [templateText, setTemplateText] = useState("<div>hello {{name}}</div>");
  const [outputType, setOutputType] = useState<OutputType>("html");
  const [inputType, setInputType] = useState<InputType>("json");
  const [output, setOutput] = useState("");
  // const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("evaluating...");
    evaluateTemplate(inputText, templateText).then((out) => {
      setOutput(out);
      console.log(out);
    });
  }, [templateText, inputText]);

  return (
    <div className="App">
      <NavBar />
      <Split
        className="editor-list"
        sizes={[33, 33, 33]}
        direction="vertical"
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
          <AceEditor {...EDITOR_BASE_PROPS} mode={"json"} value={inputText} onChange={(value: string) => setInputText(value)}></AceEditor>
        </EditorContainer>
        <EditorContainer title="Template" currentMode={outputType} options={OUTPUT_TYPES}>
          <AceEditor {...EDITOR_BASE_PROPS} mode={outputType} onChange={(value: string) => setTemplateText(value)} value={templateText}></AceEditor>
        </EditorContainer>
        <EditorContainer
          title="Output"
          currentMode={outputType}
          onTypeChange={(outType) => setOutputType(outType)}
          typeLabel="Output Type"
          options={OUTPUT_TYPES}
        >
          <AceEditor {...EDITOR_BASE_PROPS} value={output} mode={outputType} readOnly={true}></AceEditor>
        </EditorContainer>
      </Split>
    </div>
  );
}

function EditorContainer<ModeType extends string>({
  title,
  children,
  onTypeChange,
  currentMode,
  typeLabel,
  options,
}: {
  title: ReactNode;
  children: React.ReactNode;
  onTypeChange?: (e: ModeType) => void;
  currentMode: ModeType;
  typeLabel?: string;
  options: ModeType[];
}) {
  return (
    <div className="editor-container">
      <div className="editor-control-panel">
        <label className="editor-label">{title}</label>
        {onTypeChange && (
          <span className="editor-type-container">
            {typeLabel && <label className="type-label">Output Type: </label>}
            <DropdownButton
              className="mode-type-dropdown"
              title={currentMode}
              variant="secondary"
              size="sm"
            >
              {options.map((modeType) => (
                <Dropdown.Item key={modeType} onClick={(e) => onTypeChange(modeType)}>
                  {modeType}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

async function evaluateTemplate(inputText: string, templateText: string): Promise<string> {
  const liquid = new Liquid();
  try {
    const vars = JSON.parse(inputText);
    return await liquid.parseAndRender(templateText, vars);
  } catch (err) {
    return err.toString();
  }
}

export default App;
