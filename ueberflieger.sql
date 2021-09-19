CREATE TABLE Hersteller (
    name VARCHAR(255);
    webseite VARCHAR(255);
    pk_hersteller_id VARCHAR(255);
);

CREATE TABLE Flugzeug (
    baujahr VARCHAR(255);
    num_sitzplaetze VARCHAR(255);
    pk_kennzeichen VARCHAR(255);
);

CREATE TABLE Fluggesellschaft (
    pk_iata_code VARCHAR(255);
    bezeichnung VARCHAR(255);
    gruendungsjahr VARCHAR(255);
    heimatflughafen VARCHAR(255);
);

CREATE TABLE Mitarbeiter (
    pk_mitarbeiter_id VARCHAR(255);
    typ VARCHAR(255);
    vname VARCHAR(255);
    nname VARCHAR(255);
    strasse VARCHAR(255);
    hausnummer VARCHAR(255);
    plz VARCHAR(255);
    ort VARCHAR(255);
    sv_nummer VARCHAR(255);
);

CREATE TABLE Telefonnummer (
    telefonnummer VARCHAR(255);
);