' Neljadimensionaalse risttahuka po"o"rlemine neljadimensionaalses ruumis.
' Servade automaatne arvutamine. 4D-ruumis na"htamatuid servi ei kuvata.
' Va"rviline. (Optimeerimata.)

DEFINT I-Q
DEFSNG A-H
DEFSNG R-Z

DIM DF(1 TO 4, 1 TO 4)
DIM F(1 TO 4, 1 TO 4)
DIM R(1 TO 4, 1 TO 4)
DIM RI(1 TO 4, 1 TO 4)
DIM TIP4(1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2, 1 TO 4)
DIM TIP4N(1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2, 1 TO 4)
DIM TIP3(1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2, 1 TO 3)
DIM TIP2(1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2)
DIM T(1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2) AS INTEGER

SCREEN 9
PALETTE 1, 18
PALETTE 2, 36
PALETTE 3, 46
PALETTE 4, 61

TWOPI = 6.2832

FISTEREO = .2

SCALEX = 80!
SCALEY = 70!
NXPIX = 640
NYPIX = 350

A = .99
B = .61
C = .53
D = .45

DFXY = .93
DFXZ = .63
DFYZ = .54
DFXW = .37
DFYW = .84
DFZW = .48
FAC = .01

DFXY = DFXY * FAC
DFXZ = DFXZ * FAC
DFYZ = DFYZ * FAC
DFXW = DFXW * FAC
DFYW = DFYW * FAC
DFZW = DFZW * FAC

FOR P = 1 TO 4
FOR Q = 1 TO 4
IF P = Q THEN RI(P, Q) = 1! ELSE RI(P, Q) = 0!
NEXT Q
NEXT P

DF(2, 1) = DFXY
DF(3, 1) = DFXZ
DF(3, 2) = DFYZ
DF(4, 1) = DFXW
DF(4, 2) = DFYW
DF(4, 3) = DFZW

FOR M = 1 TO 4
FOR N = 1 TO 4
F(M, N) = -DF(M, N)
NEXT N
NEXT M

APage% = 1
VPage% = 0

DO
	SCREEN 9, , APage%, VPage%
	CLS 1

FOR I = 1 TO 2
FOR J = 1 TO 2
FOR K = 1 TO 2
FOR L = 1 TO 2
	TIP4(1, J, K, L, 1) = A
	TIP4(2, J, K, L, 1) = -A
	TIP4(I, 1, K, L, 2) = B
	TIP4(I, 2, K, L, 2) = -B
	TIP4(I, J, 1, L, 3) = C
	TIP4(I, J, 2, L, 3) = -C
	TIP4(I, J, K, 1, 4) = D
	TIP4(I, J, K, 2, 4) = -D
NEXT L
NEXT K
NEXT J
NEXT I

FOR M = 2 TO 4
	N1 = M - 1
	FOR N = 1 TO N1

		FI = F(M, N)
		FI = FI + DF(M, N)
		IF FI > TWOPI THEN FI = FI - TWOPI
		IF FI < 0! THEN FI = FI + TWOPI
		F(M, N) = FI

		SINUS = SIN(FI)
		COSINUS = COS(FI)

		FOR P = 1 TO 4
		FOR Q = 1 TO 4
		R(P, Q) = RI(P, Q)
		NEXT Q
		NEXT P

		R(M, M) = COSINUS
		R(N, N) = COSINUS
		R(M, N) = SINUS
		R(N, M) = -SINUS

		FOR I = 1 TO 2
		FOR J = 1 TO 2
		FOR K = 1 TO 2
		FOR L = 1 TO 2
		FOR P = 1 TO 4
			TIP = 0!
				FOR Q = 1 TO 4
				TIP = TIP + R(P, Q) * TIP4(I, J, K, L, Q)
				NEXT Q
			TIP4N(I, J, K, L, P) = TIP
		NEXT P
		NEXT L
		NEXT K
		NEXT J
		NEXT I

		FOR I = 1 TO 2
		FOR J = 1 TO 2
		FOR K = 1 TO 2
		FOR L = 1 TO 2
		FOR P = 1 TO 4
			TIP4(I, J, K, L, P) = TIP4N(I, J, K, L, P)
		NEXT P
		NEXT L
		NEXT K
		NEXT J
		NEXT I
	NEXT N
NEXT M

WMIN = 0!
FOR I = 1 TO 2
FOR J = 1 TO 2
FOR K = 1 TO 2
FOR L = 1 TO 2
	IF TIP4(I, J, K, L, 4) < WMIN THEN
	WMIN = TIP4(I, J, K, L, 4)
	IM = I
	JM = J
	KM = K
	LM = L
	END IF
	FOR P = 1 TO 3
	TIP3(I, J, K, L, P) = TIP4(I, J, K, L, P)
	NEXT P
NEXT L
NEXT K
NEXT J
NEXT I

FOR ISTEREO = 1 TO 2

	IF ISTEREO = 1 THEN NSHIFTX = NXPIX / 4
	IF ISTEREO = 2 THEN NSHIFTX = NXPIX / 4 * 3
	NSHIFTY = NYPIX / 2

	IF ISTEREO = 1 THEN FI = .5 * FISTEREO
	IF ISTEREO = 2 THEN FI = TWOPI - .5 * FISTEREO

	SINUS = SIN(FI)
	COSINUS = COS(FI)

FOR I = 1 TO 2
FOR J = 1 TO 2
FOR K = 1 TO 2
FOR L = 1 TO 2

TIP2(I, J, K, L, 1) = TIP3(I, J, K, L, 1)*COSINUS-TIP3(I, J, K, L, 3)*SINUS
TIP2(I, J, K, L, 2) = TIP3(I, J, K, L, 2)
NEXT L
NEXT K
NEXT J
NEXT I

FOR I = 1 TO 2
FOR J = 1 TO 2
FOR K = 1 TO 2
FOR L = 1 TO 2
	T(I, J, K, L, 1) = TIP2(I, J, K, L, 1) * SCALEX + NSHIFTX
	T(I, J, K, L, 2) = TIP2(I, J, K, L, 2) * SCALEY + NSHIFTY
NEXT L
NEXT K
NEXT J
NEXT I

FOR I1 = 1 TO 2
FOR I2 = 1 TO 2
FOR I3 = 1 TO 2

1 IF I1 = JM AND I2 = KM AND I3 = LM GOTO 2
LINE (T(1, I1, I2, I3, 1), T(1, I1, I2, I3, 2))-(T(2, I1, I2, I3, 1), T(2, I1, I2, I3, 2)), 1

2 IF I1 = IM AND I2 = KM AND I3 = LM GOTO 3
LINE (T(I1, 1, I2, I3, 1), T(I1, 1, I2, I3, 2))-(T(I1, 2, I2, I3, 1), T(I1, 2, I2, I3, 2)), 2

3 IF I1 = IM AND I2 = JM AND I3 = LM GOTO 4
LINE (T(I1, I2, 1, I3, 1), T(I1, I2, 1, I3, 2))-(T(I1, I2, 2, I3, 1), T(I1, I2, 2, I3, 2)), 3

4 IF I1 = IM AND I2 = JM AND I3 = KM GOTO 5
LINE (T(I1, I2, I3, 1, 1), T(I1, I2, I3, 1, 2))-(T(I1, I2, I3, 2, 1), T(I1, I2, I3, 2, 2)), 4

5 NEXT I3
NEXT I2
NEXT I1

NEXT ISTEREO

SWAP APage%, VPage%
IF INKEY$ = "Q" THEN GOTO 999
' SLEEP
LOOP
999 END