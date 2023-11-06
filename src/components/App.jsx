import React, { useRef, useState } from "react"
import './App.css';
import Backlog from './Backlog';
import Toolbar from './toolbar/Toolbar';
import { JIRA_TOKEN, JIRA_FILTER } from '../config.js';

function App() {

  const backlogRef = useRef();
  const [filter, setFilter] = useState(JIRA_FILTER);
  const [apiToken, setApiToken] = useState(JIRA_TOKEN || localStorage.getItem('apiToken'));

  function handleLoadBacklog() {
    backlogRef.current.loadBacklog();
  }

  function handleApiTokenChange(newApiToken) {
    if (apiToken !== newApiToken) {
      setApiToken(newApiToken);
      localStorage.setItem('apiToken', newApiToken);
    }
  }

  function handleFilterChange(newFilter) {
    if (filter !== newFilter) {
      setFilter(newFilter);
    }
  }

  return (
    <div class="base">
      <div>
        <div class="text-center">
          <h2>Backlog Prioritization Tool</h2>
        </div>
        <Toolbar
          apiToken={apiToken}
          onApiTokenChange={handleApiTokenChange}
          filter={filter}
          onFilterChange={handleFilterChange}
          onLoadBacklog={handleLoadBacklog} />
        <Backlog
          ref={backlogRef}
          apiToken={apiToken}
          filter={filter} />
      </div>
    </div>
  )
}

export default App;