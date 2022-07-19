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

	Pages []PageDataOutput `json:"pages"`
}

type PageDataInput struct {
	Type string `json:"type"`
	Order int `json:"order"`
}

type PageDataOutput struct {
	PageDataInput

	ID string `json:"id"`
	Slots []SlotDataOutput `json:"slots"`
}

type SlotDataInput struct {
	Type string `json:"type"`
	Slot int `json:"slot"`
}

type SlotDataOutput struct {
	SlotDataInput
	State string `default:"EMPTY" json:"state"`
}
