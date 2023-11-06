import React from 'react';
import './Toolbar.css';
import FilterEntry from './FilterEntry';
import LoadBacklogControl from './LoadBacklogControl';
import ApiTokenEntry from './ApiTokenEntry';

function Toolbar(props) {

  return (
    <div>
      <span class="toolbar-span">
        <FilterEntry filter={props.filter} onFilterChange={props.onFilterChange} />
        <ApiTokenEntry apiToken={props.apiToken} onApiTokenChange={props.onApiTokenChange} />
        <LoadBacklogControl onLoadBacklog={props.onLoadBacklog} />
      </span>
    </div>
  )
}

export default Toolbar;