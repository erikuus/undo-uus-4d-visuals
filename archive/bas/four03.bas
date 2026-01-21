' 4-D risttahuka po"o"rlemine 4-D ruumis. Ko"ik servad na"htavad.
' Monokromaatne. Programm optimeeritud. Video kvaliteedi to"stmiseks
' lisatud dummy rehkenduste abil vajaliku pikkusega kaadrivahetuse
' paus.

DEFINT I-Q
DEFSNG A-H
DEFSNG R-Z

DIM DF(1 TO 4, 1 TO 4)
DIM F(1 TO 4, 1 TO 4)
DIM TIP4(1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2, 1 TO 4)
DIM TIP2(1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2)
DIM T(1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2, 1 TO 2) AS INTEGER

SCREEN 9
PALETTE 1, 51
PALETTE 2, 45

TWOPI = 6.2832

FISTEREO = .2

XSCALE = 80!
YSCALE = 68!
NXPIXELS = 640
NYPIXELS = 350

XP = .9
XM = 0!
YP = .8
YM = 0!
ZP = .7
ZM = 0!
WP = 1.2
WM = 0!

DFXY = .05
DFXZ = .35
DFYZ = -.79
DFXW = .63
DFYW = -.57
DFZW = .47
FAC = -.02

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
  FOR L = 1 TO 2
    TIP4(1, J, K, L, 1) = XP
    TIP4(2, J, K, L, 1) = XM
    TIP4(I, 1, K, L, 2) = YP
    TIP4(I, 2, K, L, 2) = YM
    TIP4(I, J, 1, L, 3) = ZP
    TIP4(I, J, 2, L, 3) = ZM
    TIP4(I, J, K, 1, 4) = WP
    TIP4(I, J, K, 2, 4) = WM
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
        TIPM = TIP4(I, J, K, L, M) * C - TIP4(I, J, K, L, N) * S
        TIPN = TIP4(I, J, K, L, M) * S + TIP4(I, J, K, L, N) * C
        TIP4(I, J, K, L, M) = TIPM
        TIP4(I, J, K, L, N) = TIPN
      NEXT L
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
    FOR L = 1 TO 2
      TIP2(I, J, K, L, 1) = TIP4(I, J, K, L, 1) * C - TIP4(I, J, K, L, 3) * S
      TIP2(I, J, K, L, 2) = TIP4(I, J, K, L, 2)
    NEXT L
    NEXT K
    NEXT J
    NEXT I

    FOR I = 1 TO 2
    FOR J = 1 TO 2
    FOR K = 1 TO 2
    FOR L = 1 TO 2
      T(I, J, K, L, 1) = TIP2(I, J, K, L, 1) * XSCALE + NXSHIFT
      T(I, J, K, L, 2) = TIP2(I, J, K, L, 2) * YSCALE + NYSHIFT
    NEXT L
    NEXT K
    NEXT J
    NEXT I

    FOR I1 = 1 TO 2
    FOR I2 = 1 TO 2
    FOR I3 = 1 TO 2
      LINE (T(1, I1, I2, I3, 1), T(1, I1, I2, I3, 2))-(T(2, I1, I2, I3, 1), T(2, I1, I2, I3, 2)), 1
      LINE (T(I1, 1, I2, I3, 1), T(I1, 1, I2, I3, 2))-(T(I1, 2, I2, I3, 1), T(I1, 2, I2, I3, 2)), 1
      LINE (T(I1, I2, 1, I3, 1), T(I1, I2, 1, I3, 2))-(T(I1, I2, 2, I3, 1), T(I1, I2, 2, I3, 2)), 1
      LINE (T(I1, I2, I3, 1, 1), T(I1, I2, I3, 1, 2))-(T(I1, I2, I3, 2, 1), T(I1, I2, I3, 2, 2)), 1
    NEXT I3
    NEXT I2
    NEXT I1

    FOR I = -2 TO 2
    FOR J = -2 TO 2
      IF I * J = 4 OR I * J = -4 THEN GOTO 5
      PSET (NXSHIFT + I, NYSHIFT + J), 2
    5 NEXT J
    NEXT I

  NEXT ISTEREO

  SWAP APage%, VPage%

  IF INKEY$ = "Q" THEN GOTO 9

  A = 1!
  FOR I = 1 TO 5000
    A = A
  NEXT I
  ' SLEEP

LOOP
9 END