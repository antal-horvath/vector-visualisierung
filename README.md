# vector-visualisierung
Projekt zur **Visualisierung von Vektoren in der Ebene**.

## Benutzung
Das Programm zur Vektorvisualisierung dient dem Verständnis und soll den Lernenden beim Erarbeiten der Darstellung einer Ebene durch zwei (linear unabhängige) Vektoren helfen.
Die Lernenden haben das Ziel Punkte in einer Ebene zu erreichen, indem sie sich mit den Vektoren im Raum bewegen.

Zum öffnen des Programmes müssen die Schülerinnen und Schüler die index.html Datei speichern und (in einem Browser ihrer Wahl) ausführen.

## Steuerung
Befehle werden durch Klicken von Tasten ausgeführt:

Die Bewegungen: 
- Vektor **a** addieren:  🇼 *oder*  ⬆️
- Vektor **a** subtrahieren:  🇸 *oder* ⬇️
- Vektor **b** addieren: 🇩 *oder* ➡️
- Vektor **b** subtrahieren 🇦 *oder* ⬅️

Punkt wieder auf (0,0,0) setzen: 0️⃣

Ebene zeichnen: 1️⃣

Punkte in der Ebene Zeichnern: 2️⃣

Neue Ausgangsvektoren: 🇳

## Didaktisches Konzept
Ziel bei der Bearbeitung mit der Visualisierung ist:

- Die Lernenden entdecken spielerisch, dass Punkte in einer Ebene erreicht werden können, indem sie die beiden Vektoren miteinander addieren.
- Die Lernenden fördern ihr Verständnis vom 3-Dimensionalem Raum
- Die Lernenden erhalten ein besseres Konzept von Vektoren, Ebenen und Punkten

Das spielerische wird mit Aufgaben ergänzt um die Lernerfahrung und das Verständnis zu steigern

## Mögliche Aufgaben

Im folgenden werden Beispiele für Aufgaben aufgelistet um die Visualisierung sinnvoll im Unterricht zu implementieren.

1. Die Bewege den blauen Punkt mit Hilfe der Pfeiltasten, so dass er den Grünen Punkt erreicht. wiederhole dies, bis du 10 Punkte erreicht hast.
2. Schalte nun die Ebene mit **1** ein und drehe die Ansicht ein wenig. Wiederhole die 1. Aufgabe und mache noch einmal 3 Punkte.
   1. Notiere, was dir auffällt. Wo liegen die Punkte und die Vektoren, die du verwendest?
   2. Erzeuge die Ebene mit **2** und beobachte, was passiert.
3. Schau dir die Punkte **Current** und **P** an. Current ist der aktuelle plaue Punkt und P ist der zu erreichende Punkt. Wenn du die Vektoren a beziehungsweise b addiert oder subtrahierst (Pfeiltaste klickst) was passiert dann mit den Koordinaten des Punkt **Current**? Notiere die Erkenntnisse.
4. Versuche den Punkt **P** rechnerisch zu erreichen indem du die eine Gleichungssystem aufstellst (P=t*a+s*b) und bestimme wie oft a und b verwendet werden müssen um den Punt zu erreichen. Überprüfe indem du die Pfeiltasten so oft klickst wie du bestimmt hast.
5. Generiere neue Vektoren mit **N** und wiederhole Aufgaben deiner Wahl. Wie sieht die Ebene aus, die durch die neuen Vektoren erzeugt wird?



## Umsetzung des Projektes
**Vektorvisualisierung** ist im Rahmen des Wahlmoduls 1.11 an der PH Muttenz FHNW zustande gekommen. Es handelt sich bei dem fertigen Produkt um ein GeoGebra Applet, welches mit Javascript eingebunden wurde und als HTML-Datei (entweder lokal oder via Link) ausführbar ist.

Warum haben wir uns für diese Tools entschieden?
- GeoGebra: Im Mathematikunterricht bereits bekannt (auch den SuS). Nützliches Tool für Visualisierungen von Funktionen in 2-3 dimensionalen Koordinatensystemen. Viele der benötigten Funktionen waren bereits verfügbar und mussten nur korrekt integriert werden.
- Javascript: Die Einbettung mit Javascript vereinfacht die Programmierung komplexerer Prozesse (wie das Zeichnen der Ebene) und ermöglicht eine Steuerung durch Nutzung der Tastatur.
- HTML: Erlaubt es das in Javascript eingebundene GeoGebra Applet einfach anzuzeigen. Für die SuS bedeutet dies, dass sie sich nicht mit diversen Dateien rumschlagen müssen, sondern die HTML-Datei (index.html) einfach lokal speichern und in einem Browser ihrer Wahl ausführen.
