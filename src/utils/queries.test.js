import { createHeader, getFilterQuery, getJqlQuery, updateIssue } from './queries';

beforeEach(() => {
  fetch.resetMocks();
});

test('passes proper api parameters', async () => {
  var testApiToken = 'testToken123';
  var testQuery = 'testQuery123';
  var testFields = 'test1,test2,test3';
  var testMaxResults = 39;
  var testHeader = createHeader(testApiToken);

  const response = await getJqlQuery(testApiToken, testQuery, testFields, testMaxResults);

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    'https://jira.mot-solutions.com/rest/api/latest/search?jql=' + testQuery + '&fields=' + testFields + '&maxResults=' + testMaxResults,
    {
      method: 'GET',
      headers: testHeader
    }
  )
})