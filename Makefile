.PHONY: run install

install:
	cd frontend; npm install

run:
	cd frontend; npm run build
	go run .