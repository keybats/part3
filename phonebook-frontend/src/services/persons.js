import axios from "axios";
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  // const nonExisting = {
  //   id: '5c41c90e84d891c15dfa3431',
  //   name: 'This is not saved to server',
  //   number: '1'
  // }
  return request.then(response => response.data/*.concat(nonExisting)*/)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, update, remove }
