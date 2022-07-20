package server

import (
	"github.com/gorilla/mux"
)

func (a *App) initRoutes() {
	a.Router = mux.NewRouter()

	//debugRoutes := a.Router.PathPrefix("/debug/").Subrouter()
	//debugRoutes.HandleFunc("/loadFixtures", a.LoadFixtures).Methods("GET")

	apiRoutes := a.Router.PathPrefix("/api/").Subrouter()
	apiRoutes.Use(a.CORSMiddleware)
	apiRoutes.Use(a.LoginMiddleware)

	// Scrapbooks
	apiRoutes.HandleFunc("/scrapbooks", a.Empty).Methods("OPTIONS")
	apiRoutes.HandleFunc("/scrapbooks", a.RetrieveScrapbooks).Methods("GET")
	apiRoutes.HandleFunc("/scrapbooks", a.CreateScrapbook).Methods("PUT")

	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}", a.Empty).Methods("OPTIONS")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}", a.GetScrapbookDetail).Methods("GET")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}", a.DeleteScrapbook).Methods("DELETE")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}", a.UpdateScrapbook).Methods("POST")

	// Pages
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages", a.Empty).Methods("OPTIONS")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages", a.AddScrapbookPage).Methods("PUT")

	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageNumber}", a.Empty).Methods("OPTIONS")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageNumber}", a.UpdateScrapbookPage).Methods("POST")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageNumber}", a.DeleteScrapbookPage).Methods("DELETE")

	// Slots
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageNumber}/{slotNumber}/image", a.Empty).Methods("OPTIONS")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageNumber}/{slotNumber}/image", a.SetSlotImage).Methods("POST")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageNumber}/{slotNumber}/image", a.GetSlotImage).Methods("GET")

	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageNumber}/{slotNumber}/text", a.Empty).Methods("OPTIONS")
	apiRoutes.HandleFunc("/scrapbooks/{scrapbookId}/pages/{pageNumber}/{slotNumber}/text", a.SetSlotText).Methods("POST")

}

