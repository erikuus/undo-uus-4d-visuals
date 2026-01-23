---
title: Four-dimensional vision project
description: >
  These notes were written in 2000 by Erik Uus following oral explanations by
  Undo Uus. The text reflects the author’s understanding at the time and was
  not reviewed or corrected by Undo Uus. The document is preserved unchanged
  for historical purposes and to document the transmission of the original
  idea. The text may contain simplifications, inaccuracies, or the author’s
  own interpretations.
author: Erik Uus
translator: GPT-5.2
year: 2000
---

# Introduction

- **The goal of the 4D project is to evoke, in human consciousness, a visual perception of four-dimensional space.**
- In theoretical terms, the 4D project draws on analytic geometry and on a theory of perception that addresses the human visual sensation.
- The technical basis of the 4D project is a personal-computer-based stereovision system.

# Theoretical prerequisites

## Mathematical aspect

### Elementary and analytic geometry

The oldest part of geometry, so-called _elementary geometry_, emerged in connection with human practical needs, such as land surveying and finding areas and volumes. Elementary geometry proceeds from three basic figures (primitive notions) that are not defined, but are understood intuitively: point, line, and plane. These basic figures themselves are not defined, but all other geometric figures are defined on their basis.

A major turn in the development of geometry took place in the 17th century, when Descartes and Fermat laid the foundations of _analytic geometry_ by creating the method of coordinates. In analytic geometry, intuition is reduced to a minimum: one assumes only a coordinate system, on the basis of which all geometric figures can be mathematized—i.e., reduced to operations on numbers (coordinates).

### The fourth dimension in analytic geometry

A geometric figure is any set of points in space. In analytic geometry, any point in space is specified by its coordinates (real numbers).

The coordinate of any point in one-dimensional space (a line) is a number X, determined by a fixed origin on that line. X equals the distance of the given point from the origin: positive if the point lies on one side of the origin, and negative if it lies on the opposite side. Any geometric figure in one-dimensional space can be defined algebraically via the coordinates of the points that make it up.

The coordinates of any point in two-dimensional space (a plane) are two numbers X and Y, determined by two lines intersecting at the origin, and equal to the distances of the point’s orthogonal projections from the origin along those two lines. Any geometric figure in two-dimensional space can be defined algebraically via the coordinates of the points that make it up.

The coordinates of any point in three-dimensional space are three numbers X, Y, Z, determined by three mutually perpendicular lines intersecting at the origin, and equal to the distances of the point’s orthogonal projections from the origin along those three lines. Any geometric figure in three-dimensional space can be defined algebraically via the coordinates of the points that make it up.

_In analytic geometry, the dimension of space is a formal notion. Imagination plays no role here. The number of dimensions reduces to the number of coordinates of a point in that space. Thus, in analytic geometry the number of dimensions is infinite. And any n-dimensional geometric figure can be defined algebraically by the coordinate method._

The coordinates of any point in four-dimensional space are four numbers X, Y, Z, W, determined by four mutually perpendicular lines intersecting at the origin, and equal to the distances of the point’s orthogonal projections from the origin along those four lines. Any geometric figure in four-dimensional space can be defined algebraically via the coordinates of the points that make it up.

## Perceptual-theoretical aspect

### The optical–neurological mechanism of vision

Light is refracted at the spherical surface between air and the cornea (in Figure 1) and additionally in the eye lens (2) located behind the iris, producing an image (4) on the retina (3).

Under the influence of light (electromagnetic waves 380–780 nm in length), a photochemical process in the light-sensitive retina produces excitation, which travels as a stream of nerve impulses via neural pathways (5) to the visual center and, once analyzed, becomes a visual sensation.

![Figure 1: The optical–neurological mechanism of the eye](images/img01.png)

### The peculiarity of visual perception

Because of the optical–neurological mechanism of vision, the nerve impulses that travel from the retina to the brain’s visual center carry direct information only about two dimensions. Yet the visual sensation that arises on the basis of that information is three-dimensional. _This is precisely the peculiarity of visual perception: the image on the retina is planar, but the human being sees spatially._

When a person perceives a cube (A), the geometric image on the retina of each eye consists only of three parallelograms (B).

![Figure 2: Perceiving a cube and its projection on the retina](images/img02.png)

### Binocular and monocular stereoscopic vision

Because the viewpoints of the eyes differ, when viewing with both eyes each retina receives its own planar image of the space. The brain’s visual center merges these two planar images into a single spatial whole-image. Such spatial vision is called binocular stereoscopic vision. Binocular stereoscopic vision works most effectively at the so-called best viewing distance, i.e., when the object being viewed is 20–30 cm from the eyes. The farther away the object is, the less the planar image on the two retinas differs, and the weaker binocular stereoscopic vision becomes.

However, a person clearly perceives space even when looking farther away—when the images on the two retinas do not differ at all (watching cinema and TV), or when the image is on only one retina (looking with one eye). In all these cases, in essence we are dealing with monocular stereoscopic vision, in which the spatiality of the image is perceived on the basis of temporal change in the planar image.

### Invariant

The basis of monocular stereoscopic vision is the two-dimensional projection of a three-dimensional object on the retina. As the two-dimensional projection changes over time, the third dimension is restored in perception. The eyes “see” a changing planar image, but perception “sees” in those planar changes a three-dimensional invariance; that is, changing two-dimensional images are perceived as an unchanging three-dimensional object viewed from different viewpoints.

For example, these different planar images—(1) a square, (2) two rectangles, (3) a square and two parallelograms, (4) three rhombi—are perceived as a rotating invariant three-dimensional object: a cube.

![Figure 3: Planar images that suggest a cube](images/img03.png)

The perception of an invariant is very clear. For instance, if a 3D object deforms while rotating, then from the changing planar projection it is clearly perceived that the 3D invariant has been violated. The perception of an invariant is automatic. For example, it is almost impossible to perceive a 2D cinema image as planar, because perception automatically reconstructs the third dimension from the 2D changes.

In perception, the invariant appears as an additional dimension supplied by experience. Mathematically, an invariant is defined as follows: the configuration of the points making up the geometric figure is preserved, but the coordinates change.

# Technical basis

## Artificial stereoscopic vision

_Artificial stereoscopic vision is binocular stereoscopic vision brought about using technical means._ Its technically simplest variant is stereophotography.

In stereophotography, the same object is photographed simultaneously from two slightly different viewpoints. These two photographs, differing slightly by viewpoint, are viewed through a corresponding device (a stereoscope) so that the left eye sees the left image and the right eye sees the right image. Thus, as in natural binocular stereoscopic vision, each retina receives a slightly different planar image of the object. The brain’s visual center merges these two planar images into a single spatial whole-image.

In stereoscopic cinematography, the same object is filmed simultaneously from two slightly different viewpoints. These two films, differing slightly by viewpoint, are projected simultaneously onto the cinema screen in a particular special way, such that a viewer wearing special filter glasses sees one film with one eye and the other film with the other eye. Thus, as in natural binocular vision, different planar images again form on the two retinas, which in perception merge into a spatial visual sensation.

In the 4D project, a personal-computer-based technical system for artificial stereoscopic vision is used.

Where stereophotography and stereoscopic cinematography merely record stereographic images of the real world, a PC-based stereovision system makes it possible to create (program) virtual stereoscopic images. And it is precisely this possibility on which the 4D project is based.

## A personal-computer-based stereovision system

A PC-based stereovision system consists of special software, a special video card, and special glasses connected to it (by wire or wirelessly).

In this system, binocular stereoscopic vision is brought about artificially by showing, on the monitor, two images with slightly different viewpoints in rapid alternation, while in the same rhythm the glasses alternately close the left and right viewing apertures. In this way one again achieves a situation where the two retinas receive planar images that differ slightly by viewpoint, which the brain—or the soul—automatically merges into a single spatial visual sensation.

# 4D Project

## Idea

We are capable of perceiving a three-dimensional image on the basis of its two-dimensional projection. But by analogy, could we not suppose that we might be capable of perceiving a four-dimensional image on the basis of its three-dimensional projection? In other words: since the brain—or the soul—can, by analyzing a changing two-dimensional image, determine that it is the projection of a three-dimensional object (i.e., since the brain—or the soul—recognizes the 3D invariant in the changes of the 2D image and, on that basis, clearly and automatically reconstructs the third dimension in perception), it is not excluded that the brain—or the soul—could also recognize a 4D invariant in the changes of a 3D image and, on that basis, evoke a four-dimensional visual sensation. This need not necessarily be so, but it may be. There is no compelling reason to think it is impossible. By analogy, it seems likely (see the table below). **It is certainly likely enough to be worth testing.**

|                                            | Real natural monocular 3D vision                     | Hypothetical artificial 4D vision                    |
| ------------------------------------------ | ---------------------------------------------------- | ---------------------------------------------------- |
| Base information in the brain              | A changing 2D visual image that is a 3D projection.  | A changing 3D visual image that is a 4D projection.  |
| The brain processes this information and … | recognizes 3D invariance in the 2D changes.          | recognizes 4D invariance in the 3D changes.          |
| The brain evokes in perception             | a 3D visual sensation on the basis of 3D invariance. | a 4D visual sensation on the basis of 4D invariance. |

_The fundamental idea of the 4D project consists precisely in this: to artificially create a changing binocular stereoscopic (3D) visual image that is mathematically the projection of a four-dimensional object into three-dimensional space, and to test whether our brain—or our soul—recognizes the 4D invariant in this changing 3D image, restoring on that basis a fourth dimension in perception, so that we may come to have a four-dimensional visual sensation (whatever that might look like?!)._

## Implementation

One of the most primitive programs that makes it possible to see, stereoscopically, a changing three-dimensional figure that is the projection of a four-dimensional figure into three-space might look as follows in QBasic (see the _Appendix_). This program can be developed much further in other languages.

When the program is ready, there is nothing else to do but concentrate, look, and wait to see whether the visual sensation changes. Other experiments with visual sensation suggest that one should not hope for a change before a couple of weeks of continuous experimenting; and if no change comes within a month, then it likely will not come at all.
