package main

import (
	"os"
	"fmt"
	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
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
		&SlotImageDB{},
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

func (a *App) savePage(p *PageDB) {
	a.DB.Create(&p)
}

func (a *App) saveSlot(s *SlotDB) {
	a.DB.Create(&s)
}

func (a *App) saveSlots(slots []SlotDB) {
	for _, slot := range slots {
		a.saveSlot(&slot)
	}
}

func (a *App) retrieveScrapbookById(scrapbookId uuid.UUID) (ScrapbookDB, error) {
	scrapbook := ScrapbookDB{}
	result := a.DB.First(&scrapbook, scrapbookId)
	return scrapbook, result.Error
}

func (a *App) retrievePages(scrapbookId uuid.UUID) []PageDB {
	var pages []PageDB
	a.DB.
		Where("scrapbook_id = ?", scrapbookId).
		Order("page_dbs.Order asc").
		Find(&pages)
	return pages
}

func (a *App) retrievePageByNumber(scrapbookId uuid.UUID, pageNumber int) PageDB {
	var page PageDB
	a.DB.
		Where("scrapbook_id = ? and page_dbs.order = ?", scrapbookId, pageNumber).
		First(&page)
	return page
}

func (a *App) retrieveSlots(scrapbookId uuid.UUID) []SlotDB {
	var slots []SlotDB

	a.DB.
		Joins("JOIN page_dbs ON page_dbs.id = slot_dbs.page_id and page_dbs.scrapbook_id = ?", scrapbookId).
		Order("slot_dbs.num_slot asc").
		Where("scrapbook_id = ?", scrapbookId).Find(&slots)

	return slots
}

func (a *App) getLastPageOrder(scrapbookId uuid.UUID) int {
	var page PageDB

	result := a.DB.
		Where("scrapbook_id = ?", scrapbookId).
		Order("page_dbs.Order desc").
		First(&page)

	if result.Error != nil {
		return 0
	}

	return page.Order
}

func (a *App) saveSlotImage(slotImage *SlotImageDB) {
	a.DB.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(slotImage)
}

func (a *App) getSlotImage(slotImage *SlotImageDB, pageId uuid.UUID, slot int){
	a.DB.
		Where("page_id = ? and slot = ?", pageId, slot).
		First(&slotImage)
}
