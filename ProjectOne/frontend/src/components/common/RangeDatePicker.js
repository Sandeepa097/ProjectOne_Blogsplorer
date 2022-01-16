import React, {useState} from "react";
import classNames from "classnames";
import {
  InputGroup,
  DatePicker,
  InputGroupAddon,
  InputGroupText
} from "shards-react";

import "../../assets/range-date-picker.css";

const RangeDatePicker = ({className}) => {
  const [state, setState] = useState({
    startDate: undefined,
    endDate: undefined
  })

  const handleStartDateChange = (value) => {
    setState({
      ...state,
      ...{ startDate: new Date(value) }
    });
  }

  const handleEndDateChange = (value) => {
    setState({
      ...state,
      ...{ endDate: new Date(value) }
    });
  }

  const classes = classNames(className, "d-flex", "my-auto", "date-range");

  return (
    <InputGroup className={classes}>
    <DatePicker
      size="sm"
      selected={state.startDate}
      onChange={handleStartDateChange}
      placeholderText="Start Date"
      dropdownMode="select"
      className="text-center"
    />
    <DatePicker
      size="sm"
      selected={state.endDate}
      onChange={handleEndDateChange}
      placeholderText="End Date"
      dropdownMode="select"
      className="text-center"
    />
    <InputGroupAddon type="append">
      <InputGroupText>
        <i className="material-icons">&#xE916;</i>
      </InputGroupText>
    </InputGroupAddon>
  </InputGroup>
  )
}


export default RangeDatePicker;
