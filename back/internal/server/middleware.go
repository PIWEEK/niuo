package server

import (
	"context"
	"github.com/google/uuid"
	"net/http"
)

const COOKIE_NAME = "niuo-auth"

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
