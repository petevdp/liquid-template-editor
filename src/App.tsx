import React, { useEffect, useState } from 'react';
import {Liquid} from 'liquidjs'
import logo from './logo.svg';
import AceEditor from 'react-ace';
import './App.css';

import "ace-builds/src-noconflict/mode-liquid";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";


function App() {
  const [inputText, setInputText] = useState("");
  const [templateText, setTemplateText] = useState("");
  const [output, setOutput] = useState('');
  
  useEffect(() => {
    console.log('evaluating...');
    evaluateTemplate(inputText, templateText).then((out) => {
      setOutput(out)
      console.log(out);
    });
  }, [templateText, inputText]);
  
  return (
    <div className="App">
      <AceEditor mode="json" theme="github" value={inputText} onChange={(value: string) => setInputText(value)}></AceEditor>
      <AceEditor mode="liquid" theme="github" value={templateText} onChange={(value: string) => setTemplateText(value)}></AceEditor>
      <div className="output-display">{output}</div>
      <div className='status'>{}</div>
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
