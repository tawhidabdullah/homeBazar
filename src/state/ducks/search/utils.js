export function queryPositionInQueryList(queryList, query) {
  return queryList.map(item => item.key).indexOf(query.key);
}

export function newQueryItem(query) {
  return query;
}
