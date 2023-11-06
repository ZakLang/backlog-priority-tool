import { isNumeric } from './numbers';

import { priorityScoreStartingString, priorityScoreEndingString, priorityValuesStartingString, priorityValuesEndingString, flaggedChar} from '../defs/priority';

// Gets the Priority Score from a string of format "[SCORE] SUMMARY........"
// If there is no Priority Score returns null
export function getPriorityScoreFromString(summary) {

  // If there is no summary, return empty priority
  if (!summary) {
    return '';
  }

  // Check for the first possible instance of the priority score, should be at the start of the string
  var startingIndex = summary.indexOf(priorityScoreStartingString);
  var endingIndex = summary.indexOf(priorityScoreEndingString, startingIndex);

  // Couldn't find the special priority string characters
  if (startingIndex === -1 || endingIndex === -1) {
    return '';
  }

  var priorityScoreString = summary.substring(
    startingIndex + 1,
    endingIndex
  );

  priorityScoreString = removeFlagFromPriorityScore(priorityScoreString);

  // There was nothing between the priority string characters
  if (!priorityScoreString && priorityScoreString !== '0') {
    return '';
  }

  // The content in the priority string characters wasn't a valid number
  if (!isNumeric(priorityScoreString)) {
    return '';
  }

  return +priorityScoreString
}

// Saves a Priority Score to a string with the format "[SCORE] SUMMARY........"
export function savePriorityScoreToString(summary, newPriority) {
  if (getPriorityScoreFromString(summary) === newPriority) {
    return summary;
  };

  var existingSummary = getSummaryWithoutPriorityScore(summary);
  return priorityScoreStartingString + newPriority + priorityScoreEndingString + ' ' + existingSummary;
}

// Removes the Priority Score from a string of format "[SCORE] SUMMARY......."
// Returns just the summary of format "SUMMARY......"
export function getSummaryWithoutPriorityScore(summary) {

  // If there is no summary, return empty string
  if (!summary) {
    return '';
  }

  // If there is no priority score then return the string as is
  if (!isNumeric(getPriorityScoreFromString(summary))) {
    return summary;
  }

  // If there is a priority score, remove it from the string
  var summaryWithoutPriorityScore = summary.substring(summary.indexOf(priorityScoreEndingString) + 1);

  // Remove any whitespace from the summary
  while (summaryWithoutPriorityScore.substring(0, 1) === ' ') {
    summaryWithoutPriorityScore = summaryWithoutPriorityScore.substring(1);
  }

  return summaryWithoutPriorityScore;
}

// Gets the Priority Values from a string of format "DESCRIPTION........ /nPriority Values: [Values]"
// If there are no Priority Value returns null
export function getPriorityValuesFromDescription(description) {

  // If there is no description, return empty priority values
  if (!description) {
    return '';
  }

  // Check for the last possible instance of the priority values, should be at the end of the string
  var startingIndex = description.lastIndexOf(priorityValuesStartingString);
  var endingIndex = description.indexOf(priorityValuesEndingString, startingIndex);

  if (startingIndex === -1 || endingIndex === -1) {
    return '';
  }

  var priorityValuesString = description.substring(
    startingIndex + priorityValuesStartingString.length,
    endingIndex
  );

  // There was nothing between the priority string characters
  if (!priorityValuesString) {
    return '';
  }

  return priorityValuesString;
}

// Saves a Priority Values to a string with the format "DESCRIPTION........ /nPriority Values: [Values]"
export function savePriorityValuesToDescription(description, newPriorityValues) {
  if (getPriorityValuesFromDescription(description) === newPriorityValues) {
    return description;
  };

  var existingDescription = getDescriptionWithoutPriorityValues(description);
  return existingDescription + priorityValuesStartingString + newPriorityValues + priorityValuesEndingString;
}

// Removes the Priority Values from a string of format "DESCRIPTION........ /nPriority Values: [Values]"
// Returns just the description of format "DESCRIPTION......"
export function getDescriptionWithoutPriorityValues(description) {

  // If there is no description, return empty string
  if (!description) {
    return '';
  }

  // If there is no priority score then return the string as is
  if (!getPriorityValuesFromDescription(description)) {
    return description;
  }

  // If there is a priority score, remove it from the string
  var descriptionWithoutPriorityValues = description.substring(0, description.indexOf(priorityValuesStartingString) - 1);

  return descriptionWithoutPriorityValues;
}

export function removeFlagFromPriorityScore(priorityScoreString) {
  if (priorityScoreString.slice(-1) === flaggedChar) {
    return priorityScoreString.slice(0, -1);
  } else {
    return priorityScoreString;
  }
}