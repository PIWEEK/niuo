package main

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)


type Base struct {
	ID uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
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

	Name string
	Place string
	DateStart time.Time
	DateEnd time.Time
	People []string `gorm:"type:text[]"`

	UserID uuid.UUID
	User UserDB `gorm:"foreignKey:UserID"`
}

type PageDB struct {
	Base

	Type string
	Order int

	ScrapbookID uuid.UUID
	Scrapbook ScrapbookDB
}

type SlotDB struct {
	Base

	PageId uuid.UUID
	Page PageDB
}
