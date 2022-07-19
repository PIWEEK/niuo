package main

import (
	"context"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"net/http"
)

const COOKIE_NAME = "niuo-auth"

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func (a *App) LoginMiddleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func (w http.ResponseWriter, r *http.Request) {

		cookie, err := r.Cookie(COOKIE_NAME)

		if err != nil && err != http.ErrNoCookie {
			respondWithError(w, 500, "Cannot set the cookie")
			return
		}

		var user UserDB

		if cookie != nil {
			userId, err := uuid.Parse(cookie.Value)

			if err != nil {
				respondWithError(w, 500, "Cannot read the cookie")
				return
			}

			user = a.retrieveUser(userId)
		} else {
			user = a.createUser()
			cookie := http.Cookie {
				Name: COOKIE_NAME,
				Value: user.ID.String(),
			}
			http.SetCookie(w, &cookie)
		}

		h.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), "user", user)))
	})
}

func (a *App) CORSMiddleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func (w http.ResponseWriter, r *http.Request) {

		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		} else {
			h.ServeHTTP(w, r)
		}
	})
}

func (a *App) initRoutes() {
	a.Router = mux.NewRouter()

	//debugRoutes := a.Router.PathPrefix("/debug/").Subrouter()
	//debugRoutes.HandleFunc("/loadFixtures", a.LoadFixtures).Methods("GET")

	apiRoutes := a.Router.PathPrefix("/api/").Subrouter()
	apiRoutes.Use(a.CORSMiddleware)
	apiRoutes.Use(a.LoginMiddleware)

	// Scrapbooks
	apiRoutes.HandleFunc("/scrapbooks", a.RetrieveScrapbooks).Methods("GET")
	apiRoutes.HandleFunc("/scrapbooks", a.CreateScrapbook).Methods("PUT")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}", a.GetScrapbookDetail).Methods("GET")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}", a.DeleteScrapbook).Methods("DELETE")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}", a.UpdateScrapbook).Methods("POST")

	// Pages
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages", a.AddScrapbookPage).Methods("PUT")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageId}", a.UpdateScrapbookPage).Methods("POST")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageId}", a.DeleteScrapbookPage).Methods("DELETE")

	// Slots
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageNumber}/{slot}/image", a.SetSlotImage).Methods("POST")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageNumber}/{slot}/text", a.SetSlotText).Methods("POST")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageNumber}/{slot}/data", a.SetSlotData).Methods("POST")

}

func (a *App) LoadFixtures(w http.ResponseWriter, r *http.Request) {
	a.loadFixtures()
	respondWithJSON(w, 200, map[string]string{ "result": "OK" })
}

func (a *App) RetrieveScrapbooks(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value("user").(UserDB)

	if !ok {
		respondWithError(w, 400, "Not authorized")
		return
	}

	scrapbooks := a.retrieveScrapbooks(user)
	respondWithJSON(w, 200, FormatScrapbooksList(scrapbooks));
}

func decode(w http.ResponseWriter, r *http.Request, result interface{}) bool {
	err := json.NewDecoder(r.Body).Decode(result)

	if err != nil {
		respondWithError(w, 400, "Cannot decode body")
	}
	return err == nil
}

func (a *App) CreateScrapbook(w http.ResponseWriter, r *http.Request) {
	var s ScrapbookDataInput

	user, ok := r.Context().Value("user").(UserDB)

	if ok && decode(w, r, &s) {
		scrapbook := s.parse()
		scrapbook.User = user

		a.saveScrapbook(&scrapbook)
		result := scrapbook.FormatBasic()
		respondWithJSON(w, 200, result)
	}

}

func (a *App) GetScrapbookDetail(w http.ResponseWriter, r *http.Request) {}
func (a *App) DeleteScrapbook(w http.ResponseWriter, r *http.Request) {}
func (a *App) UpdateScrapbook(w http.ResponseWriter, r *http.Request) {}
func (a *App) AddScrapbookPage(w http.ResponseWriter, r *http.Request) {}
func (a *App) UpdateScrapbookPage(w http.ResponseWriter, r *http.Request) {}
func (a *App) DeleteScrapbookPage(w http.ResponseWriter, r *http.Request) {}
func (a *App) SetSlotImage(w http.ResponseWriter, r *http.Request) {}
func (a *App) SetSlotText(w http.ResponseWriter, r *http.Request) {}
func (a *App) SetSlotData(w http.ResponseWriter, r *http.Request) {}
