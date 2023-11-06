import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import './EditableField.css';

function EditableField(props) {

  function handleMenuChange(eventKey, event) {
    if (props.value !== props.options[eventKey]) {
      props.onValueChange(props.options[eventKey]);
      props.onFlaggedChange(false);
    }
  }

  function handleClick(event) {
    // Right-click
    if (event.button === 2) {
      props.onFlaggedChange(!props.flagged);
    }
  }

  return (
    <div class='editable-field' onContextMenu={(e) => e.preventDefault()}>
      <div class={props.flagged ? 'flagged': ''}>
        <Dropdown size='sm' onSelect={handleMenuChange} onMouseUp={handleClick}>
          <Dropdown.Toggle id="dropdown-basic">
            {props.value ? props.value : props.options[props.options.length - 1]}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {props.options.map((option, index) => {
              return <Dropdown.Item eventKey={index}>{option}</Dropdown.Item>
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}

export default EditableField;
