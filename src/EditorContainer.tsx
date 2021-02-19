import React, { ReactNode } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import {useResizeDetector} from 'react-resize-detector'

export function EditorContainer<ModeType extends string>({
  title,
  children,
  onTypeChange,
  currentMode,
  typeLabel,
  options,
}: {
  title: ReactNode;
  children: (props: {width?: string; height?: string}) => React.ReactNode;
  onTypeChange?: (e: ModeType) => void;
  currentMode: ModeType;
  typeLabel?: string;
  options: ModeType[];
}) {
  const {width, height, ref} = useResizeDetector();
  console.log({width, height});
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
      <div className="editor-container-children" ref={ref as React.Ref<HTMLDivElement>}>
        {children({width: width ? `${width - 20}px` : undefined, height: height ? `${height - 20}px` : undefined})}
      </div>
    </div>
  );
}
