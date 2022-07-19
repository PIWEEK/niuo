package main

import (
	"os"
	"fmt"
	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func (a *App) initDatabase() {
	host, ok := os.LookupEnv("NIUO_DB_HOST")
	if !ok {
		host = "localhost"
	}

	user, ok := os.LookupEnv("NIUO_DB_USER")
	if !ok {
		user = "niuo"
	}

	password, ok := os.LookupEnv("NIUO_DB_PASSWORD")
	if !ok {
		password = "niuo"
	}

	dbname, ok := os.LookupEnv("NIUO_DB_DBNAME")
	if !ok {
		dbname = "niuo"
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s",
		host, user, password, dbname)

	fmt.Printf("Connecting to %s\n", dsn)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Cannot connect to the database")
	}

	a.DB = db

	a.DB.AutoMigrate(
		&UserDB{},
		&ScrapbookDB{},
		&PageDB{},
		&SlotDB{},
	)
}

func (a *App) loadFixtures() {
	a.DB.Raw("truncate table user_dbs, scrapbook_dbs, page_dbs, slot_dbs");

	user := UserDB {}

	a.DB.Create(&user)

	fmt.Printf("%s", user.ID)

	a.DB.Create(&ScrapbookDB {
		Name: "Test1",
		UserID: user.ID,
	})
}

func (a *App) retrieveScrapbooks(user UserDB) []ScrapbookDB {
	var scrapbooks []ScrapbookDB
	a.DB.Find(&scrapbooks)
	return scrapbooks
}

func (a *App) retrieveUser(userId uuid.UUID) UserDB {
	var user UserDB
	a.DB.First(&user, userId)
	return user
}

func (a *App) createUser() UserDB {
	var user UserDB
	a.DB.Create(&user)
	return user
}

func (a *App) saveScrapbook(s *ScrapbookDB) {
	a.DB.Create(&s)
}
