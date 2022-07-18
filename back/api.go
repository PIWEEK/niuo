package main

import (
	"github.com/gorilla/mux"
	"net/http"
	"encoding/json"
)

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func (a *App) initRoutes() {
	a.Router = mux.NewRouter()
	a.Router.HandleFunc("/debug/loadFixtures", a.LoadFixtures).Methods("GET")
	a.Router.HandleFunc("/scrapbooks", a.RetrieveScrapbooks).Methods("GET")
}

func (a *App) LoadFixtures(w http.ResponseWriter, r *http.Request) {
	a.loadFixtures()
	respondWithJSON(w, 200, map[string]string{ "result": "OK" })
}

func (a *App) RetrieveScrapbooks(w http.ResponseWriter, r *http.Request) {
	scrapbooks := a.retrieveScrapbooks()
	respondWithJSON(w, 200, scrapbooks);
}
