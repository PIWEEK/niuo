package main

/*
   Transforms from Database objects to JSON dtos
 */
func (s ScrapbookDB) FormatBasic() ScrapbookDataOutputBasic {
	return ScrapbookDataOutputBasic {
		ScrapbookDataInput: ScrapbookDataInput {
			Name: s.Name,
			Place: s.Place,
			DateStart: s.DateStart.String(),
			DateEnd: s.DateEnd.String(),
			People: s.People,
		},

		ID: s.ID.String(),
	}
}

func FormatScrapbooksList(s []ScrapbookDB) []ScrapbookDataOutputBasic {
	elems := len(s)
	result := make([]ScrapbookDataOutputBasic,elems)

	for i, v := range s {
    result[i] = v.FormatBasic()
	}

	return result
}
