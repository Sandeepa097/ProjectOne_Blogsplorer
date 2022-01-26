import React, {useState} from "react";
import {
  InputGroup,
  FormInput,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "shards-react";

const DropdownInputGroups = () => {
  const [state, setState] = useState({
    dropdown1: false,
    dropdown2: false
  })

  const toggle = (which) => {
    const newState = { ...state }
    newState[which] = !state[which];
    setState(newState);
  }

  return (
    <div>
    <InputGroup className="mb-3">
      <FormInput />
      <Dropdown
        open={state.dropdown1}
        toggle={() => toggle("dropdown1")}
        addonType="append"
      >
        <DropdownToggle caret>Dropdown</DropdownToggle>
        <DropdownMenu small right>
          <DropdownItem>Action</DropdownItem>
          <DropdownItem>Another action</DropdownItem>
          <DropdownItem>Something else here</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </InputGroup>

    <InputGroup className="mb-3">
      <Dropdown
        open={state.dropdown2}
        toggle={() => toggle("dropdown2")}
        addonType="prepend"
      >
        <DropdownToggle caret>Dropdown</DropdownToggle>
        <DropdownMenu small>
          <DropdownItem>Action</DropdownItem>
          <DropdownItem>Another action</DropdownItem>
          <DropdownItem>Something else here</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <FormInput />
    </InputGroup>
    </div>
  )
}

export default DropdownInputGroups;
