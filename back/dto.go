package main

type ScrapbookDataInput struct {
	Name string `json:"name"`
	Place string `json:"place"`
	DateStart string `json:"dateStart"`
	DateEnd string `json:"dateEnd"`
	People []string `json:"people"`
}

type ScrapbookDataOutputBasic struct {
	ScrapbookDataInput

	ID string `json:"id"`
}

type ScrapbookDataOutputDetail struct {
	ScrapbookDataOutputBasic

	Pages []PagesDataOutput `json:"pages"`
}

type PagesDataInput struct {
	Type string `json:"type"`
}

type PagesDataOutput struct {
	PagesDataInput

	ID string `json:"id"`
	Slots []SlotDataOutput `json:"slots"`
}

type SlotDataOutput struct {
	Type string `json:"type"`
	State string `default:"EMPTY" json:"state"`
}
