package server

/*
   Transforms from Database objects to JSON dtos
 */
func (s ScrapbookDB) FormatBasic() ScrapbookDataOutputBasic {
	return ScrapbookDataOutputBasic {
		ScrapbookDataInput: ScrapbookDataInput {
			Name: s.Name,
			Where: s.Where,
			When: s.When,
			Who: s.Who,
		},

		ID: s.ID.String(),
	}
}

func (s ScrapbookDB) FormatAdvanced(pages []PageDB, slots []SlotDB) ScrapbookDataOutputDetail {
	return ScrapbookDataOutputDetail {
		ScrapbookDataOutputBasic: s.FormatBasic(),
		Pages: FormatPageList(pages, slots),
	}
}

func (p PageDB) FormatBasic(slots []SlotDataOutput) PageDataOutput {
	return PageDataOutput {
		PageDataInput: PageDataInput {
			Type: p.Type,
			Order: p.Order,
		},
		ID: p.ID.String(),
		Slots: slots,
	}
}

func (slot SlotDB) FormatBasic() SlotDataOutput {
	return SlotDataOutput {
		SlotDataInput: SlotDataInput {
			Type: slot.Type,
			Slot: slot.NumSlot,
		},
		State: slot.Status,
	}
}

func FormatScrapbooksList(s []ScrapbookDB) []ScrapbookDataOutputBasic {
	elems := len(s)
	result := make([]ScrapbookDataOutputBasic, elems)

	for i, v := range s {
    result[i] = v.FormatBasic()
	}

	return result
}

func FormatPageList(pages []PageDB, slots []SlotDB) []PageDataOutput {
	elems := len(pages)
	result := make([]PageDataOutput, elems)

	for i, page := range pages {
		pageSlots := make([]SlotDataOutput, 0)

		for _, slot := range slots {
			if slot.PageId == page.ID {
				pageSlots = append(pageSlots, slot.FormatBasic())
			}
		}
		result[i] = page.FormatBasic(pageSlots)
	}

	return result
}
