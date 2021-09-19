/* Generated Oracle SQL from 'ueberflieger.erdplus': */

CREATE TABLE Hersteller(
    pk_hersteller_id INTEGER NOT NULL;
    name VARCHAR(255);
    webseite VARCHAR(255);
    CONSTRAINT pk_0 PRIMARY KEY (pk_hersteller_id)
);

CREATE TABLE Flugzeug(
    pk_kennzeichen INTEGER NOT NULL;
    baujahr VARCHAR(255);
    num_sitzplaetze VARCHAR(255);
    CONSTRAINT pk_1 PRIMARY KEY (pk_kennzeichen)
);

CREATE TABLE Fluggesellschaft(
    pk_iata_code INTEGER NOT NULL;
    bezeichnung VARCHAR(255);
    gruendungsjahr VARCHAR(255);
    heimatflughafen VARCHAR(255);
    CONSTRAINT pk_2 PRIMARY KEY (pk_iata_code)
);

CREATE TABLE Mitarbeiter(
    pk_mitarbeiter_id INTEGER NOT NULL;
    sv_nummer INTEGER NOT NULL;
    typ VARCHAR(255);
    vname VARCHAR(255);
    nname VARCHAR(255);
    strasse VARCHAR(255);
    hausnummer VARCHAR(255);
    plz VARCHAR(255);
    ort VARCHAR(255);
    CONSTRAINT pk_3 PRIMARY KEY (pk_mitarbeiter_id, sv_nummer)
);

CREATE TABLE Telefonnummer(
    telefonnummer INTEGER NOT NULL;

    CONSTRAINT pk_4 PRIMARY KEY (telefonnummer)
);