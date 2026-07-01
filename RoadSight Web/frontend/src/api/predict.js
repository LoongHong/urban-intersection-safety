import axios from 'axios'

const BASE = 'http://localhost:8000'

export async function predictRisk({ model, features }) {
  const { data } = await axios.post(`${BASE}/predict`, { model, features })
  return data
}
