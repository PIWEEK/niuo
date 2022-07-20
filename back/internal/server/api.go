package server

import (
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
		vars := mux.Vars(r)

		pageNumber, _ := strconv.Atoi(vars["pageNumber"])
		slot, _ := strconv.Atoi(vars["slot"])

		page, err := a.retrievePageByNumber(scrapbook.ID, pageNumber)

		if err != nil {
			respondWithError(w, 404, "Page not found")
			return
		}

		file, fileHeader, err := r.FormFile("file")

		fileName := fileHeader.Filename
		size := fileHeader.Size

		if err != nil {
			respondWithError(w, 404, "Cannot read the file")
			return
		}

		defer file.Close()

		data, err := io.ReadAll(file)

		if err != nil {
			respondWithError(w, 404, "Cannot read the file data")
			return
		}

		slotImage := SlotImageDB {
		  PageId: page.ID,
			Slot: slot,
			Data: data,
		}

		a.saveSlotImage(&slotImage)
		respondWithJSON(w, 200, map[string]any{ "fileName": fileName, "size": size })
	}
}

func (a *App) GetSlotImage(w http.ResponseWriter, r *http.Request) {
	scrapbook, ok := a.findScrapbook(w, r)

	if ok {
		vars := mux.Vars(r)

		pageNumber, _ := strconv.Atoi(vars["pageNumber"])
		slot, _ := strconv.Atoi(vars["slot"])

		page, err := a.retrievePageByNumber(scrapbook.ID, pageNumber)

		if err != nil {
			respondWithError(w, 404, "Page not found")
		}

		var slotImage SlotImageDB
		a.getSlotImage(&slotImage, page.ID, slot)

		w.WriteHeader(200)
		w.Write(slotImage.Data)
	}
}

func (a *App) SetSlotText(w http.ResponseWriter, r *http.Request) {}
func (a *App) SetSlotData(w http.ResponseWriter, r *http.Request) {}
