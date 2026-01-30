' 3-D kuubi po"o"rlemine 4-D ruumis.
' Kuubi servad on antud punktidena.
' Kuubi kaks vastastahku on kaetud
' erinevat va"rvi punktidega.

DEFINT I-Q
DEFSNG A-H
DEFSNG R-Z

DIM DF(1 TO 4, 1 TO 4)
DIM F(1 TO 4, 1 TO 4)
DIM T4(1 TO 2, 1 TO 2, 1 TO 2, 1 TO 4)
DIM T2(1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2)

COMMON SHARED XSCALE, YSCALE, NXSHIFT, NYSHIFT
DECLARE SUB DOTLINE (X1, Y1, X2, Y2, ND, NCOL)

SCREEN 9
PALETTE 1, 63
PALETTE 2, 36
PALETTE 3, 10

TWOPI = 6.2832

FISTEREO = .2

XSCALE = 80!
YSCALE = 68!
NXPIXELS = 640
NYPIXELS = 350

AP = .8
AM = -.8
NDOT = 13

DFXY = .05
DFXZ = .35
DFYZ = -.79
DFXW = .42
DFYW = -.52
DFZW = 0!
FAC = -.01

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

APage% = 1
VPage% = 0
' ============================================================

DO
		SCREEN 9, , APage%, VPage%

FOR I = 1 TO 2
FOR J = 1 TO 2
FOR K = 1 TO 2
		T4(1, J, K, 1) = AP
		T4(2, J, K, 1) = AM
		T4(I, 1, K, 2) = AP
		T4(I, 2, K, 2) = AM
		T4(I, J, 1, 3) = AP
		T4(I, J, 2, 3) = AM
		T4(I, J, K, 4) = 0!
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
						TIPM = T4(I, J, K, M) * C - T4(I, J, K, N) * S
						TIPN = T4(I, J, K, M) * S + T4(I, J, K, N) * C
						T4(I, J, K, M) = TIPM
						T4(I, J, K, N) = TIPN
				NEXT K
				NEXT J
				NEXT I
		NEXT N
NEXT M

CLS 1

FOR ISTEREO = 1 TO 2

IF ISTEREO = 1 THEN NXSHIFT = NXPIXELS / 4
IF ISTEREO = 2 THEN NXSHIFT = NXPIXELS / 4 * 3
NYSHIFT = NYPIXELS / 2
IF ISTEREO = 1 THEN FI = .5 * FISTEREO
IF ISTEREO = 2 THEN FI = -.5 * FISTEREO
S = SIN(FI)
C = COS(FI)

		FOR I = 1 TO 2
		FOR J = 1 TO 2
		FOR K = 1 TO 2
		T2(I, J, K, 1) = T4(I, J, K, 1) * C - T4(I, J, K, 3) * S
		T2(I, J, K, 2) = T4(I, J, K, 2)
		NEXT K
		NEXT J
		NEXT I

FOR K = 1 TO 2
				X11 = T2(1, 1, K, 1)
				Y11 = T2(1, 1, K, 2)
				X12 = T2(1, 2, K, 1)
				Y12 = T2(1, 2, K, 2)
				X21 = T2(2, 1, K, 1)
				Y21 = T2(2, 1, K, 2)

				DXX = (X21 - X11) / NDOT
				DYX = (Y21 - Y11) / NDOT
				DXY = (X12 - X11) / NDOT
				DYY = (Y12 - Y11) / NDOT
				FOR IX = 1 TO NDOT - 1
				FOR IY = 1 TO NDOT - 1
						X = X11 + DXX * IX + DXY * IY
						Y = Y11 + DYX * IX + DYY * IY
						PSET (X * XSCALE + NXSHIFT, Y * YSCALE + NYSHIFT), K + 1
				NEXT IY
				NEXT IX
NEXT K

FOR I1 = 1 TO 2
FOR I2 = 1 TO 2
CALL DOTLINE(T2(1, I1, I2, 1), T2(1, I1, I2, 2), T2(2, I1, I2, 1), T2(2, I1, I2, 2), NDOT, 1)
CALL DOTLINE(T2(I1, 1, I2, 1), T2(I1, 1, I2, 2), T2(I1, 2, I2, 1), T2(I1, 2, I2, 2), NDOT, 1)
CALL DOTLINE(T2(I1, I2, 1, 1), T2(I1, I2, 1, 2), T2(I1, I2, 2, 1), T2(I1, I2, 2, 2), NDOT, 1)
NEXT I2
NEXT I1
PSET (T2(1, 1, 1, 1) * XSCALE + NXSHIFT, T2(1, 1, 1, 2) * YSCALE + NYSHIFT), 1

NEXT ISTEREO

SWAP APage%, VPage%

IF INKEY$ = "Q" THEN GOTO 9

A = 1!
FOR I = 1 TO 8000
A = A
NEXT I
'SLEEP

LOOP
9 END

SUB DOTLINE (X1, Y1, X2, Y2, ND, NCOL)
DX = (X2 - X1) / ND
DY = (Y2 - Y1) / ND
X = X1
Y = Y1
FOR N = 1 TO ND
X = X + DX
Y = Y + DY
IX = X * XSCALE + NXSHIFT
IY = Y * YSCALE + NYSHIFT
PSET (IX, IY), NCOL
NEXT N
END SUB