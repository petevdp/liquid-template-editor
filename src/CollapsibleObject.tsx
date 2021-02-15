import React, { ReactNode, useState } from "react"

export type PlainObject = { [name: string]: PlainObject|string|number }


export function CollapsibleObject({obj, name, isOpen: isOpenProp}: {obj: PlainObject|string|number; name: string, isOpen?: boolean}): JSX.Element {
  console.log({obj, name});
  const [isOpen, setIsOpen] = useState(isOpenProp);
  if (typeof obj === 'string') {
    return <>{name}: {obj}</>
  } else if (typeof obj === 'number') {
    return <>{name}: {obj}</>
  } 

  let children: JSX.Element[];
  const button = <button className="collapsible-object-button"  onClick={() => setIsOpen(isOpen => !isOpen)}>{name}</button>
  if (obj instanceof Array) {
    children = obj.map((child, idx) => <CollapsibleObject name={idx.toString()} obj={child} isOpen={true} />);
  } else {
    children = Object.entries(obj).map(([name, child]) => <CollapsibleObject name={name} obj={child} />);
  }
  
  return  (
    <div className={`collapsible-object-node ${name}`}>
      {button}
      <div className="collapsible-object-children" style={{display: isOpen ? 'block': 'none'}}>
        {children}
      </div>
    </div>
  );
}
