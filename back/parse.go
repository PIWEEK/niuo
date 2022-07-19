package main

import (
	"time"
)

/*
   Transforms from Database objects to JSON dtos
 */

func (s ScrapbookDataInput) parse() ScrapbookDB {
	start, _ := time.Parse("2006-01-02", s.DateStart)
	end, _ := time.Parse("2006-01-02", s.DateEnd)

	return ScrapbookDB {
		Name: s.Name,
		Place: s.Place,
		People: s.People,
		DateStart: start,
		DateEnd: end,
	}
}
