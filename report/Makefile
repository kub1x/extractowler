all: acro_kill compile run

compile:
	# dvakrat, kvuli referencovani
	pdfcsplain.exe minimal.tex
	pdfcsplain.exe minimal.tex
	#pdflatex *.tex

edit:
	vim *.tex

run:
	cygstart minimal.pdf

acro_kill:
	taskkill.exe /IM AcroRd32.exe || true
	#taskkill.exe /PID `ps -W | grep "AcroRd32.exe" | cut -s -d' ' -f4 | tail -1`

#deploy: 
	#cp jakub_podlaha-cv.pdf /cygdrive/c/Users/kub1x/Downloads/

clean: 
	rm *.aux *.bbl *.blg *.dvi *.log *.out
