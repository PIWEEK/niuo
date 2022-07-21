package server

import (
	"fmt"
	"io"
	"strconv"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"net/http"
)

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func decode(w http.ResponseWriter, r *http.Request, result interface{}) bool {
	err := json.NewDecoder(r.Body).Decode(result)

	if err != nil {
		respondWithError(w, 400, "Cannot decode body")
	}
	return err == nil
}

func (a *App) findScrapbook(w http.ResponseWriter, r *http.Request) (ScrapbookDB, bool) {
	vars := mux.Vars(r)
	scrapbookId, err := uuid.Parse(vars["scrapbookId"])

	if err != nil {
		respondWithError(w, 400, "Cannot decode id")
		return ScrapbookDB{}, false
	}

	scrapbook, err := a.retrieveScrapbookById(scrapbookId)

	if err != nil {
		respondWithError(w, 404, "Not found")
		return scrapbook, false
	}

	return scrapbook, true
}

func (a *App) findPage(w http.ResponseWriter, r *http.Request, scrapbook ScrapbookDB) (PageDB, bool) {
	vars := mux.Vars(r)
	pageNumber, err := strconv.Atoi(vars["pageNumber"])

	if err != nil {
		respondWithError(w, 400, "Cannot decode pageNumber")
		return PageDB{}, false
	}

	page, err := a.retrievePageByNumber(scrapbook.ID, pageNumber)
	if err != nil {
		respondWithError(w, 404, "Not found")
		return page, false
	}

	return page, true
}

// API


func (a *App) Empty(w http.ResponseWriter, r *http.Request) {
}

func (a *App) RetrieveScrapbooks(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value("user").(UserDB)

	if !ok {
		respondWithError(w, 400, "Not authorized")
		return
	}

	scrapbooks := a.retrieveScrapbooks(user)
	respondWithJSON(w, 200, FormatScrapbooksList(scrapbooks));
}

func (a *App) CreateScrapbook(w http.ResponseWriter, r *http.Request) {
	var s ScrapbookDataInput

	user, ok := r.Context().Value("user").(UserDB)

	if ok && decode(w, r, &s) {
		scrapbook := s.Parse()
		scrapbook.User = user

		a.saveScrapbook(&scrapbook)

		page := PageDB{}
		page.Type = "cover"
		page.Order = 0
		page.ScrapbookID = scrapbook.ID
		a.savePage(&page)

		result := scrapbook.FormatBasic()
		respondWithJSON(w, 200, result)
	}
}

func (a *App) GetScrapbookDetail(w http.ResponseWriter, r *http.Request) {
	scrapbook, ok := a.findScrapbook(w, r)

	if ok {
		pages := a.retrievePages(scrapbook.ID)
		slots := a.retrieveSlots(scrapbook.ID)
		result := scrapbook.FormatAdvanced(pages, slots)
		respondWithJSON(w, 200, result)
	}
}

func (a *App) CreateSlots(pageType string) []SlotDataInput {
	switch pageType {
	  case "emotions":
		  return []SlotDataInput {}

	  case "color":
		  return []SlotDataInput {
				SlotDataInput {Type: "image"},
				SlotDataInput {Type: "text"},
			}

		case "text_image":
		  return []SlotDataInput {
			  SlotDataInput {Type: "image"},
				SlotDataInput {Type: "text"},
			}

	  case "activity_checklist":
		  return []SlotDataInput {
				SlotDataInput {Type: "image"},
				SlotDataInput {Type: "text"},

				SlotDataInput {Type: "image"},
				SlotDataInput {Type: "text"},

				SlotDataInput {Type: "image"},
				SlotDataInput {Type: "text"},

				SlotDataInput {Type: "image"},
				SlotDataInput {Type: "text"},

				SlotDataInput {Type: "image"},
				SlotDataInput {Type: "text"},

				SlotDataInput {Type: "image"},
				SlotDataInput {Type: "text"},
			}

	  default:
		  return []SlotDataInput {}
	}
}

func (a *App) AddScrapbookPage(w http.ResponseWriter, r *http.Request) {
	scrapbook, ok := a.findScrapbook(w, r)
	var p PageDataInput

	if ok && decode(w, r, &p){
		lastPageOrder := a.getLastPageOrder(scrapbook.ID)
		page := p.Parse()
		page.Order = lastPageOrder + 1
		slots := a.CreateSlots(page.Type)
		page.ScrapbookID = scrapbook.ID

		a.savePage(&page)
		slotsdb := ParseSlotList(page.ID, slots)

		a.saveSlots(slotsdb)
		a.GetScrapbookDetail(w, r)
	}
}

func (a *App) DeleteScrapbook(w http.ResponseWriter, r *http.Request) {
	scrapbook, ok := a.findScrapbook(w, r)

	if ok {
		a.deleteScrapbook(&scrapbook)
		respondWithJSON(w, 204, map[string]string { "result": "OK" })
	}
}

func (a *App) UpdateScrapbook(w http.ResponseWriter, r *http.Request) {
	var s ScrapbookDataInput

	old, ok := a.findScrapbook(w, r)

	if ok && decode(w, r, &s) {
		scrapbook := s.Parse()

		scrapbook.Base = old.Base
		scrapbook.UserID = old.UserID

		a.saveScrapbook(&scrapbook)
		result := scrapbook.FormatBasic()
		respondWithJSON(w, 200, result)
	}
}

func (a *App) UpdateScrapbookPage(w http.ResponseWriter, r *http.Request) {
	scrapbook, ok := a.findScrapbook(w, r)

	if ok {
		page, ok := a.findPage(w, r, scrapbook)

		if ok {
			a.deletePage(&page)
		}
	}
}

func (a *App) DeleteScrapbookPage(w http.ResponseWriter, r *http.Request) {
	scrapbook, ok := a.findScrapbook(w, r)

	if ok {
		page, ok := a.findPage(w, r, scrapbook)

		if ok {
			a.deletePage(&page)
		}
	}
}

func (a *App) SetSlotImage(w http.ResponseWriter, r *http.Request) {
	scrapbook, ok := a.findScrapbook(w, r)

	if ok {
		page, ok := a.findPage(w, r, scrapbook)

		if ok {
			vars := mux.Vars(r)
			slotNumber, _ := strconv.Atoi(vars["slotNumber"])

			file, fileHeader, err := r.FormFile("file")

			fmt.Printf("??%v", err)

			if err != nil {
				respondWithError(w, 404, "Cannot read the file")
				fmt.Printf("Cannot read the file\n")
				return
			}

			fileName := fileHeader.Filename
			size := fileHeader.Size

			defer file.Close()

			data, err := io.ReadAll(file)

			if err != nil {
				respondWithError(w, 404, "Cannot read the file data")
				return
			}

			slot := a.getSlotByNumber(page.ID, slotNumber)
			slot.Status = "FILLED"
			a.saveSlot(&slot)

			slotImage := SlotImageDB {
				PageId: page.ID,
				Slot: slotNumber,
				Data: data,
			}

			a.saveSlotImage(&slotImage)
			respondWithJSON(w, 200, map[string]any{ "fileName": fileName, "size": size })
		}
	}
}

func (a *App) GetSlotImage(w http.ResponseWriter, r *http.Request) {
	scrapbook, ok := a.findScrapbook(w, r)

	if ok {
		page, ok := a.findPage(w, r, scrapbook)

		if ok {
			vars := mux.Vars(r)
			slotNumber, _ := strconv.Atoi(vars["slotNumber"])

			var slotImage SlotImageDB
			a.getSlotImage(&slotImage, page.ID, slotNumber)

			w.WriteHeader(200)
			w.Write(slotImage.Data)
		}
	}
}

func (a *App) SetSlotText(w http.ResponseWriter, r *http.Request) {
	var data SlotDataInput

	scrapbook, ok := a.findScrapbook(w, r)

	if ok && decode(w, r, &data) {
		page, ok := a.findPage(w, r, scrapbook)

		if ok {
			vars := mux.Vars(r)
			slotNumber, _ := strconv.Atoi(vars["slotNumber"])
			slot := a.getSlotByNumber(page.ID, slotNumber)

			slot.Text = data.Text
			slot.Status = "FILLED"

			a.saveSlot(&slot)

			w.WriteHeader(204)
		}
	}
}

func (a *App) DuplicateScrapbook(w http.ResponseWriter, r *http.Request) {
	scrapbook, ok := a.findScrapbook(w, r)

	if ok {
		pages := a.retrievePages(scrapbook.ID)
		slots := a.retrieveSlots(scrapbook.ID)

		for _, page := range pages {
			pageId := page.ID

			page.Base = Base{}
			a.savePage(&page)

			for _, slot := range slots {
				if slot.PageId == pageId {
					slotNumber := slot.NumSlot

					slot.Base = Base{}
					slot.PageId = page.ID
					a.saveSlot(&slot)

					if slot.Type == "IMAGE" && slot.Status == "FILLED" {
						var slotImage SlotImageDB
						a.getSlotImage(&slotImage, pageId, slotNumber)

						slotImage.PageId = page.ID
						a.saveSlotImage(&slotImage)
					}
				}
			}
		}

		scrapbook.Base = Base{}
		a.saveScrapbook(&scrapbook)

		result := scrapbook.FormatAdvanced(pages, slots)
		respondWithJSON(w, 200, result)
	}

}

func (a *App) MovePage(w http.ResponseWriter, r *http.Request) {
}
