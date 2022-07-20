package server

import (
	"github.com/google/uuid"
)

/*
   Transforms from Database objects to JSON dtos
 */

func (s ScrapbookDataInput) Parse() ScrapbookDB {
	return ScrapbookDB {
		Name: s.Name,
		Where: s.Where,
		Who: s.Who,
		When: s.When,
	}
}

func (p PageDataInput) Parse() PageDB {
	return PageDB {
		Type: p.Type,
		Order: 0,
	}
}

func ParseSlotList(pageId uuid.UUID, slots []SlotDataInput) []SlotDB {
	elems := len(slots)
	result := make([]SlotDB, elems)

	for i, slot := range slots {
    result[i] = slot.Parse(i, pageId)
	}

	return result
}

func (s SlotDataInput) Parse(numSlot int, pageId uuid.UUID) SlotDB {
	return SlotDB {
		NumSlot: numSlot,
		Type: s.Type,
		Status: "EMPTY",
		PageId: pageId,
		Text: s.Text,
	}
}
