
const baseUrl = "https://dog.ceo/api";
export type Dog = {
  breed: string,
  img: string
  dateAdded: number
}

async function getRandomBreed(breeds: string[]): Promise<Dog> {
  const index = Math.floor(Math.random() * breeds.length);
  const splitBreed = breeds[index].split(" ");
  const [breed, subBreed] = splitBreed[1] ? [splitBreed[1], splitBreed[0]] : [splitBreed[0]];
  const url = subBreed ? `${baseUrl}/breed/${breed}/${subBreed}/images/random` : `${baseUrl}/breed/${breed}/images/random`;
  const response = await fetch(url)
  if (!response.ok) throw Error(`Failed to catch dog: ${response.status} ${response.statusText}`);
  const { message } = await response.json()
  return {
    breed: breeds[index],
    img: message,
    dateAdded: Date.now()
  }
}

async function getBreed(newBreed: string): Promise<Dog> {
  const splitBreed = newBreed.split(" ");
  const [breed, subBreed] = splitBreed[1] ? [splitBreed[1], splitBreed[0]] : [splitBreed[0]];
  const url = subBreed ? `${baseUrl}/breed/${breed}/${subBreed}/images/random` : `${baseUrl}/breed/${breed}/images/random`;
  const response = await fetch(url)
  if (!response.ok) throw Error(`Failed to catch dog: ${response.status} ${response.statusText}`);
  const { message } = await response.json()
  return {
    breed: newBreed,
    img: message,
    dateAdded: Date.now()
  }
}

export {
  getRandomBreed,
  getBreed
}
