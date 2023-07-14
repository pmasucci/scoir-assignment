import { Card, CardHeader, CardMedia, IconButton, Typography } from "@mui/material"
import { Dog } from "../utils/dogApi"
import ClearIcon from '@mui/icons-material/Clear'

type Props = {
  dog: Dog
  clickHandler: (dateAdded: number) => Promise<void>
}
function DogTitle({ breed }: { breed: string }) {

  return <Typography variant="subtitle1" sx={{ textTransform: "capitalize", textAlign: "center" }}>
    {breed}
  </Typography>
}

function DogCard({ dog, clickHandler }: Props) {

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader title={<DogTitle breed={dog.breed} />}
        disableTypography
        action={
          <IconButton aria-label="close" onClick={() => clickHandler(dog.dateAdded)}>
            <ClearIcon />
          </IconButton>
        } />
      <CardMedia height="350" component="img" image={dog.img} />
    </Card >
  )
}

export default DogCard