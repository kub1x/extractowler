NAME=diploma_thesis-podlajak

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

clean: 
	rm *.aux *.blg *.dvi *.log *.out *.ref *.lbr
