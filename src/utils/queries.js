
export function createHeader(apiToken) {
  return {
    'Authorization': 'Bearer ' + apiToken,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

export async function getFilterQuery(apiToken, filter, fields, maxResults = 500) {
  try {
    var response = await window.fetch('https://jira.mot-solutions.com' + '/rest/api/latest/filter/' + filter, {
      method: 'GET',
      headers: createHeader(apiToken)});
    var responseJson = await response.json();
    var queryString = responseJson.jql.replace(/ /g, "%20");
    var issues = await getJqlQuery(apiToken, queryString, fields, maxResults);
    return issues;
  } catch (err) {
    console.error(err);
  }
}

export async function getJqlQuery(apiToken, query, fields, maxResults = 500) {
  try {
    var response = await window.fetch('https://jira.mot-solutions.com' + '/rest/api/latest/search?jql=' + query + '&fields=' + fields + '&maxResults=' + maxResults, {
      method: 'GET',
      headers: createHeader(apiToken)});
    var responseJson = await response.json();
    return responseJson.issues;
  } catch (err) {
    console.error(err);
  }
}

export async function updateIssue(apiToken, issue) {
  var body = JSON.stringify(issue);
  try {
    var response = await window.fetch('https://jira.mot-solutions.com' + '/rest/api/latest/issue/' + issue.key, {
      method: 'PUT',
      headers: createHeader(apiToken),
      body: body
    });
    console.log(response.status)
  } catch (err) {
    console.error(err);
  }
}