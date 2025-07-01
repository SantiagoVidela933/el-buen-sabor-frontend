export async function getLocalidadesJSONFetch() {
  const urlServer = 'http://localhost:8080/api/localidades';
  const response = await fetch(urlServer, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    mode: 'cors'
  });
  return await response.json();
}