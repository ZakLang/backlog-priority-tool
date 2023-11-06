
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import './Backlog.css';
import { getFilterQuery, updateIssue } from "../utils/queries.js";
import { getPriorityScoreFromString } from "../utils/priorityScore.js";
import { sortArrayByProperty } from "../utils/arrays.js";
import Issue from "./Issue";

const Backlog = forwardRef((props, ref) => {

  const issueFields = 'description,issuetype,priority,status,summary,key,self,customfield_10108';
  const [loadingBacklog, setLoadingBacklog] = useState(false);
  const [backlog, setBacklog] = useState();

  function onSaveIssue(issue) {
    updateIssue(props.apiToken, issue);
  }

  function createBacklogFromIssues(issues){
    var issueArray = [];
    if(!issues) return issueArray;
    issues.forEach(issue => {
      issueArray.push({ json: issue, priorityScore: getPriorityScoreFromString(issue.fields.summary) });
    });
    sortArrayByProperty(issueArray, 'priorityScore', 'descending');
    return issueArray;
  }

  useImperativeHandle(ref, () => ({
    loadBacklog() {
      setBacklog('');
      setLoadingBacklog(true);
      getFilterQuery(props.apiToken, props.filter, issueFields)
        .then(issues => {
          setBacklog(createBacklogFromIssues(issues));
          setLoadingBacklog(false);
        })
    }
  }));

  useEffect(() => {
    try {
      if (props.apiToken && props.filter) {
        setLoadingBacklog(true);
        getFilterQuery(props.apiToken, props.filter, issueFields)
          .then(issues => {
            setBacklog(createBacklogFromIssues(issues));
            setLoadingBacklog(false);
          })
      }
    } catch (err) {
      console.error(err);
    }
  }, [])

  if (backlog) {
    return (
      <table class='backlog-table'>
        <thead class='backlog-header'>
          <tr>
            <th class='priority-score-header' title='Priority Score'>PS</th>
            <th class='type-header'></th>
            <th class='priority-header'></th>
            <th class='key-header'>Issue</th>
            <th class='name-header'>Name</th>
            <th class='story-points-header' title='Story Points'>SP</th>
            <th class='priority-fields-header'>Urgency</th>
            <th class='priority-fields-header'>Customer Value</th>
            <th class='priority-fields-header'>Customers Affected</th>
            <th class='priority-fields-header'>Developer Value</th>
            <th class='priority-fields-header'>Developers Affected</th>
            <th class='priority-fields-header'>Development Effort</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {backlog.map((issue, index) => {
            return <Issue
              id={index}
              json={issue.json}
              onSave={onSaveIssue} />
          })}
        </tbody>
      </table>
    );
  } else if (loadingBacklog) {
    return (
      <div>Loading Backlog...</div>
    );
  } else {
    return (
      <div>Enter API Token and click "Load Backlog"</div>
    );
  }
})

export default Backlog;