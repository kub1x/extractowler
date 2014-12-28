NAME=diplomka

all: compile run

compile:
	# dvakrat, kvuli referencovani
	pdfcsplain.exe ${NAME}.tex
	pdfcsplain.exe ${NAME}.tex
	#pdflatex *.tex

edit:
	vim ${NAME}.tex

run:
	cygstart ${NAME}.pdf

acro_kill:
	taskkill.exe /IM AcroRd32.exe || true
	#taskkill.exe /PID `ps -W | grep "AcroRd32.exe" | cut -s -d' ' -f4 | tail -1`

#deploy: 
	#cp jakub_podlaha-cv.pdf /cygdrive/c/Users/kub1x/Downloads/

clean: 
	rm *.aux *.blg *.dvi *.log *.out
