import React from 'react';
import './FilterEntry.css';

function FilterEntry(props) {

  function handleFilterChange(event) {
    props.onFilterChange(event.target.value);
  }

  return (
    <span class="filter-span">
      <p>Filter: </p>
      <input name="filter"
        class="filter-input"
        maxLength="6"
        onChange={handleFilterChange}
        value={props.filter} />
    </span>
  )
}

export default FilterEntry;