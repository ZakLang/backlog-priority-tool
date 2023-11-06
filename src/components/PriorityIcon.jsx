import React from 'react';
import './PriorityIcon.css';

function PriorityIcon(props) {

  if (!props.priority) {
    return;
  }
  var image;

  switch (props.priority) {
    case 'Minor': image = './MinorIcon.svg';
      break;
    case 'Major': image = './MajorIcon.svg';
      break;
    case 'Critical': image = './CriticalIcon.svg';
      break;
    case 'Blocker': image = './BlockerIcon.svg';
      break;
    default: break;
  }

  return (
    <img src={image} alt={props.priority} title={props.priority} />
  )
}

export default PriorityIcon;