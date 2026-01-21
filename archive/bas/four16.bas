' 4D sfa"a"ri po"o"rlemine ainult x-w tasandis.
' Stereo, punktid va"rvilised.

DEFINT I-Q
DEFDBL A-H
DEFSNG R-Z

IMX = 1000
DIM PAL(IMX)
DIM TA(1 TO IMX, 1 TO 4)
DIM IY(1 TO IMX)
DIM T(1 TO 4)
DIM TN(1 TO 4)

DIM DF(1 TO 4, 1 TO 4)
DIM F(1 TO 4, 1 TO 4)

DIM R(1 TO 4, 1 TO 4)
DIM RI(1 TO 4, 1 TO 4)

SCREEN 9
PALETTE 1, 18
PALETTE 2, 36
PALETTE 3, 46
PALETTE 4, 61

IPAL = 1
FOR I = 1 TO IMX
    PAL(I) = IPAL
    IPAL = IPAL + 1
    IF IPAL = 5 THEN IPAL = IPAL - 4
NEXT I

DPI = 3.141592653589#
DTWOPI = 2 * DPI

DFXY = 3.034538902655#
DFXZ = 5.028469563403#
DFYZ = 7.037635209575#
DFXW = 11.06479853421#
DFYW = 13.08750265132#
DFZW = 17.00573092632#

FACD = 124.7354645891#

FOR P = 1 TO 4
    FOR Q = 1 TO 4
        IF P = Q THEN RI(P, Q) = 1! ELSE RI(P, Q) = 0!
    NEXT Q
NEXT P

DF(2, 1) = DFXY * FACD
DF(3, 1) = DFXZ * FACD
DF(3, 2) = DFYZ * FACD
DF(4, 1) = DFXW * FACD
DF(4, 2) = DFYW * FACD
DF(4, 3) = DFZW * FACD

FOR M = 1 TO 4
    FOR N = 1 TO 4
        F(M, N) = 0!
    NEXT N
NEXT M

FOR I = 1 TO IMX
    T(1) = 1!
    T(2) = .7
    T(3) = .8
    T(4) = .9

    FOR M = 2 TO 4
        FOR N = 1 TO M - 1
            FI = F(M, N)
            FI = FI + DF(M, N)
5           IF FI < DTWOPI THEN
                GOTO 6
            ELSE
                FI = FI - DTWOPI
                GOTO 5
            END IF
6           IF FI > 0# THEN
                GOTO 7
            ELSE
                FI = FI + DTWOPI
                GOTO 6
            END IF
7           F(M, N) = FI
            SFI = FI
            SSIN = SIN(FI)
            SCOS = COS(FI)

            FOR P = 1 TO 4
                FOR Q = 1 TO 4
                    R(P, Q) = RI(P, Q)
                NEXT Q
            NEXT P

            R(M, M) = SCOS
            R(N, N) = SCOS
            R(M, N) = SSIN
            R(N, M) = -SSIN

            FOR P = 1 TO 4
                TIP = 0!
                FOR Q = 1 TO 4
                    TIP = TIP + R(P, Q) * T(Q)
                NEXT Q
                TN(P) = TIP
            NEXT P

            FOR P = 1 TO 4
                T(P) = TN(P)
            NEXT P
        NEXT N
    NEXT M

    FOR P = 1 TO 4
        TA(I, P) = T(P)
    NEXT P
NEXT I

' XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

NXPIX = 640
NYPIX = 350
SCALEX = 80!
SCALEY = 70!

NSHIFTXL = NXPIX / 2 - NXPIX / 4
NSHIFTXR = NXPIX / 2 + NXPIX / 4
NSHIFTY = NYPIX / 2

DFXW = .03

FISTEREO = .15
FIH = FISTEREO * .5
STSIN = SIN(FIH)
STCOS = COS(FIH)

FOR I = 1 TO IMX
    IY(I) = TA(I, 2) * SCALEY + NSHIFTY
NEXT I

APage% = 1
VPage% = 0

FI = 0#

DO
    SCREEN 9, , APage%, VPage%
    CLS 1

    FI = FI + DFXW
    IF FI > DTWOPI THEN FI = FI - DTWOPI
    IF FI < 0! THEN FI = FI + DTWOPI
    SFI = FI
    SSIN = SIN(FI)
    SCOS = COS(FI)

    FOR I = 1 TO IMX
        W = TA(I, 4) * SCOS - TA(I, 1) * SSIN
        IF W < 0! THEN GOTO 11
        X = TA(I, 4) * SSIN + TA(I, 1) * SCOS
        Z = TA(I, 3)
        XL = X * STCOS + Z * STSIN
        XR = X * STCOS - Z * STSIN
        IXL = XL * SCALEX + NSHIFTXL
        IXR = XR * SCALEX + NSHIFTXR
        IY = IY(I)
        PSET (IXL, IY), PAL(I)
        PSET (IXR, IY), PAL(I)
11  NEXT I

    SWAP APage%, VPage%
    IF INKEY$ = "q" THEN GOTO 999
    ' SLEEP
LOOP
999 END