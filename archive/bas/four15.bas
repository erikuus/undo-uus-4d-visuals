' 4-D kuubi po"o"rlemine 4-D ruumis. Kuubi servad on antud punktidena.
' Mida kaugemal neljandas dimensioonis punktid asuvad, seda no~rgema
' heledusega nad paistavad.

DEFINT I-Q
DEFSNG A-H
DEFSNG R-Z

DIM NXS(1 TO 2)
DIM FIS(1 TO 2)
DIM DF(1 TO 4, 1 TO 4)
DIM F(1 TO 4, 1 TO 4)
DIM T4(1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2, 1 TO 4)
DIM T2(1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2)

COMMON SHARED XSCALE, YSCALE, WSCALE, NXSHIFT, NYSHIFT, NDOT
DECLARE SUB DOTLINE (X1, X2, Y1, Y2, W1, W2)

SCREEN 12
PALETTE 0, 65793 * 0
PALETTE 1, 65793 * 10
PALETTE 2, 65793 * 12
PALETTE 3, 65793 * 14
PALETTE 4, 65793 * 16
PALETTE 5, 65793 * 19
PALETTE 6, 65793 * 22
PALETTE 7, 65793 * 25
PALETTE 8, 65793 * 28
PALETTE 9, 65793 * 32
PALETTE 10, 65793 * 36
PALETTE 11, 65793 * 40
PALETTE 12, 65793 * 45
PALETTE 13, 65793 * 50
PALETTE 14, 65793 * 56
PALETTE 15, 65793 * 63
WSCALE = 2!

TWOPI = 6.283185

FISTEREO = .16
FIS(1) = FISTEREO * .5
FIS(2) = FISTEREO * -.5

XSCALE = 100!
YSCALE = 99!
NXPIXELS = 640
NYPIXELS = 480
NXS(1) = NXPIXELS * (.5 - .25)
NXS(2) = NXPIXELS * (.5 + .25)
NYSHIFT = NYPIXELS / 2

A = .75
NDOT = 150

DFXY = .17
DFXZ = .35
DFYZ = -.79
DFXW = .42
DFYW = -.52
DFZW = .29
FAC = -.04

DF(2, 1) = DFXY * FAC
DF(3, 1) = DFXZ * FAC
DF(3, 2) = DFYZ * FAC
DF(4, 1) = DFXW * FAC
DF(4, 2) = DFYW * FAC
DF(4, 3) = DFZW * FAC

FOR M = 1 TO 4
FOR N = 1 TO 4
F(M, N) = -DF(M, N)
NEXT N
NEXT M

' =====================================================================

DO

FOR I = 1 TO 2
FOR J = 1 TO 2
FOR K = 1 TO 2
FOR L = 1 TO 2
	T4(1, J, K, L, 1) = A
	T4(2, J, K, L, 1) = -A
	T4(I, 1, K, L, 2) = A
	T4(I, 2, K, L, 2) = -A
	T4(I, J, 1, L, 3) = A
	T4(I, J, 2, L, 3) = -A
	T4(I, J, K, 1, 4) = A
	T4(I, J, K, 2, 4) = -A
NEXT L
NEXT K
NEXT J
NEXT I

FOR M = 2 TO 4
	FOR N = 1 TO M - 1
		FI = F(M, N)
		FI = FI + DF(M, N)
		IF FI > TWOPI THEN FI = FI - TWOPI
		IF FI < 0! THEN FI = FI + TWOPI
		F(M, N) = FI
		S = SIN(FI)
		C = COS(FI)

		FOR I = 1 TO 2
		FOR J = 1 TO 2
		FOR K = 1 TO 2
		FOR L = 1 TO 2
		TIPM = T4(I, J, K, L, M) * C - T4(I, J, K, L, N) * S
		TIPN = T4(I, J, K, L, M) * S + T4(I, J, K, L, N) * C
		T4(I, J, K, L, M) = TIPM
		T4(I, J, K, L, N) = TIPN
		NEXT L
		NEXT K
		NEXT J
		NEXT I
	NEXT N
NEXT M

CLS 1

FOR IST = 1 TO 2
NXSHIFT = NXS(IST)
FI = FIS(IST)
S = SIN(FI)
C = COS(FI)
	FOR I = 1 TO 2
	FOR J = 1 TO 2
	FOR K = 1 TO 2
	FOR L = 1 TO 2
	T2(I, J, K, L, 1) = T4(I, J, K, L, 1) * C - T4(I, J, K, L, 3) * S
	T2(I, J, K, L, 2) = T4(I, J, K, L, 2)
	NEXT L
	NEXT K
	NEXT J
	NEXT I

	FOR I1 = 1 TO 2
	FOR I2 = 1 TO 2
	FOR I3 = 1 TO 2
		X1 = T2(1, I1, I2, I3, 1)
		X2 = T2(2, I1, I2, I3, 1)
		Y1 = T2(1, I1, I2, I3, 2)
		Y2 = T2(2, I1, I2, I3, 2)
		W1 = T4(1, I1, I2, I3, 4)
		W2 = T4(2, I1, I2, I3, 4)
		CALL DOTLINE(X1, X2, Y1, Y2, W1, W2)

		X1 = T2(I1, 1, I2, I3, 1)
		X2 = T2(I1, 2, I2, I3, 1)
		Y1 = T2(I1, 1, I2, I3, 2)
		Y2 = T2(I1, 2, I2, I3, 2)
		W1 = T4(I1, 1, I2, I3, 4)
		W2 = T4(I1, 2, I2, I3, 4)
		CALL DOTLINE(X1, X2, Y1, Y2, W1, W2)

		X1 = T2(I1, I2, 1, I3, 1)
		X2 = T2(I1, I2, 2, I3, 1)
		Y1 = T2(I1, I2, 1, I3, 2)
		Y2 = T2(I1, I2, 2, I3, 2)
		W1 = T4(I1, I2, 1, I3, 4)
		W2 = T4(I1, I2, 2, I3, 4)
		CALL DOTLINE(X1, X2, Y1, Y2, W1, W2)

		X1 = T2(I1, I2, I3, 1, 1)
		X2 = T2(I1, I2, I3, 2, 1)
		Y1 = T2(I1, I2, I3, 1, 2)
		Y2 = T2(I1, I2, I3, 2, 2)
		W1 = T4(I1, I2, I3, 1, 4)
		W2 = T4(I1, I2, I3, 2, 4)
		CALL DOTLINE(X1, X2, Y1, Y2, W1, W2)
	NEXT I3
	NEXT I2
	NEXT I1
NEXT IST

AD = 0!
FOR ID = 1 TO 10
FOR JD = 1 TO 1000
AD = AD + 1!
NEXT JD
NEXT ID
' SLEEP
IF INKEY$ = "Q" THEN GOTO 9
LOOP
9 END

SUB DOTLINE (X1, X2, Y1, Y2, W1, W2)
DX = (X2 - X1) / NDOT
DY = (Y2 - Y1) / NDOT
DW = (W2 - W1) / NDOT
X = X1
Y = Y1
W = W1
FOR N = 1 TO NDOT
X = X + DX
Y = Y + DY
W = W + DW
IX = X * XSCALE + NXSHIFT
IY = Y * YSCALE + NYSHIFT
IW = -W * WSCALE + 8
IF IW > 15 THEN IW = 15
IF IW < 0 THEN IW = 0
PSET (IX, IY), IW
NEXT N
END SUB