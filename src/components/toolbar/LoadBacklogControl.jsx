import React from 'react';
import './LoadBacklogControl.css';

import Button from 'react-bootstrap/Button';

function LoadBacklogControl(props) {

  return (
    <div class="load-backlog-ctrl">
      <Button onClick={() => { props.onLoadBacklog() }} size='sm'>Load Backlog</Button>
    </div>
  )
}

export default LoadBacklogControl;