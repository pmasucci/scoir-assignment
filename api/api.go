package api

import (
	"github.com/go-chi/chi/v5"
	"net/http"
)

type api struct{}

func (a api) Routes() chi.Router {
	r := chi.NewRouter()
	r.Get("/auth", a.Authorize)

	return r
}

func (a api) Authorize(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

}
