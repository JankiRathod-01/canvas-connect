# Documentation Review — Corrections Log

Review of UML, ER, Data Dictionary, and PowerPoint for the MCA Art Gallery Management System.

---

## 1. Corrections made

| Area | Issue found | Correction |
| --- | --- | --- |
| UML ApplicationUser | Fake `Role : string` and `UserId` property | Documented real `ApplicationUser : IdentityUser<Guid>` with custom `Name`, `CreatedAt`, `UpdatedAt` |
| UML roles | Implied role column on user | Clarified roles via AspNetRoles / AspNetUserRoles |
| ER users table | Academic `ApplicationUsers` with `Role` column | Replaced with AspNetUsers + AspNetRoles + AspNetUserRoles |
| Data Dictionary | Invented Role field | Aligned with Identity SQL script `001_CreateAuthTables.sql` |
| PPT style | Earlier deck was tech-demo oriented | Rebuilt as 20-slide MCA academic presentation |
| PPT diagrams | Text-only UML/ER | Embedded actual PNG class and ER diagrams |
| Module scope | Risk of looking incomplete | Added Core / Planned / Future Scope separation; planned modules kept |
| Terminology | Some cloud-heavy wording | Simplified to student academic language |

---

## 2. Modules included

### Core
Authentication, Home/Public site, User Management, Artist Management, Category Management, Artwork Management, Exhibition Management, Inquiry Management

### Planned extended
Artist Dashboard, Public Gallery (API-backed), Search and Filtering

### Future scope
Purchase, payment, cart, wishlist, reviews, mobile app, AI recommendations, virtual gallery, multi-language, advanced reports

---

## 3. Current vs planned

| Module | Status |
| --- | --- |
| Authentication | Implemented |
| Home / Public website | Implemented |
| User list (visitors/artists accounts) | Implemented |
| Explore gallery UI | Implemented (mock data) |
| Contact form UI | Implemented (API pending) |
| Artist dashboard page | In Progress |
| Artist / Category / Artwork / Exhibition domain CRUD | Planned |
| Inquiry admin + API | Planned |

---

## 4. Future scope list

Online purchase, payment gateway, shopping cart, wishlist, reviews/ratings, email notifications, AI recommendations, virtual gallery, mobile app, multi-language, advanced analytics.

---

## 5. UML corrections

- Inheritance from `IdentityUser<Guid>` shown
- Removed incorrect `Role` attribute
- Planned domain classes retained
- Relationships and enums unchanged in meaning

---

## 6. ER corrections

- Identity tables shown correctly
- No fake Role column on users
- Business tables retained as project blueprint
- Many-to-many via ExhibitionArtworks unchanged

---

## 7. Data Dictionary corrections

- AspNetUsers fields match backend SQL
- AspNetRoles / AspNetUserRoles documented
- Planned tables still fully documented
- CSV regenerated

---

## 8. PPT improvements

- New file: `docs/presentation/Art-Gallery-MCA-Final-Presentation.pptx`
- Academic 20-slide structure
- Visual UML + ER images
- Implementation status honest
- Future scope separated
- Title slide placeholders for student details

---

## 9. Assumptions needing confirmation

1. Student Name, Enrollment Number, College Name, Guide Name, Academic Year for slide 1.
2. Whether Category needs `UpdatedAt` (currently only `CreatedAt`).
3. Whether Inquiry needs `UpdatedAt` (currently only `CreatedAt`).
4. Optional future FK between Artist and ApplicationUser — not modelled now.
5. Activate/deactivate users — mentioned as optional; not in current schema.
