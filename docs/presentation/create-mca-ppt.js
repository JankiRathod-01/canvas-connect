/**
 * MCA Final Year academic presentation
 * Art Gallery Management System — 20 slides
 */
const PptxGenJS = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const pptx = new PptxGenJS();
pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pptx.layout = "WIDE";
pptx.author = "MCA Final Year Project";
pptx.title = "Art Gallery Management System";
pptx.subject = "UML Class, Use Case, Activity, Sequence Diagrams";

const C = {
  bg: "FFFFFF",
  ink: "1F2937",
  muted: "4B5563",
  line: "D1D5DB",
  header: "1E3A5F",
  accent: "1E3A5F",
  soft: "F3F4F6",
  white: "FFFFFF",
  box: "F8FAFC",
  green: "065F46",
  amber: "92400E",
  gray: "374151",
};

const UML_PNG = path.resolve(__dirname, "../diagrams/art-gallery-class-diagram.png");
const USECASE_PNG = path.resolve(__dirname, "../diagrams/art-gallery-use-case.png");
const ACTIVITY_PNG = path.resolve(__dirname, "../diagrams/art-gallery-activity.png");
const SEQUENCE_PNG = path.resolve(__dirname, "../diagrams/art-gallery-sequence-login.png");
const SCREENSHOT_DIR = path.resolve(__dirname, "Screen Shots");

function getScreenshots() {
  if (!fs.existsSync(SCREENSHOT_DIR)) return [];
  return fs
    .readdirSync(SCREENSHOT_DIR)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .map((f) => {
      const m = f.match(/^(\d+)\s*[-_.]\s*(.+)\.(png|jpe?g|webp)$/i);
      return {
        file: f,
        path: path.join(SCREENSHOT_DIR, f),
        num: m ? Number(m[1]) : 999,
        title: m ? m[2].replace(/\s+/g, " ").trim() : f,
      };
    })
    .sort((a, b) => a.num - b.num);
}

const SCREENSHOTS = getScreenshots();

// 8 (intro..) + 3 (class) + 4 (usecase intro + 3 diagrams) + DD + 4 + screenshot intro + shots + thank you
const UML_DESIGN_SLIDES = 7; // class intro, class, relationships, usecase intro, usecase, activity, sequence
const DD_TABLE_COUNT = 10;
const DD_SLIDE_COUNT = 1 + DD_TABLE_COUNT + 1;
const SCREENSHOT_INTRO = 1;
const TOTAL = 8 + UML_DESIGN_SLIDES + DD_SLIDE_COUNT + 4 + SCREENSHOT_INTRO + SCREENSHOTS.length + 1;

let slideNo = 0;

function bg(s) {
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5,
    fill: { color: C.bg }, line: { color: C.bg },
  });
}

function headerBar(s, title) {
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 0.85,
    fill: { color: C.header }, line: { color: C.header },
  });
  s.addText(title, {
    x: 0.45, y: 0.2, w: 12.4, h: 0.45,
    fontSize: 22, bold: true, color: C.white, fontFace: "Calibri",
  });
}

function footer(s) {
  slideNo += 1;
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 7.15, w: 13.333, h: 0.35,
    fill: { color: C.soft }, line: { color: C.soft },
  });
  s.addText("Art Gallery Management System  |  MCA Final Year Project", {
    x: 0.4, y: 7.2, w: 10, h: 0.25,
    fontSize: 11, color: C.muted, fontFace: "Calibri",
  });
  s.addText(`${slideNo} / ${TOTAL}`, {
    x: 11.5, y: 7.2, w: 1.4, h: 0.25,
    fontSize: 11, color: C.muted, align: "right", fontFace: "Calibri",
  });
}

function bullets(s, items, x, y, w) {
  items.forEach((t, i) => {
    s.addText("•  " + t, {
      x, y: y + i * 0.48, w, h: 0.42,
      fontSize: 16, color: C.ink, fontFace: "Calibri",
    });
  });
}

function simpleTable(s, rows, opts) {
  s.addTable(
    rows.map((r, idx) =>
      r.map((cell) => ({
        text: String(cell),
        options: {
          bold: idx === 0,
          color: idx === 0 ? C.white : C.ink,
          fill: { color: idx === 0 ? C.header : idx % 2 === 0 ? C.soft : C.white },
          fontSize: opts.fontSize || 14,
        },
      }))
    ),
    {
      x: opts.x, y: opts.y, w: opts.w, colW: opts.colW,
      border: [
        { pt: 0.5, color: C.line },
        { pt: 0.5, color: C.line },
        { pt: 0.5, color: C.line },
        { pt: 0.5, color: C.line },
      ],
      fontFace: "Calibri",
      align: "left",
      valign: "middle",
      rowH: opts.rowH || 0.48,
    }
  );
}

// ===== 1 Title =====
{
  const s = pptx.addSlide();
  bg(s);
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 1.2,
    fill: { color: C.header }, line: { color: C.header },
  });
  s.addText("MCA FINAL YEAR PROJECT", {
    x: 0.6, y: 0.4, w: 12, h: 0.4,
    fontSize: 16, color: C.white, fontFace: "Calibri", align: "center",
  });
  s.addText("Art Gallery Management System", {
    x: 0.6, y: 2.0, w: 12.1, h: 0.7,
    fontSize: 36, bold: true, color: C.ink, fontFace: "Calibri", align: "center",
  });
  s.addText("UML Diagrams  ·  Data Dictionary  ·  System Design", {
    x: 0.6, y: 2.75, w: 12.1, h: 0.4,
    fontSize: 18, color: C.muted, fontFace: "Calibri", align: "center",
  });

  simpleTable(s, [
    ["Detail", "Information"],
    ["Student Name", "[ Enter Student Name ]"],
    ["Enrollment Number", "[ Enter Enrollment Number ]"],
    ["College Name", "[ Enter College Name ]"],
    ["Guide Name", "[ Enter Guide Name ]"],
    ["Academic Year", "[ Enter Academic Year ]"],
  ], { x: 3.2, y: 3.5, w: 7, colW: [2.5, 4.5], rowH: 0.42, fontSize: 13 });

  footer(s);
}

// ===== 2 Introduction =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "Project Introduction"); footer(s);
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.55, y: 1.3, w: 12.2, h: 5.3,
    fill: { color: C.box }, line: { color: C.line }, rectRadius: 0.06,
  });
  s.addText(
    "The Art Gallery Management System is a web-based application developed to manage information related to artists, artworks, categories, exhibitions, and visitor inquiries.",
    { x: 0.9, y: 1.7, w: 11.5, h: 1.3, fontSize: 18, color: C.ink, fontFace: "Calibri" }
  );
  s.addText(
    "The system provides a centralized platform for managing gallery information and allows visitors to explore artworks and contact the gallery.",
    { x: 0.9, y: 3.2, w: 11.5, h: 1.2, fontSize: 18, color: C.ink, fontFace: "Calibri" }
  );
  s.addText(
    "It is designed as an MCA final-year individual project using React.js on the frontend and ASP.NET Core Web API with SQL Server on the backend.",
    { x: 0.9, y: 4.6, w: 11.5, h: 1.2, fontSize: 17, color: C.muted, fontFace: "Calibri" }
  );
}

// ===== 3 Problem =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "Problem Statement"); footer(s);
  s.addText(
    "Traditional art gallery information management can involve manual records or scattered information.",
    { x: 0.6, y: 1.2, w: 12, h: 0.6, fontSize: 17, color: C.ink, fontFace: "Calibri" }
  );
  s.addText("It becomes difficult to manage:", {
    x: 0.6, y: 1.9, w: 12, h: 0.4, fontSize: 17, bold: true, color: C.ink, fontFace: "Calibri",
  });
  bullets(s, [
    "Artists and their profile details",
    "Artworks and their categories",
    "Exhibitions and assigned artworks",
    "Visitor inquiries and follow-up status",
  ], 0.8, 2.4, 11.5);
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.55, y: 4.7, w: 12.2, h: 1.7,
    fill: { color: C.soft }, line: { color: C.line }, rectRadius: 0.06,
  });
  s.addText(
    "Proposed solution: A centralized web-based Art Gallery Management System with secure login, role-based access, and a clear database design for gallery data.",
    { x: 0.85, y: 5.1, w: 11.6, h: 1.1, fontSize: 17, color: C.ink, fontFace: "Calibri" }
  );
}

// ===== 4 Objectives =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "Project Objectives"); footer(s);
  bullets(s, [
    "Develop a web-based Art Gallery Management System.",
    "Manage artist information.",
    "Manage artwork information and organize categories.",
    "Manage exhibitions and artwork assignments.",
    "Allow visitors to explore artworks.",
    "Allow visitors to submit inquiries.",
    "Implement secure authentication using JWT and ASP.NET Core Identity.",
    "Implement role-based access control (Admin, Artist, Visitor).",
  ], 0.7, 1.25, 12);
}

// ===== 5 Tech stack =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "Technology Stack"); footer(s);
  const cols = [
    ["Frontend", "React.js\nTypeScript\nVite\nTailwind CSS"],
    ["Backend", "ASP.NET Core Web API\nC#\nEntity Framework Core"],
    ["Database", "Microsoft SQL Server\nDatabase-first SQL scripts"],
    ["Authentication", "ASP.NET Core Identity\nJWT Authentication"],
  ];
  cols.forEach((c, i) => {
    const x = 0.45 + i * 3.2;
    s.addShape(pptx.shapes.RECTANGLE, {
      x, y: 1.25, w: 3.0, h: 0.55,
      fill: { color: C.header }, line: { color: C.header },
    });
    s.addText(c[0], {
      x, y: 1.35, w: 3.0, h: 0.4,
      fontSize: 15, bold: true, color: C.white, align: "center", fontFace: "Calibri",
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x, y: 1.8, w: 3.0, h: 3.2,
      fill: { color: C.box }, line: { color: C.line },
    });
    s.addText(c[1], {
      x: x + 0.15, y: 2.1, w: 2.7, h: 2.7,
      fontSize: 15, color: C.ink, fontFace: "Calibri",
    });
  });
  s.addText(
    "Cloud / Deployment (optional later): Microsoft Azure App Service, Azure SQL Database, Azure Blob Storage.",
    { x: 0.55, y: 5.4, w: 12.2, h: 0.7, fontSize: 15, color: C.muted, fontFace: "Calibri" }
  );
}

// ===== 6 Users =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "System Users and Roles"); footer(s);
  const roles = [
    ["Admin", "Manage artists, categories, artworks, exhibitions, users, and inquiries.\nFull system administration."],
    ["Artist", "Login account with Artist role.\nPlanned: view/update profile and own artworks (Artist Dashboard)."],
    ["Visitor", "Browse public gallery pages.\nSubmit contact inquiries.\nOptional registration."],
  ];
  roles.forEach((r, i) => {
    const y = 1.2 + i * 1.8;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.55, y, w: 12.2, h: 1.6,
      fill: { color: C.box }, line: { color: C.line }, rectRadius: 0.05,
    });
    s.addText(r[0], {
      x: 0.85, y: y + 0.25, w: 2.2, h: 0.45,
      fontSize: 20, bold: true, color: C.accent, fontFace: "Calibri",
    });
    s.addText(r[1], {
      x: 3.3, y: y + 0.3, w: 9.0, h: 1.1,
      fontSize: 16, color: C.ink, fontFace: "Calibri",
    });
  });
}

// ===== 7 Modules =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "System Modules"); footer(s);
  simpleTable(s, [
    ["Category", "Modules"],
    ["Core Modules", "Authentication, User Management, Artist, Category, Artwork, Exhibition, Inquiry"],
    ["Public Modules", "Home Page, Public Gallery, Artwork browsing, Contact / Inquiry"],
    ["Planned Extended", "Artist Dashboard, Search and Filtering, API-backed gallery details"],
    ["Future Scope", "Purchase, Payment, Cart, Mobile App, AI Recommendations, Virtual Gallery"],
  ], { x: 0.45, y: 1.3, w: 12.4, colW: [2.8, 9.6], rowH: 0.85, fontSize: 14 });
  s.addText(
    "Note: Planned modules remain part of the project blueprint even if implemented later.",
    { x: 0.55, y: 6.3, w: 12, h: 0.35, fontSize: 13, color: C.amber, fontFace: "Calibri" }
  );
}

// ===== 8 Architecture =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "System Architecture"); footer(s);
  const layers = [
    ["React Frontend", "UI, forms, routing, JWT storage"],
    ["ASP.NET Core Web API", "Controllers, services, validation, JWT auth"],
    ["Entity Framework Core + Identity", "Data access and user authentication"],
    ["Microsoft SQL Server", "Persistent storage (database-first scripts)"],
  ];
  layers.forEach((l, i) => {
    const y = 1.2 + i * 1.05;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 2.5, y, w: 8.3, h: 0.85,
      fill: { color: i % 2 === 0 ? C.header : "334155" },
      line: { color: C.header }, rectRadius: 0.04,
    });
    s.addText(l[0], {
      x: 2.7, y: y + 0.08, w: 7.9, h: 0.35,
      fontSize: 16, bold: true, color: C.white, align: "center", fontFace: "Calibri",
    });
    s.addText(l[1], {
      x: 2.7, y: y + 0.42, w: 7.9, h: 0.3,
      fontSize: 13, color: "E5E7EB", align: "center", fontFace: "Calibri",
    });
    if (i < layers.length - 1) {
      s.addText("↓", {
        x: 6.2, y: y + 0.78, w: 1, h: 0.3,
        fontSize: 16, color: C.ink, align: "center", fontFace: "Calibri",
      });
    }
  });
  s.addText("Optional later: Azure App Service → Azure SQL Database / Blob Storage", {
    x: 0.6, y: 5.7, w: 12, h: 0.4, fontSize: 14, color: C.muted, align: "center", fontFace: "Calibri",
  });
}

// ===== 9 UML intro =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "UML Class Diagram — Introduction"); footer(s);
  s.addText(
    "The UML Class Diagram represents the main classes and relationships used in the backend application.",
    { x: 0.6, y: 1.2, w: 12, h: 0.6, fontSize: 17, color: C.ink, fontFace: "Calibri" }
  );
  s.addText("Core entities", {
    x: 0.6, y: 1.95, w: 12, h: 0.35, fontSize: 16, bold: true, color: C.accent, fontFace: "Calibri",
  });
  bullets(s, [
    "ApplicationUser (inherits IdentityUser<Guid>) — implemented",
    "Artist, Category, Artwork, Exhibition, ExhibitionArtwork, Inquiry — planned domain model",
  ], 0.8, 2.4, 11.5);
  s.addText("Enums", {
    x: 0.6, y: 3.7, w: 12, h: 0.35, fontSize: 16, bold: true, color: C.accent, fontFace: "Calibri",
  });
  bullets(s, [
    "ArtworkStatus: Available, Sold, Displayed, Archived",
    "InquiryStatus: New, Read, Responded, Closed",
  ], 0.8, 4.15, 11.5);
  s.addText(
    "Roles are managed by ASP.NET Core Identity (AspNetRoles / AspNetUserRoles), not as a string field on ApplicationUser.",
    { x: 0.6, y: 5.5, w: 12, h: 0.7, fontSize: 15, color: C.muted, fontFace: "Calibri" }
  );
}

// ===== 10 UML diagram image =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "UML Class Diagram"); footer(s);
  if (fs.existsSync(UML_PNG)) {
    s.addImage({
      path: UML_PNG,
      x: 0.35, y: 1.0, w: 12.6, h: 5.95,
      sizing: { type: "contain", w: 12.6, h: 5.95 },
    });
  } else {
    s.addText("UML image missing. Run render-uml.js", {
      x: 1, y: 3, w: 11, h: 0.5, fontSize: 18, color: C.ink, fontFace: "Calibri",
    });
  }
}

// ===== 11 UML relationships =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "UML Relationship Explanation"); footer(s);
  simpleTable(s, [
    ["Relationship", "Multiplicity", "Simple meaning"],
    ["Artist → Artwork", "1 → Many", "One artist can create many artworks"],
    ["Category → Artwork", "1 → Many", "One category can contain many artworks"],
    ["Exhibition → ExhibitionArtwork", "1 → Many", "One exhibition has many artwork links"],
    ["Artwork → ExhibitionArtwork", "1 → Many", "One artwork can appear in many exhibitions"],
    ["Exhibition ↔ Artwork", "Many ↔ Many", "Resolved using ExhibitionArtwork junction"],
  ], { x: 0.45, y: 1.25, w: 12.4, colW: [4.0, 2.4, 6.0], rowH: 0.7, fontSize: 14 });
  s.addText(
    "ApplicationUser and Artist are separate. Inquiry has no required link to a logged-in user.",
    { x: 0.55, y: 6.2, w: 12, h: 0.4, fontSize: 14, color: C.muted, fontFace: "Calibri" }
  );
}

// ===== 12 Use Case intro =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "UML Use Case Diagram — Introduction"); footer(s);
  s.addText("UML System Design", {
    x: 0.6, y: 1.15, w: 12, h: 0.35,
    fontSize: 16, bold: true, color: C.accent, fontFace: "Calibri",
  });
  s.addText(
    "Diagrams represent the proposed functional design of the Art Gallery Management System.",
    { x: 0.6, y: 1.55, w: 12, h: 0.45, fontSize: 15, color: C.muted, fontFace: "Calibri" }
  );
  s.addText("Actors", {
    x: 0.6, y: 2.2, w: 12, h: 0.35, fontSize: 16, bold: true, color: C.accent, fontFace: "Calibri",
  });
  bullets(s, [
    "Admin — manages users, artists, categories, artworks, exhibitions, and inquiries",
    "Artist — login, profile, and own artwork collection (planned artist dashboard)",
    "Visitor — browse gallery, view details, search/filter, and submit inquiry",
  ], 0.8, 2.65, 11.5);
  s.addText("Main functional areas", {
    x: 0.6, y: 4.4, w: 12, h: 0.35, fontSize: 16, bold: true, color: C.accent, fontFace: "Calibri",
  });
  bullets(s, [
    "Authentication: Register, Login, Logout",
    "Admin management modules and Visitor public gallery features",
    "Future-scope items (purchase, payment, AI) are not shown as use cases",
  ], 0.8, 4.85, 11.5);
}

// ===== 13 Use Case diagram =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "UML Use Case Diagram"); footer(s);
  if (fs.existsSync(USECASE_PNG)) {
    s.addImage({
      path: USECASE_PNG,
      x: 0.3, y: 0.95, w: 12.7, h: 6.05,
      sizing: { type: "contain", w: 12.7, h: 6.05 },
    });
  }
}

// ===== 14 Activity diagram =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "UML Activity Diagram"); footer(s);
  if (fs.existsSync(ACTIVITY_PNG)) {
    s.addImage({
      path: ACTIVITY_PNG,
      x: 0.25, y: 0.95, w: 12.8, h: 6.05,
      sizing: { type: "contain", w: 12.8, h: 6.05 },
    });
  }
}

// ===== 15 Sequence diagram =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "UML Sequence Diagram — Login"); footer(s);
  if (fs.existsSync(SEQUENCE_PNG)) {
    s.addImage({
      path: SEQUENCE_PNG,
      x: 0.35, y: 0.95, w: 12.6, h: 6.05,
      sizing: { type: "contain", w: 12.6, h: 6.05 },
    });
  }
}

// ===== Data Dictionary (complete) =====
function addDataDictionarySlide(title, note, rows, fontSize = 11, rowH = 0.38) {
  const s = pptx.addSlide();
  bg(s);
  headerBar(s, title);
  footer(s);
  if (note) {
    s.addText(note, {
      x: 0.45, y: 1.0, w: 12.4, h: 0.3,
      fontSize: 12, color: C.muted, fontFace: "Calibri",
    });
  }
  simpleTable(s, rows, {
    x: 0.35,
    y: note ? 1.35 : 1.1,
    w: 12.6,
    colW: [2.5, 2.6, 1.0, 1.0, 5.5],
    rowH,
    fontSize,
  });
}

{
  const s = pptx.addSlide();
  bg(s);
  headerBar(s, "Data Dictionary — Overview");
  footer(s);
  s.addText(
    "The Data Dictionary defines every database field used by the Art Gallery Management System.",
    { x: 0.55, y: 1.2, w: 12.2, h: 0.45, fontSize: 16, color: C.ink, fontFace: "Calibri" }
  );
  simpleTable(s, [
    ["Table", "Purpose"],
    ["AspNetUsers", "Login users (ASP.NET Core Identity / ApplicationUser)"],
    ["AspNetRoles", "Roles: Admin, Artist, Visitor"],
    ["AspNetUserRoles", "User–Role mapping"],
    ["Artists", "Artist gallery profiles"],
    ["Categories", "Artwork categories"],
    ["Artworks", "Artwork records"],
    ["Exhibitions", "Exhibition events"],
    ["ExhibitionArtworks", "Exhibition ↔ Artwork junction"],
    ["Inquiries", "Visitor contact messages"],
  ], { x: 0.7, y: 1.8, w: 11.9, colW: [3.5, 8.4], rowH: 0.42, fontSize: 13 });
}

addDataDictionarySlide(
  "Data Dictionary — AspNetUsers (1/2)",
  "ApplicationUser storage. No Role column — roles use AspNetUserRoles.",
  [
    ["Field Name", "Data Type", "Null", "Key", "Description"],
    ["Id", "uniqueidentifier", "No", "PK", "User primary key (Identity)"],
    ["Name", "nvarchar(80)", "No", "-", "Display name (custom field)"],
    ["UserName", "nvarchar(256)", "Yes", "-", "Identity user name"],
    ["NormalizedUserName", "nvarchar(256)", "Yes", "UQ", "Normalized user name"],
    ["Email", "nvarchar(256)", "Yes", "-", "Email address"],
    ["NormalizedEmail", "nvarchar(256)", "Yes", "UQ", "Normalized email"],
    ["EmailConfirmed", "bit", "No", "-", "Email confirmation flag (default 0)"],
    ["PasswordHash", "nvarchar(MAX)", "Yes", "-", "Identity password hash"],
    ["SecurityStamp", "nvarchar(MAX)", "Yes", "-", "Identity security stamp"],
  ],
  12,
  0.45
);

addDataDictionarySlide(
  "Data Dictionary — AspNetUsers (2/2)",
  null,
  [
    ["Field Name", "Data Type", "Null", "Key", "Description"],
    ["ConcurrencyStamp", "nvarchar(MAX)", "Yes", "-", "Concurrency token"],
    ["PhoneNumber", "nvarchar(MAX)", "Yes", "-", "Optional phone"],
    ["PhoneNumberConfirmed", "bit", "No", "-", "Phone confirmation (default 0)"],
    ["TwoFactorEnabled", "bit", "No", "-", "2FA flag (default 0)"],
    ["LockoutEnd", "datetimeoffset", "Yes", "-", "Lockout end time"],
    ["LockoutEnabled", "bit", "No", "-", "Lockout enabled (default 1)"],
    ["AccessFailedCount", "int", "No", "-", "Failed login count (default 0)"],
    ["CreatedAt", "datetime2(3)", "No", "-", "Account created UTC (SYSUTCDATETIME)"],
    ["UpdatedAt", "datetime2(3)", "Yes", "-", "Last update UTC"],
  ],
  12,
  0.45
);

addDataDictionarySlide(
  "Data Dictionary — AspNetRoles",
  "Stores application roles: Admin, Artist, Visitor.",
  [
    ["Field Name", "Data Type", "Null", "Key", "Description"],
    ["Id", "uniqueidentifier", "No", "PK", "Role id"],
    ["Name", "nvarchar(256)", "Yes", "-", "Role name"],
    ["NormalizedName", "nvarchar(256)", "Yes", "UQ", "Normalized role name"],
    ["ConcurrencyStamp", "nvarchar(MAX)", "Yes", "-", "Concurrency token"],
  ],
  13,
  0.55
);

addDataDictionarySlide(
  "Data Dictionary — AspNetUserRoles",
  "Many-to-many link between users and roles.",
  [
    ["Field Name", "Data Type", "Null", "Key", "Description"],
    ["UserId", "uniqueidentifier", "No", "PK, FK", "→ AspNetUsers.Id"],
    ["RoleId", "uniqueidentifier", "No", "PK, FK", "→ AspNetRoles.Id"],
  ],
  14,
  0.6
);

addDataDictionarySlide(
  "Data Dictionary — Artists",
  "Planned gallery artist profile table (separate from login user).",
  [
    ["Field Name", "Data Type", "Null", "Key", "Description"],
    ["ArtistId", "uniqueidentifier", "No", "PK", "Unique artist id"],
    ["FullName", "nvarchar(150)", "No", "-", "Artist full name"],
    ["Biography", "nvarchar(MAX)", "Yes", "-", "Biography"],
    ["Country", "nvarchar(100)", "Yes", "-", "Country"],
    ["DateOfBirth", "datetime2", "Yes", "-", "Date of birth"],
    ["ProfileImageUrl", "nvarchar(500)", "Yes", "-", "Profile image URL/path"],
    ["CreatedAt", "datetime2", "No", "-", "Created (UTC)"],
    ["UpdatedAt", "datetime2", "Yes", "-", "Updated (UTC)"],
  ],
  12,
  0.48
);

addDataDictionarySlide(
  "Data Dictionary — Categories",
  "Planned artwork category table.",
  [
    ["Field Name", "Data Type", "Null", "Key", "Description"],
    ["CategoryId", "uniqueidentifier", "No", "PK", "Unique category id"],
    ["Name", "nvarchar(100)", "No", "UQ", "Category name"],
    ["Description", "nvarchar(500)", "Yes", "-", "Description"],
    ["CreatedAt", "datetime2", "No", "-", "Created (UTC)"],
  ],
  13,
  0.55
);

addDataDictionarySlide(
  "Data Dictionary — Artworks",
  "Planned artwork table. Status uses ArtworkStatus enum (int).",
  [
    ["Field Name", "Data Type", "Null", "Key", "Description"],
    ["ArtworkId", "uniqueidentifier", "No", "PK", "Unique artwork id"],
    ["Title", "nvarchar(200)", "No", "-", "Title"],
    ["Description", "nvarchar(MAX)", "Yes", "-", "Description"],
    ["ArtistId", "uniqueidentifier", "No", "FK", "→ Artists.ArtistId"],
    ["CategoryId", "uniqueidentifier", "No", "FK", "→ Categories.CategoryId"],
    ["Price", "decimal(18,2)", "Yes", "-", "Price"],
    ["YearCreated", "int", "Yes", "-", "Year created"],
    ["ImageUrl", "nvarchar(500)", "Yes", "-", "Image URL/path"],
    ["Status", "int", "No", "-", "ArtworkStatus (default 0 Available)"],
    ["CreatedAt", "datetime2", "No", "-", "Created (UTC)"],
    ["UpdatedAt", "datetime2", "Yes", "-", "Updated (UTC)"],
  ],
  11,
  0.4
);

addDataDictionarySlide(
  "Data Dictionary — Exhibitions",
  "Planned exhibition table.",
  [
    ["Field Name", "Data Type", "Null", "Key", "Description"],
    ["ExhibitionId", "uniqueidentifier", "No", "PK", "Unique exhibition id"],
    ["Name", "nvarchar(200)", "No", "-", "Exhibition name"],
    ["Description", "nvarchar(MAX)", "Yes", "-", "Description"],
    ["Venue", "nvarchar(200)", "Yes", "-", "Venue"],
    ["StartDate", "datetime2", "No", "-", "Start date"],
    ["EndDate", "datetime2", "No", "-", "End date"],
    ["CreatedAt", "datetime2", "No", "-", "Created (UTC)"],
    ["UpdatedAt", "datetime2", "Yes", "-", "Updated (UTC)"],
  ],
  12,
  0.48
);

addDataDictionarySlide(
  "Data Dictionary — ExhibitionArtworks",
  "Junction table. Unique constraint: (ExhibitionId, ArtworkId).",
  [
    ["Field Name", "Data Type", "Null", "Key", "Description"],
    ["ExhibitionArtworkId", "uniqueidentifier", "No", "PK", "Junction row id"],
    ["ExhibitionId", "uniqueidentifier", "No", "FK", "→ Exhibitions.ExhibitionId"],
    ["ArtworkId", "uniqueidentifier", "No", "FK", "→ Artworks.ArtworkId"],
    ["CreatedAt", "datetime2", "No", "-", "Link created (UTC)"],
  ],
  13,
  0.55
);

addDataDictionarySlide(
  "Data Dictionary — Inquiries",
  "Visitor inquiries. No UserId FK — anonymous contact allowed.",
  [
    ["Field Name", "Data Type", "Null", "Key", "Description"],
    ["InquiryId", "uniqueidentifier", "No", "PK", "Unique inquiry id"],
    ["Name", "nvarchar(150)", "No", "-", "Visitor name"],
    ["Email", "nvarchar(256)", "No", "-", "Visitor email"],
    ["Phone", "nvarchar(30)", "Yes", "-", "Optional phone"],
    ["Subject", "nvarchar(200)", "No", "-", "Subject"],
    ["Message", "nvarchar(MAX)", "No", "-", "Message"],
    ["Status", "int", "No", "-", "InquiryStatus (default 0 New)"],
    ["CreatedAt", "datetime2", "No", "-", "Submitted (UTC)"],
  ],
  12,
  0.48
);

{
  const s = pptx.addSlide();
  bg(s);
  headerBar(s, "Data Dictionary — Enums");
  footer(s);
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.2, w: 6.0, h: 5.3,
    fill: { color: C.box }, line: { color: C.line }, rectRadius: 0.05,
  });
  s.addText("ArtworkStatus", {
    x: 0.75, y: 1.4, w: 5.5, h: 0.4,
    fontSize: 18, bold: true, color: C.accent, fontFace: "Calibri",
  });
  simpleTable(s, [
    ["Value", "Int", "Description"],
    ["Available", "0", "Available"],
    ["Sold", "1", "Sold"],
    ["Displayed", "2", "Currently displayed"],
    ["Archived", "3", "Archived"],
  ], { x: 0.75, y: 2.0, w: 5.5, colW: [1.8, 1.0, 2.7], rowH: 0.55, fontSize: 13 });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.2, w: 6.0, h: 5.3,
    fill: { color: C.box }, line: { color: C.line }, rectRadius: 0.05,
  });
  s.addText("InquiryStatus", {
    x: 7.05, y: 1.4, w: 5.5, h: 0.4,
    fontSize: 18, bold: true, color: C.accent, fontFace: "Calibri",
  });
  simpleTable(s, [
    ["Value", "Int", "Description"],
    ["New", "0", "Newly submitted"],
    ["Read", "1", "Reviewed"],
    ["Responded", "2", "Gallery responded"],
    ["Closed", "3", "Closed"],
  ], { x: 7.05, y: 2.0, w: 5.5, colW: [1.8, 1.0, 2.7], rowH: 0.55, fontSize: 13 });
}

// ===== Design decisions =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "Important Database Design Decisions"); footer(s);
  const items = [
    ["Primary Keys", "GUID (uniqueidentifier) — consistent with ASP.NET Identity"],
    ["Artist vs User", "Artist profile and login user are separate concepts"],
    ["ExhibitionArtwork", "Junction table to solve Exhibition ↔ Artwork many-to-many"],
    ["Enums", "ArtworkStatus and InquiryStatus stored as int"],
    ["Image Storage", "Database stores URL/path; files may use Azure Blob later"],
    ["Identity Roles", "Roles via AspNetRoles / AspNetUserRoles (not a Role string column)"],
  ];
  items.forEach((it, i) => {
    const y = 1.15 + i * 0.9;
    s.addText(it[0], {
      x: 0.6, y, w: 3.3, h: 0.7,
      fontSize: 15, bold: true, color: C.accent, fontFace: "Calibri", valign: "middle",
    });
    s.addText(it[1], {
      x: 4.0, y, w: 8.7, h: 0.7,
      fontSize: 15, color: C.ink, fontFace: "Calibri", valign: "middle",
    });
  });
}

// ===== Implementation status =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "Current Implementation Status"); footer(s);
  simpleTable(s, [
    ["Module", "Status"],
    ["Authentication (Identity + JWT)", "Implemented"],
    ["Home / Public Website", "Implemented"],
    ["User Management (list visitors/artists)", "Implemented"],
    ["Public Gallery (Explore UI)", "Implemented (mock data)"],
    ["Contact form UI", "Implemented (API pending)"],
    ["Artist Dashboard (basic page)", "In Progress"],
    ["Artist Management (domain CRUD)", "Planned"],
    ["Category / Artwork / Exhibition", "Planned"],
    ["Inquiry Management (admin + API)", "Planned"],
  ], { x: 1.2, y: 1.15, w: 10.9, colW: [6.5, 4.4], rowH: 0.5, fontSize: 13 });
}

// ===== Future scope =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "Future Scope"); footer(s);
  s.addText(
    "These are future enhancements. They are not required for the initial MCA implementation and are not part of the current UML system design diagrams.",
    { x: 0.55, y: 1.15, w: 12.2, h: 0.7, fontSize: 15, color: C.muted, fontFace: "Calibri" }
  );
  const left = [
    "Online artwork purchasing",
    "Payment gateway integration",
    "Shopping cart / wishlist",
    "Artwork reviews and ratings",
  ];
  const right = [
    "Mobile application",
    "AI-based recommendations",
    "Virtual gallery tour",
    "Multi-language support / advanced reports",
  ];
  left.forEach((t, i) => s.addText("•  " + t, {
    x: 0.8, y: 2.1 + i * 0.7, w: 5.8, h: 0.5, fontSize: 17, color: C.ink, fontFace: "Calibri",
  }));
  right.forEach((t, i) => s.addText("•  " + t, {
    x: 7.0, y: 2.1 + i * 0.7, w: 5.8, h: 0.5, fontSize: 17, color: C.ink, fontFace: "Calibri",
  }));
}

// ===== Conclusion =====
{
  const s = pptx.addSlide();
  bg(s); headerBar(s, "Conclusion"); footer(s);
  s.addText(
    "The Art Gallery Management System provides a centralized web-based solution for managing gallery information.",
    { x: 0.6, y: 1.3, w: 12, h: 0.7, fontSize: 17, color: C.ink, fontFace: "Calibri" }
  );
  s.addText("The proposed system includes:", {
    x: 0.6, y: 2.15, w: 12, h: 0.4, fontSize: 16, bold: true, color: C.ink, fontFace: "Calibri",
  });
  bullets(s, [
    "Secure authentication and role-based access",
    "Artist, artwork, category, and exhibition management (planned modules documented)",
    "Visitor inquiry management",
    "Clear UML diagrams and Data Dictionary for system design",
  ], 0.8, 2.7, 11.5);
  s.addText(
    "The modular architecture allows additional features to be added in the future without redesigning the core database.",
    { x: 0.6, y: 5.3, w: 12, h: 0.8, fontSize: 16, color: C.muted, fontFace: "Calibri" }
  );
}

// ===== Frontend Screenshots (ordered by number in file name) =====
{
  const s = pptx.addSlide();
  bg(s);
  headerBar(s, "Frontend Screenshots");
  footer(s);
  s.addText(
    "The following slides show the implemented frontend screens in order.",
    { x: 0.6, y: 2.8, w: 12, h: 0.5, fontSize: 18, color: C.ink, align: "center", fontFace: "Calibri" }
  );
  s.addText(
    `${SCREENSHOTS.length} screenshots from the Screen Shots folder`,
    { x: 0.6, y: 3.5, w: 12, h: 0.4, fontSize: 15, color: C.muted, align: "center", fontFace: "Calibri" }
  );
}

SCREENSHOTS.forEach((shot) => {
  const s = pptx.addSlide();
  bg(s);
  headerBar(s, `${shot.num}. ${shot.title}`);
  footer(s);
  s.addImage({
    path: shot.path,
    x: 0.55,
    y: 1.05,
    w: 12.2,
    h: 5.9,
    sizing: { type: "contain", w: 12.2, h: 5.9 },
  });
});

// ===== Thank you =====
{
  const s = pptx.addSlide();
  bg(s);
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5,
    fill: { color: C.header }, line: { color: C.header },
  });
  s.addText("Thank You", {
    x: 0.6, y: 2.6, w: 12.1, h: 0.8,
    fontSize: 44, bold: true, color: C.white, align: "center", fontFace: "Calibri",
  });
  s.addText("Questions and Answers", {
    x: 0.6, y: 3.6, w: 12.1, h: 0.5,
    fontSize: 22, color: "E5E7EB", align: "center", fontFace: "Calibri",
  });
  s.addText("Art Gallery Management System  |  MCA Final Year Project", {
    x: 0.6, y: 5.5, w: 12.1, h: 0.4,
    fontSize: 14, color: "CBD5E1", align: "center", fontFace: "Calibri",
  });
}

console.log("Screenshots found:", SCREENSHOTS.map((x) => x.file).join(", "));
console.log("Expected TOTAL slides (approx):", TOTAL);

const out = path.join(__dirname, "Art-Gallery-MCA-Final-Presentation.pptx");
pptx.writeFile({ fileName: out }).then(() => {
  console.log("CREATED:", out, "| footer slides used:", slideNo, "| TOTAL constant:", TOTAL);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
