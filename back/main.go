package main

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/gorilla/mux"
	"net/http"
	"encoding/json"
	"log"
)

type Base struct {
	ID uuid.UUID `gorm:"type:uuid;primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (base *Base) BeforeCreate(db *gorm.DB) (err error) {
	base.ID = uuid.New()
	return
}

type UserDB struct {
	Base
}

type ScrapbookDB struct {
	Base

	Name string `gorm:"column:name;size:128;not null"`
	UserID uuid.UUID `gorm:"type:uuid;column:user_foreign_key;not null;"`
}

/*
func main() {
	dsn := "host=localhost user=niuo password=niuo dbname=niuo"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to the database")
	}

	db.AutoMigrate(
		&UserDB{},
		&ScrapbookDB{},
	)
  }
*/

type App struct {
	Router *mux.Router
	DB     *gorm.DB
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}


func (a *App) Init() (err error){
	dsn := "host=localhost user=niuo password=niuo dbname=niuo"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	a.DB = db

	a.Router = mux.NewRouter()
	a.initRoutes()
	return
}

func (a *App) initRoutes() {
	a.Router.HandleFunc("/test", a.test).Methods("GET")
}

func (a *App) test(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, 200, map[string]string {"test": "ok"})
}

func (a *App) Run(addr string) {
	log.Fatal(http.ListenAndServe(addr, a.Router))
}


func main() {
	a := App{}

	a.Init()
	a.Run("0.0.0.0:8000")
}
