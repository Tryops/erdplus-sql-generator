/* Generated Oracle SQL from 'ueberflieger.erdplus' */

CREATE TABLE Hersteller (
    pk_hersteller_id INTEGER NOT NULL;
    fk_pk_kennzeichen INTEGER NOT NULL;
    name VARCHAR(255);
    webseite VARCHAR(255);
    CONSTRAINT pk_0 PRIMARY KEY (pk_hersteller_id);
    CONSTRAINT fk_1 FOREIGN KEY (fk_pk_kennzeichen) REFERENCES Flugzeug(pk_kennzeichen) ON DELETE CASCADE;
);

CREATE TABLE Flugzeug (
    pk_kennzeichen INTEGER NOT NULL;
    fk_pk_hersteller_id INTEGER NOT NULL;
    fk_pk_iata_code INTEGER NOT NULL;
    baujahr VARCHAR(255);
    num_sitzplaetze VARCHAR(255);
    CONSTRAINT pk_2 PRIMARY KEY (pk_kennzeichen);
    CONSTRAINT fk_3 FOREIGN KEY (fk_pk_hersteller_id) REFERENCES Hersteller(pk_hersteller_id) ON DELETE CASCADE;
    CONSTRAINT fk_4 FOREIGN KEY (fk_pk_iata_code) REFERENCES Fluggesellschaft(pk_iata_code) ON DELETE CASCADE;
);

CREATE TABLE Fluggesellschaft (
    pk_iata_code INTEGER NOT NULL;

    bezeichnung VARCHAR(255);
    gruendungsjahr VARCHAR(255);
    heimatflughafen VARCHAR(255);
    CONSTRAINT pk_5 PRIMARY KEY (pk_iata_code);

);

CREATE TABLE Mitarbeiter (
    pk_mitarbeiter_id INTEGER NOT NULL;
    sv_nummer INTEGER NOT NULL;

    typ VARCHAR(255);
    vname VARCHAR(255);
    nname VARCHAR(255);
    strasse VARCHAR(255);
    hausnummer VARCHAR(255);
    plz VARCHAR(255);
    ort VARCHAR(255);
    CONSTRAINT pk_6 PRIMARY KEY (pk_mitarbeiter_id, sv_nummer);

);

CREATE TABLE Telefonnummer (
    telefonnummer INTEGER NOT NULL;


    CONSTRAINT pk_7 PRIMARY KEY (telefonnummer);

);