import { API_PORT } from "../config"
import { Dog } from "./dogApi"

async function addBreed(dog: Dog, token: string) {
  const response = await fetch(`http://localhost:${API_PORT}/api/list`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(dog)
  });
  if (!response.ok) throw Error(`Failed to update list: ${response.status} ${response.statusText}`)
}

async function putBreedList(dogs: Dog[], token: string) {
  const response = await fetch(`http://localhost:${API_PORT}/api/list`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ list: dogs })
  });
  if (!response.ok) throw Error(`Failed to update list: ${response.status} ${response.statusText}`)
}

async function getBreedList(token: string): Promise<Dog[]> {
  const response = await fetch(`http://localhost:${API_PORT}/api/list`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) throw Error(`Failed to retrieve list: ${response.status} ${response.statusText}`)
  return response.json();
}

export {
  addBreed,
  putBreedList,
  getBreedList
}
