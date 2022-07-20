package server

import (
	"fmt"
	"gorm.io/gorm"
	"github.com/gorilla/mux"
	"net/http"
	"log"
)

type App struct {
	Router *mux.Router
	DB     *gorm.DB
}

func (a *App) Init() (err error){
	a.initDatabase()
	a.initRoutes()
	return
}

func (a *App) Start(addr string) {
	fmt.Printf("Listening %s\n", addr)
	log.Fatal(http.ListenAndServe(addr, a.Router))
}
