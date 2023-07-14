package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/jwtauth/v5"
	"github.com/go-chi/render"
)

type User struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	password string
}

var tokenAuth *jwtauth.JWTAuth

var users = map[string]User{
	"1": {
		Id:       "1",
		Username: "dogcatcher",
		password: "theyregooddogsbrent", // IRL we'd salt this and use TLS so this wouldn't be the glaring security concern that it is.
	},
}

type Dog struct {
	Breed     string `json:"breed"`
	Img       string `json:"img"`
	DateAdded int    `json:"dateAdded"`
}

var lists map[string][]Dog = make(map[string][]Dog)

var dogBreeds []string

func init() {
	tokenAuth = jwtauth.New("HS256", []byte("fakesecret"), nil)
	dogBreeds = fetchDogs()
}

func fetchDogs() []string {
	log.Println("Fetching dogs")
	var dogBreeds []string
	resp, err := http.Get("https://dog.ceo/api/breeds/list/all")
	if err != nil {
		log.Fatalln("Error fetching dogs", err)
	}
	decoder := json.NewDecoder(resp.Body)
	var dogResponse DogResponse
	err = decoder.Decode(&dogResponse)
	if err != nil {
		log.Fatalln("Error fetching dogs", err)
	}
	for breed, subbreeds := range dogResponse.Breeds {
		dogBreeds = append(dogBreeds, breed)
		for _, subbreed := range subbreeds {
			dogName := subbreed + " " + breed
			dogBreeds = append(dogBreeds, dogName) // should set an initial length on dogs due to default array growth being exponential
		}
	}
	log.Println("Dogs fetched")
	return dogBreeds
}

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"http://*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	}))
	workDir, _ := os.Getwd()
	filesDir := http.Dir(filepath.Join(workDir, "build"))
	FileServer(r, "/", filesDir)

	r.Route("/api", func(r chi.Router) {
		r.Use(jwtauth.Verifier(tokenAuth))
		r.Get("/breeds", func(w http.ResponseWriter, r *http.Request) {
			render.JSON(w, r, dogBreeds)
		})
		r.Get("/list", func(w http.ResponseWriter, r *http.Request) {
			_, claims, _ := jwtauth.FromContext(r.Context())
			id := claims["sub"].(string)
			val, ok := lists[id]
			if !ok {
				val = []Dog{}
			}
			render.JSON(w, r, val)
		})
		r.Post("/list", func(w http.ResponseWriter, r *http.Request) {
			_, claims, _ := jwtauth.FromContext(r.Context())
			id := claims["sub"].(string)
			data := &Dog{}
			render.Bind(r, data)
			lists[id] = append(lists[id], *data)
		})
		//saving myself a bit of work by allowing the Put to overwrite the whole list
		//and just trusting that it'll be used responsibly.
		r.Put("/list", func(w http.ResponseWriter, r *http.Request) {
			_, claims, _ := jwtauth.FromContext(r.Context())
			id := claims["sub"].(string)
			data := &ListPutRequest{}
			render.Bind(r, data)
			lists[id] = data.List
		})
		r.Post("/login", Login)
	})
	log.Println("Server listening")
	http.ListenAndServe(":3000", r)
}

type ListPutRequest struct {
	List []Dog `json:"list"`
}

func (l *Dog) Bind(r *http.Request) error {
	return nil
}

func (l *ListPutRequest) Bind(r *http.Request) error {
	return nil
}

type DogResponse struct {
	Breeds map[string][]string `json:"message"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (l *LoginRequest) Bind(r *http.Request) error {
	if l.Username == "" || l.Password == "" {
		return errors.New("Missing required login fields")
	}

	return nil
}

type LoginResponse struct {
	Token string `json:"token"`
}

func (rd *LoginResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
} 

func Login(w http.ResponseWriter, r *http.Request) {
	data := &LoginRequest{}
	if err := render.Bind(r, data); err != nil {
		http.Error(w, http.StatusText(422), 422)
	}
	user, err := checkPassword(data.Username, data.Password)
	if err != nil {
		http.Error(w, http.StatusText(401), 401)
	}

	now := time.Now().Unix()
	exp := time.Now().Add(time.Hour * 4).Unix()
	_, token, _ := tokenAuth.Encode(map[string]interface{}{"sub": user.Id, "username": user.Username, "iat": now, "exp": exp})

	// is this the right status?
	render.Status(r, http.StatusAccepted)
	render.Render(w, r, NewLoginResponse(token))
}

func NewLoginResponse(t string) *LoginResponse {
	resp := &LoginResponse{Token: t}

	return resp
}

func checkPassword(username string, password string) (User, error) {
	// if we were using a proper db or in memory cache we could just query
	// by username but we're really free wheeling here
	for _, user := range users {
		if user.Username == username {
			if user.password == password {
				return user, nil
			}
			return User{}, errors.New("Incorrect Login Info")
		}
	}

	return User{}, errors.New("Incorrect Login Info")
}

func FileServer(r chi.Router, path string, root http.FileSystem) {
	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}
