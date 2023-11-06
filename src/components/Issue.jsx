
import React, { useState, useRef, useEffect } from 'react';
import './Issue.css';

// Definitions
import {
  urgencyOptions, urgencyValues, customerValueOptions, customerValueValues,
  customersAffectedOptions, customersAffectedValues, developerValueOptions, developerValueValues,
  developersAffectedOptions, developersAffectedValues, developerEffortOptions, developerEffortValues,
  flaggedChar, notFlaggedChar
} from '../defs/priority';

// Components
import IssueTypeIcon from './IssueTypeIcon';
import PriorityIcon from './PriorityIcon';
import EditableField from './EditableField';
import Button from 'react-bootstrap/Button';

// Methods
import {
  savePriorityScoreToString, getPriorityScoreFromString, getSummaryWithoutPriorityScore,
  getDescriptionWithoutPriorityValues, savePriorityValuesToDescription, getPriorityValuesFromDescription
} from '../utils/priorityScore';

import { isNumeric } from '../utils/numbers';

function Issue(props) {

  const initialValues = useRef(getInitialValues(props.json));
  // Maintaining a local version of these values because it would be really slow to query the Jira API to update them
  const lastSavedValues = useRef(initialValues.current); 

  const type = props.json.fields.issuetype.name;
  const key = props.json.key;
  const priority = props.json.fields.priority.name;
  const description = getDescriptionWithoutPriorityValues(props.json.fields.description);
  const [priorityScore, setPriorityScore] = useState(initialValues.current.priorityScore);
  const [priorityScoreFlag, setPriorityScoreFlag] = useState(
    initialValues.current.urgencyFlag ||
    initialValues.current.customerValueFlag ||
    initialValues.current.customersAffectedFlag ||
    initialValues.current.developerValueFlag ||
    initialValues.current.developersAffectedFlag ||
    initialValues.current.developerEffortFlag);
  const [name, setName] = useState(initialValues.current.name);
  const [storyPoints, setStoryPoints] = useState(initialValues.current.storyPoints);
  const [urgency, setUrgency] = useState(initialValues.current.urgency);
  const [urgencyFlag, setUrgencyFlag] = useState(initialValues.current.urgencyFlag);
  const [customerValue, setCustomerValue] = useState(initialValues.current.customerValue);
  const [customerValueFlag, setCustomerValueFlag] = useState(initialValues.current.customerValueFlag);
  const [customersAffected, setCustomersAffected] = useState(initialValues.current.customersAffected);
  const [customersAffectedFlag, setCustomersAffectedFlag] = useState(initialValues.current.customersAffectedFlag);
  const [developerValue, setDeveloperValue] = useState(initialValues.current.developerValue);
  const [developerValueFlag, setDeveloperValueFlag] = useState(initialValues.current.developerValueFlag);
  const [developersAffected, setDevelopersAffected] = useState(initialValues.current.developersAffected);
  const [developersAffectedFlag, setDevelopersAffectedFlag] = useState(initialValues.current.developersAffectedFlag);
  const [developerEffort, setDeveloperEffort] = useState(initialValues.current.developerEffort);
  const [developerEffortFlag, setDeveloperEffortFlag] = useState(initialValues.current.developerEffortFlag);

  const [isChanges, setIsChanges] = useState(false);

  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    var newPriorityScore = calculatePriorityScore();
    if (isAnyFlagged() && isNumeric(newPriorityScore)) {
      newPriorityScore = newPriorityScore + flaggedChar;
    }

    if (newPriorityScore !== priorityScore) {
      setPriorityScore(newPriorityScore);
    }
    checkForChanges();
  }, [urgency, urgencyFlag, customerValue, customerValueFlag, customersAffected, customersAffectedFlag, 
    developerValue, developerValueFlag, developersAffected, developersAffectedFlag, developerEffort, developerEffortFlag])

  // Functions

  function calculatePriorityScore() {
    var score = urgencyValues[urgencyOptions.findIndex(e => e === urgency)] *
      ((customerValueValues[customerValueOptions.findIndex(e => e === customerValue)] * customersAffectedValues[customersAffectedOptions.findIndex(e => e === customersAffected)]) +
        (developerValueValues[developerValueOptions.findIndex(e => e === developerValue)] * developersAffectedValues[developersAffectedOptions.findIndex(e => e === developersAffected)])) /
      developerEffortValues[developerEffortOptions.findIndex(e => e === developerEffort)] * 10;
    return Math.trunc(score) ? Math.trunc(score) : '';
  }

  function isAnyFlagged(){
    return (urgencyFlag
      || customerValueFlag
      || customersAffectedFlag
      || developerValueFlag
      || developersAffectedFlag
      || developerEffortFlag
    );
  }

  function checkForChanges() {
    if (lastSavedValues.current.name !== name
      || lastSavedValues.current.storyPoints !== storyPoints
      || lastSavedValues.current.urgency !== urgency
      || lastSavedValues.current.urgencyFlag !== urgencyFlag
      || lastSavedValues.current.customerValue !== customerValue
      || lastSavedValues.current.customerValueFlag !== customerValueFlag
      || lastSavedValues.current.customersAffected !== customersAffected
      || lastSavedValues.current.customersAffectedFlag !== customersAffectedFlag
      || lastSavedValues.current.developerValue !== developerValue
      || lastSavedValues.current.developerValueFlag !== developerValueFlag
      || lastSavedValues.current.developersAffected !== developersAffected
      || lastSavedValues.current.developersAffectedFlag !== developersAffectedFlag
      || lastSavedValues.current.developerEffort !== developerEffort
      || lastSavedValues.current.developerEffortFlag !== developerEffortFlag)
    {
      if (!isChanges) {
        setIsChanges(true);
      }
    } else {
      if (isChanges) {
        setIsChanges(false);
      }
    }
  }

  function createJsonBody() {
    var priorityValues = urgencyOptions.indexOf(urgency).toString()
      + (urgencyFlag ? flaggedChar : notFlaggedChar)
      + customerValueOptions.indexOf(customerValue).toString()
      + (customerValueFlag ? flaggedChar : notFlaggedChar)
      + customersAffectedOptions.indexOf(customersAffected).toString()
      + (customersAffectedFlag ? flaggedChar : notFlaggedChar)
      + developerValueOptions.indexOf(developerValue).toString()
      + (developerValueFlag ? flaggedChar : notFlaggedChar)
      + developersAffectedOptions.indexOf(developersAffected).toString()
      + (developersAffectedFlag ? flaggedChar : notFlaggedChar)
      + developerEffortOptions.indexOf(developerEffort).toString()
      + (developerEffortFlag ? flaggedChar : notFlaggedChar);

    var body = {
      fields: {
        customfield_10108: storyPoints,
        issuetype: {
          name: type
        },
        priority: {
          name: priority
        },
        summary: savePriorityScoreToString(name, priorityScore),
        description: savePriorityValuesToDescription(description, priorityValues)
      },
      key: key
    };
    return body;
  }

  function getInitialValues(data) {

    var defaultUrgency = urgencyOptions[urgencyOptions.length - 1];
    var defaultCustomerValue = customerValueOptions[customerValueOptions.length - 1];
    var defaultCustomersAffected = customersAffectedOptions[customersAffectedOptions.length - 1];
    var defaultDeveloperValue = developerValueOptions[developerValueOptions.length - 1];
    var defaultDevelopersAffected = developersAffectedOptions[developersAffectedOptions.length - 1];
    var defaultDeveloperEffort = developerEffortOptions[developerEffortOptions.length - 1];

    // If there is no valid data, return default values
    if (!data) {
      return {
        priorityScore: '',
        name: 'No name available',
        storyPoints: '',
        urgency: defaultUrgency,
        customerValue: defaultCustomerValue,
        customersAffected: defaultCustomersAffected,
        developerValue: defaultDeveloperValue,
        developersAffected: defaultDevelopersAffected,
        developerEffort: defaultDeveloperEffort
      }
    }

    var priorityData = data.fields.description ? getPriorityValuesFromDescription(data.fields.description) : '';
    const hasPriorityData = priorityData ? (priorityData.length === 12) : false;
    var hasFlags = hasPriorityData ?(priorityData[1] === flaggedChar
      || priorityData[3] === flaggedChar
      || priorityData[5] === flaggedChar
      || priorityData[7] === flaggedChar
      || priorityData[9] === flaggedChar
      || priorityData[11] === flaggedChar)
      : true;
    var initialPriorityScore = getPriorityScoreFromString(data.fields.summary);

    return {
      priorityScore: hasFlags && isNumeric(initialPriorityScore) ? initialPriorityScore + flaggedChar : initialPriorityScore,
      name: getSummaryWithoutPriorityScore(data.fields.summary),
      storyPoints: data.fields.customfield_10108,
      urgency: hasPriorityData ? urgencyOptions[priorityData[0]] : defaultUrgency,
      urgencyFlag: hasPriorityData ? (priorityData[1] === flaggedChar) : true,
      customerValue: hasPriorityData ? customerValueOptions[priorityData[2]] : defaultCustomerValue,
      customerValueFlag: hasPriorityData ? (priorityData[3] === flaggedChar) : true,
      customersAffected: hasPriorityData ? customersAffectedOptions[priorityData[4]] : defaultCustomersAffected,
      customersAffectedFlag: hasPriorityData ? (priorityData[5] === flaggedChar) : true,
      developerValue: hasPriorityData ? developerValueOptions[priorityData[6]] : defaultDeveloperValue,
      developerValueFlag: hasPriorityData ? (priorityData[7] === flaggedChar) : true,
      developersAffected: hasPriorityData ? developersAffectedOptions[priorityData[8]] : defaultDevelopersAffected,
      developersAffectedFlag: hasPriorityData ? (priorityData[9] === flaggedChar) : true,
      developerEffort: hasPriorityData ? developerEffortOptions[priorityData[10]] : defaultDeveloperEffort,
      developerEffortFlag: hasPriorityData ? (priorityData[11] === flaggedChar) : true
    }
  }

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleStoryPointChange(event) {
    setStoryPoints(Math.trunc(event.target.value));
  }

  function handleUrgencyChange(newUrgency) {
    if (urgency !== newUrgency) {
      setUrgency(newUrgency);
    }
  }

  function handleUrgencyFlaggedChange(isFlagged) {
    if (urgencyFlag !== isFlagged) {
      setUrgencyFlag(isFlagged);
    }
  }

  function handleCustomerValueChange(newCustomerValue) {
    if (customerValue !== newCustomerValue) {
      setCustomerValue(newCustomerValue);
    }
  }

  function handleCustomerValueFlaggedChange(isFlagged) {
    if (customerValueFlag !== isFlagged) {
      setCustomerValueFlag(isFlagged);
    }
  }

  function handleCustomersAffectedChange(newCustomersAffected) {
    if (customersAffected !== newCustomersAffected) {
      setCustomersAffected(newCustomersAffected);
    }
  }

  function handleCustomersAffectedFlaggedChange(isFlagged) {
    if (customersAffectedFlag !== isFlagged) {
      setCustomersAffectedFlag(isFlagged);
    }
  }

  function handleDeveloperValueChange(newDeveloperValue) {
    if (developerValue !== newDeveloperValue) {
      setDeveloperValue(newDeveloperValue);
    }
  }

  function handleDeveloperValueFlaggedChange(isFlagged) {
    if (developerValueFlag !== isFlagged) {
      setDeveloperValueFlag(isFlagged);
    }
  }

  function handleDevelopersAffectedChange(newDevelopersAffected) {
    if (developersAffected !== newDevelopersAffected) {
      setDevelopersAffected(newDevelopersAffected);
    }
  }

  function handleDevelopersAffectedFlaggedChange(isFlagged) {
    if (developersAffectedFlag !== isFlagged) {
      setDevelopersAffectedFlag(isFlagged);
    }
  }

  function handleDeveloperEffortChange(newDeveloperEffort) {
    if (developerEffort !== newDeveloperEffort) {
      setDeveloperEffort(newDeveloperEffort);
    }
  }

  function handleDeveloperEffortFlaggedChange(isFlagged) {
    if (developerEffortFlag !== isFlagged) {
      setDeveloperEffortFlag(isFlagged);
    }
  }

  function handleSaveClick() {
    props.onSave(createJsonBody());
    updateSavedValues();
    checkForChanges();
  }

  function updateSavedValues() {
    var newValues = lastSavedValues.current;
    newValues.urgency = urgency;
    newValues.urgencyFlag = urgencyFlag;
    newValues.customerValue = customerValue;
    newValues.customerValueFlag = customerValueFlag;
    newValues.customersAffected = customersAffected;
    newValues.customersAffectedFlag = customersAffectedFlag;
    newValues.developerValue = developerValue;
    newValues.developerValueFlag = developerValueFlag;
    newValues.developersAffected = developersAffected;
    newValues.developersAffectedFlag = developersAffectedFlag;
    newValues.developerEffort = developerEffort;
    newValues.developerEffortFlag = developerEffortFlag;
    lastSavedValues.current = newValues;
  }

  return (
    <tr class="backlog-item">
      <th class='priority-score-field'>{priorityScore}</th>
      <td>
        <IssueTypeIcon type={type} />
      </td>
      <td>
        <PriorityIcon priority={priority} />
      </td>
      <td>
        <a href={"https://jira.mot-solutions.com/browse/" + key} target="_blank" rel='noreferrer'>{key}</a>
      </td>
      <td>
        <input name="name" onChange={handleNameChange} value={name} />
      </td>
      <td>
        <div class="story-points-div">
          <input name="story-points"
            class="story-points-input"
            onChange={handleStoryPointChange} value={storyPoints} />
        </div>
      </td>
      <td>
        <EditableField
          options={urgencyOptions}
          value={urgency}
          onValueChange={handleUrgencyChange}
          flagged={urgencyFlag}
          onFlaggedChange={handleUrgencyFlaggedChange}
        />
      </td>
      <td>
        <EditableField
          options={customerValueOptions}
          value={customerValue}
          onValueChange={handleCustomerValueChange}
          flagged={customerValueFlag}
          onFlaggedChange={handleCustomerValueFlaggedChange}
        />
      </td>
      <td>
        <EditableField
          options={customersAffectedOptions}
          value={customersAffected}
          onValueChange={handleCustomersAffectedChange}
          flagged={customersAffectedFlag}
          onFlaggedChange={handleCustomersAffectedFlaggedChange}
        />
      </td>
      <td>
        <EditableField
          options={developerValueOptions}
          value={developerValue}
          onValueChange={handleDeveloperValueChange}
          flagged={developerValueFlag}
          onFlaggedChange={handleDeveloperValueFlaggedChange}
        />
      </td>
      <td>
        <EditableField
          options={developersAffectedOptions}
          value={developersAffected}
          onValueChange={handleDevelopersAffectedChange}
          flagged={developersAffectedFlag}
          onFlaggedChange={handleDevelopersAffectedFlaggedChange}
        />
      </td>
      <td>
        <EditableField
          options={developerEffortOptions}
          value={developerEffort}
          onValueChange={handleDeveloperEffortChange}
          flagged={developerEffortFlag}
          onFlaggedChange={handleDeveloperEffortFlaggedChange}
        />
      </td>
      <td>
        <div class='save-button'>
          <Button class='save-button' onClick={() => { handleSaveClick() }} size='sm' disabled={!isChanges}>Save</Button>
        </div>
      </td>
    </tr>
  )
}

export default Issue;

