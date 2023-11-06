import React from 'react';
import './ApiTokenEntry.css';


function ApiTokenEntry(props) {

  function handleApiTokenChange(event) {
    props.onApiTokenChange(event.target.value);
  }

  return (
    <span class="api-token-span">
      <p>API Token: </p>
      <input name="api-token"
        class="api-token-input"
        onChange={handleApiTokenChange}
        value={props.apiToken} />
    </span>
  )

}

export default ApiTokenEntry;