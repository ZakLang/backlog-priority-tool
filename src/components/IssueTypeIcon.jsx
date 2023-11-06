import React from 'react';
import './IssueTypeIcon.css';

function IssueTypeIcon(props) {

  if (!props.type) {
    return;
  }
  var image;

  switch (props.type) {
    case 'Bug': image = './BugIcon.png';
      break;
    case 'Story': image = './StoryIcon.svg';
      break;
    case 'Task': image = './TaskIcon.svg';
      break;
    case 'Epic': image = './EpicIcon.svg';
      break;
    case 'Tech Debt': image = './TechDebtIcon.svg';
      break;
    case 'Escalation': image = './EscalationIcon.svg';
      break;
    default: image = './TaskIcon.svg';
  }

  return (
    <img src={image} alt={props.type} title={props.type} />
  )
}

export default IssueTypeIcon;