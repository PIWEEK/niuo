package main

import (
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
	log.Fatal(http.ListenAndServe(addr, a.Router))
}

func main() {
	a := App{}
	a.Init()
	a.Start("0.0.0.0:8000")
}
