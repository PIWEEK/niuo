package server

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

	port, ok := os.LookupEnv("NIUO_DB_PORT")
	if !ok {
		port = "15432"
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
		"host=%s port=%s user=%s password=%s dbname=%s",
		host, port, user, password, dbname)

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

func (a *App) cleanDB() {
	a.DB.Raw("truncate table user_dbs, scrapbook_dbs, page_dbs, slot_dbs, slot_image_dbs");
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
	a.DB.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(&user)
	return user
}

func (a *App) saveScrapbook(s *ScrapbookDB) {
	a.DB.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(&s)
}

func (a *App) deleteScrapbook(s *ScrapbookDB) {
	a.DB.Delete(a.retrieveSlots(s.ID))
	a.DB.Where("scrapbook_id = ?", s.ID).Delete(&PageDB{})
	a.DB.Delete(s)
}

func (a *App) savePage(p *PageDB) {
	a.DB.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(&p)
}

func (a *App) deletePage(p *PageDB) {
	a.DB.Where("page_id = ?", p.ID).Delete(&SlotDB{})
	a.DB.Delete(p)
}

func (a *App) saveSlot(s *SlotDB) {
	a.DB.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(&s)
}

func (a *App) deleteSlot(s *SlotDB) {
	a.DB.Delete(s)
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

func (a *App) retrievePageByNumber(scrapbookId uuid.UUID, pageNumber int) (PageDB, error) {
	var page PageDB
	result := a.DB.
		Where("scrapbook_id = ? and page_dbs.order = ?", scrapbookId, pageNumber).
		First(&page)

	if result.Error != nil {
		return PageDB{}, result.Error
	}

	return page, nil
}

func (a *App) retrieveSlots(scrapbookId uuid.UUID) []SlotDB {
	var slots []SlotDB

	a.DB.
		Joins("JOIN page_dbs ON page_dbs.id = slot_dbs.page_id and page_dbs.scrapbook_id = ?", scrapbookId).
		Order("slot_dbs.num_slot asc").
		Where("scrapbook_id = ?", scrapbookId).
		Find(&slots)

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
