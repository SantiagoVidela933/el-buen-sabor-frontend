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

  console.log(response);
  return await response.json();
}