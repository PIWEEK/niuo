package main

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func (a *App) initDatabase() {
	dsn := "host=localhost user=niuo password=niuo dbname=niuo"
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

func (a *App) retrieveScrapbooks() []ScrapbookDB {
	var scrapbooks []ScrapbookDB
	a.DB.Find(&scrapbooks)
	return scrapbooks
}
