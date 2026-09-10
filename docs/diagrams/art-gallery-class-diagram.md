# UML Class Diagram — Art Gallery Management System

## Overview

Backend / domain class model for the MCA Final Year project. React UI components are excluded.

| Status | Classes |
| --- | --- |
| Implemented | `ApplicationUser` (Identity), `ApplicationRole`, auth DTOs |
| Planned (project scope) | `Artist`, `Category`, `Artwork`, `Exhibition`, `ExhibitionArtwork`, `Inquiry`, enums |

PlantUML: [`art-gallery-class-diagram.puml`](./art-gallery-class-diagram.puml)  
Rendered image: [`art-gallery-class-diagram.png`](./art-gallery-class-diagram.png)

---

## ApplicationUser (implemented)

```text
ApplicationUser : IdentityUser<Guid>
```

| Property | Type | Source |
| --- | --- | --- |
| Id | `Guid` | Inherited from `IdentityUser<Guid>` |
| UserName, Email, PasswordHash, … | Identity fields | Inherited |
| Name | `string` | Custom (max 80) |
| CreatedAt | `DateTime` | Custom |
| UpdatedAt | `DateTime?` | Custom |

**Roles:** Not a property on `ApplicationUser`. Managed by ASP.NET Core Identity (`AspNetRoles` / `AspNetUserRoles`). Application roles: Admin, Artist, Visitor.

---

## Planned domain classes

### Artist

| Attribute | Type |
| --- | --- |
| ArtistId | `Guid` |
| FullName | `string` |
| Biography | `string?` |
| Country | `string?` |
| DateOfBirth | `DateTime?` |
| ProfileImageUrl | `string?` |
| CreatedAt | `DateTime` |
| UpdatedAt | `DateTime?` |
| Artworks | `ICollection<Artwork>` |

### Category

| Attribute | Type |
| --- | --- |
| CategoryId | `Guid` |
| Name | `string` |
| Description | `string?` |
| CreatedAt | `DateTime` |
| Artworks | `ICollection<Artwork>` |

### Artwork

| Attribute | Type |
| --- | --- |
| ArtworkId | `Guid` |
| Title | `string` |
| Description | `string?` |
| ArtistId | `Guid` |
| CategoryId | `Guid` |
| Price | `decimal?` |
| YearCreated | `int?` |
| ImageUrl | `string?` |
| Status | `ArtworkStatus` |
| CreatedAt | `DateTime` |
| UpdatedAt | `DateTime?` |
| Artist / Category / ExhibitionArtworks | Navigation |

### Exhibition

| Attribute | Type |
| --- | --- |
| ExhibitionId | `Guid` |
| Name | `string` |
| Description | `string?` |
| Venue | `string?` |
| StartDate / EndDate | `DateTime` |
| CreatedAt / UpdatedAt | `DateTime` / `DateTime?` |
| ExhibitionArtworks | Navigation |

### ExhibitionArtwork

| Attribute | Type |
| --- | --- |
| ExhibitionArtworkId | `Guid` |
| ExhibitionId | `Guid` |
| ArtworkId | `Guid` |
| CreatedAt | `DateTime` |

Unique: `(ExhibitionId, ArtworkId)`.

### Inquiry

| Attribute | Type |
| --- | --- |
| InquiryId | `Guid` |
| Name, Email, Subject, Message | `string` |
| Phone | `string?` |
| Status | `InquiryStatus` |
| CreatedAt | `DateTime` |

No `UserId` (anonymous contact allowed).

---

## Enums

**ArtworkStatus:** Available=0, Sold=1, Displayed=2, Archived=3  
**InquiryStatus:** New=0, Read=1, Responded=2, Closed=3

---

## Relationships

| Relationship | Multiplicity |
| --- | --- |
| Artist → Artwork | 1 → 0..\* |
| Category → Artwork | 1 → 0..\* |
| Exhibition → ExhibitionArtwork | 1 → 0..\* |
| Artwork → ExhibitionArtwork | 1 → 0..\* |
| Exhibition ↔ Artwork | many-to-many via ExhibitionArtwork |

No required link between `ApplicationUser` and `Artist`.

---

## Corrections applied (review)

1. Removed incorrect `Role : string` from `ApplicationUser`.
2. Documented inheritance from `IdentityUser<Guid>`.
3. Primary key for users is Identity `Id` (not a fake `UserId` property on the class).
4. Planned modules remain in the diagram as the project blueprint.
