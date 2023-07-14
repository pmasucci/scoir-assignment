import { useEffect, useState } from 'react'
import { Box, Grid, Autocomplete, Button, TextField, Typography } from "@mui/material"
import DogCard from "./DogCard"
import { getBreed, getRandomBreed } from "../utils/dogApi";
import useBreeds from "../hooks/useBreeds";
import { Token } from "../utils/auth"
import { Dog } from "../utils/dogApi";
import { addBreed, getBreedList, putBreedList } from "../utils/catcherApi";
import HighlightOff from '@mui/icons-material/HighlightOff';

type Props = {
  token: Token
}

const sort = (a: Dog, b: Dog) => {
  return b.dateAdded - a.dateAdded
}

function Home({ token }: Props) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [autoCompleteValue, setAutocompleteValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const breeds = useBreeds();
  useEffect(() => {
    (async () => {
      const dogList = await getBreedList(token.tokenString);
      setDogs(dogList)
    })()

  }, [token])
  const randomBreedHandler = async () => {
    const newDog = await getRandomBreed(breeds);
    if (token) {
      try {
        await addBreed(newDog, token.tokenString);
        setDogs([...dogs, newDog]);
      } catch (e) {
        console.error(e)
      }
    }
  };
  const autoCompleteSelectHandler = async (_: any, newValue: string | null) => {
    if (newValue) {
      setAutocompleteValue(newValue)
      const newDog = await getBreed(newValue);
      try {
        await addBreed(newDog, token.tokenString);
        setDogs([...dogs, newDog])
        setInputValue("")
        setAutocompleteValue("")
      } catch (e) {
        console.error(e)
      }

    }
  }
  const inputHandler = async (_: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue)
  }
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // if both autocomplete and input values exist,
    // default to input value
    const search = inputValue ? inputValue : autoCompleteValue;
    if (breeds.includes(search)) {
      const newDog = await getBreed(search);
      try {
        await addBreed(newDog, token.tokenString);
        setDogs([...dogs, newDog])
        //clear input after search
        setInputValue("");
        setAutocompleteValue("")
      } catch (e) {
        console.error(e)
      }
    }
  }
  const clearDogsHandler = async () => {
    try {
      await putBreedList([], token.tokenString);
      setDogs([])
    } catch (e) {
      console.error(e)
    }
  }
  //using dateAdded as a proxy for Id
  const removeBreedHandler = async (dateAdded: number) => {
    const newDogs = dogs.filter(dog => dog.dateAdded !== dateAdded);
    try {
      await putBreedList(newDogs, token.tokenString);
      setDogs(newDogs)
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <>
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid item xs={12} sm={9}>
          <Box component="form" noValidate onSubmit={handleSearch} sx={{ mt: 2 }}>
            <Autocomplete
              disablePortal
              id="dog-breed"
              options={breeds}
              fullWidth
              inputValue={inputValue}
              onInputChange={inputHandler}
              value={autoCompleteValue}
              onChange={autoCompleteSelectHandler}
              renderInput={(params => <TextField {...params} label="Find a breed to catch" />)} />
          </Box>
        </Grid>
        {/*<Grid item xs={3}>
            <Button fullWidth type="submit" variant="contained" sx={{ height: 56 }}>Search</Button>
          </Grid>*/}
        <Grid item xs={12} sm={9} >
          <Button variant="outlined" fullWidth onClick={() => randomBreedHandler()} >Catch a random breed</Button>
        </Grid>
        <Grid container xs={12} sm={9} sx={{ mt: 1, justifyContent: "end" }} spacing={2}>
          <Grid item xs={6}>
            <Typography component="h1" variant="h6" textAlign="center" sx={{ mb: 2 }}>
              Caught Breeds
            </Typography>
          </Grid>
          <Grid item xs={3} justifySelf="right">
            <Button variant="outlined" fullWidth onClick={clearDogsHandler} startIcon={<HighlightOff />}>Clear</Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} xs={12}>
          {dogs.sort(sort).map((dog) =>
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex", justifyContent: "center" }} key={dog.dateAdded}>
              <DogCard dog={dog} clickHandler={removeBreedHandler} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default Home