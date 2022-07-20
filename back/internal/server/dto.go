package server

type ScrapbookDataInput struct {
	Name  string `json:"name"`
	Where string `json:"where"`
	When  string `json:"when"`
	Who   string `json:"who"`
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
	Text string `json:"text,omitempty"`
}

type SlotDataOutput struct {
	SlotDataInput
	State string `default:"EMPTY" json:"state"`
}
