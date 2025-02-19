-- =============================
-- 1. Enable Required Extensions
-- =============================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "ltree";
CREATE EXTENSION IF NOT EXISTS "hstore";

-- =============================
-- 2. Core Infrastructure
-- =============================

-- 2.1 user_account
CREATE TABLE user_account (
    id             uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    username       varchar(100) UNIQUE NOT NULL,
    password_hash  text NOT NULL,
    email          varchar(200),
    is_active      boolean DEFAULT true,
    created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by     uuid,
    updated_by     uuid,
    version        integer DEFAULT 1
);

-- 2.2 organization
CREATE TABLE organization (
    id                 uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name               varchar(200) NOT NULL,
    type               varchar(50),
    address            jsonb,
    contact            jsonb,
    parent_organization uuid REFERENCES organization(id),
    active             boolean DEFAULT true,
    created_by         uuid REFERENCES user_account(id),
    updated_by         uuid REFERENCES user_account(id),
    created_at         timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version            integer DEFAULT 1
);

-- 2.3 practitioner
CREATE TABLE practitioner (
    id             uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name     varchar(100) NOT NULL,
    last_name      varchar(100) NOT NULL,
    credentials    varchar(100),
    phone          varchar(50),
    email          varchar(200),
    organization_id uuid REFERENCES organization(id),
    active         boolean DEFAULT true,
    created_by     uuid REFERENCES user_account(id),
    updated_by     uuid REFERENCES user_account(id),
    created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version        integer DEFAULT 1
);

-- =============================
-- 3. Versioning System
-- =============================

CREATE TABLE clinical_version (
    id             uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    record_id      uuid NOT NULL,
    table_name     varchar(100) NOT NULL,
    data           jsonb NOT NULL,
    valid_from     timestamp NOT NULL,
    valid_to       timestamp,
    changed_by     uuid NOT NULL REFERENCES user_account(id),
    change_reason  text,
    version_number integer NOT NULL,
    created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION create_version() 
RETURNS trigger 
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO clinical_version (
        record_id,
        table_name,
        data,
        valid_from,
        changed_by,
        version_number
    )
    VALUES (
        NEW.id,
        TG_TABLE_NAME,
        to_jsonb(NEW),
        CURRENT_TIMESTAMP,
        NEW.updated_by,
        NEW.version
    );

    IF TG_OP = 'UPDATE' THEN
        UPDATE clinical_version
           SET valid_to = CURRENT_TIMESTAMP
         WHERE record_id = NEW.id
           AND valid_to IS NULL;

        NEW.version = OLD.version + 1;
    END IF;

    RETURN NEW;
END;
$$;

-- =============================
-- 4. Terminology Tables
-- =============================

CREATE TABLE code_system (
    id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name        varchar(200) NOT NULL,
    uri         varchar(300),
    version     varchar(50),
    description text,
    created_by  uuid REFERENCES user_account(id),
    updated_by  uuid REFERENCES user_account(id),
    created_at  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version_no  integer DEFAULT 1
);

CREATE TABLE code_value (
    id             uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    code_system_id uuid REFERENCES code_system(id),
    code           varchar(50) NOT NULL,
    display        varchar(200),
    synonyms       jsonb,
    active         boolean DEFAULT true,
    created_by     uuid REFERENCES user_account(id),
    updated_by     uuid REFERENCES user_account(id),
    created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version_no     integer DEFAULT 1
);

-- =============================
-- 5. Patient & Encounter
-- =============================

CREATE TABLE patient (
    id                   uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    mrn                  varchar(50) UNIQUE NOT NULL,
    identifier           jsonb,
    name_prefix          varchar(10),
    name_given           varchar(100) NOT NULL,
    name_middle          varchar(100),
    name_family          varchar(100) NOT NULL,
    name_suffix          varchar(10),
    preferred_name       varchar(100),
    birth_date           date NOT NULL,
    death_date           date,
    gender_identity      varchar(50),
    biological_sex       varchar(20),
    preferred_pronouns   varchar(50),
    address              jsonb,
    contact              jsonb,
    preferred_language   varchar(50),
    interpreter_required boolean DEFAULT false,
    marital_status       varchar(50),
    race                 jsonb,
    ethnicity            varchar(50),
    emergency_contacts   jsonb,
    preferred_pharmacy   uuid,
    primary_care_provider uuid,
    active               boolean DEFAULT true,
    preferences          jsonb,
    blood_type           varchar(10),
    organ_donor          boolean,
    advance_directives   jsonb,
    created_by           uuid NOT NULL REFERENCES user_account(id),
    updated_by           uuid NOT NULL REFERENCES user_account(id),
    created_at           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version              integer DEFAULT 1,
    CONSTRAINT chk_gender_identity CHECK (
        gender_identity IN (
            'male','female','transgender-male','transgender-female',
            'non-binary','other','prefer-not-to-say'
        )
        OR gender_identity IS NULL
    ),
    CONSTRAINT chk_biological_sex CHECK (
        biological_sex IN ('male','female','intersex','unknown')
        OR biological_sex IS NULL
    )
);

CREATE TABLE encounter (
    id              uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id      uuid NOT NULL REFERENCES patient(id),
    practitioner_id uuid REFERENCES practitioner(id),
    organization_id uuid REFERENCES organization(id),
    encounter_type  varchar(50) CHECK (
        encounter_type IN ('inpatient','outpatient','emergency','virtual','other')
    ),
    status          varchar(50) CHECK (
        status IN ('planned','in-progress','onhold','finished','cancelled')
    ) DEFAULT 'planned',
    start_time      timestamp,
    end_time        timestamp,
    reason_code     varchar(50),
    reason_text     text,
    location        jsonb,
    created_by      uuid NOT NULL REFERENCES user_account(id),
    updated_by      uuid NOT NULL REFERENCES user_account(id),
    created_at      timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version         integer DEFAULT 1
);

-- =============================
-- 6. Family History, Social History, Care Team, Care Plan
-- =============================

CREATE TABLE family_history (
    id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id  uuid NOT NULL REFERENCES patient(id),
    relationship varchar(50),
    condition   text,
    onset_age   int,
    notes       text,
    created_by  uuid NOT NULL REFERENCES user_account(id),
    updated_by  uuid NOT NULL REFERENCES user_account(id),
    created_at  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version     integer DEFAULT 1
);

CREATE TABLE social_history (
    id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id  uuid NOT NULL REFERENCES patient(id),
    category    varchar(50),
    details     jsonb,
    notes       text,
    created_by  uuid NOT NULL REFERENCES user_account(id),
    updated_by  uuid REFERENCES user_account(id),
    created_at  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version     integer DEFAULT 1
);

CREATE TABLE care_team (
    id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id  uuid NOT NULL REFERENCES patient(id),
    name        varchar(200),
    status      varchar(50) CHECK (
        status IN ('active','inactive','entered-in-error')
    ) DEFAULT 'active',
    members     jsonb,
    notes       text,
    created_by  uuid NOT NULL REFERENCES user_account(id),
    updated_by  uuid REFERENCES user_account(id),
    created_at  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version     integer DEFAULT 1
);

CREATE TABLE care_plan (
    id           uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id   uuid NOT NULL REFERENCES patient(id),
    encounter_id uuid REFERENCES encounter(id),
    title        varchar(200),
    status       varchar(50) CHECK (
        status IN ('draft','active','on-hold','revoked','completed','entered-in-error')
    ) DEFAULT 'draft',
    intent       varchar(50) CHECK (
        intent IN ('proposal','plan','order','option')
    ) DEFAULT 'plan',
    description  text,
    goals        jsonb,
    activities   jsonb,
    created_by   uuid NOT NULL REFERENCES user_account(id),
    updated_by   uuid REFERENCES user_account(id),
    created_at   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version      integer DEFAULT 1
);

-- =============================
-- 7. Condition (Problem), Allergy, Immunization
-- =============================

CREATE TABLE problem (
    id                  uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id          uuid NOT NULL REFERENCES patient(id),
    encounter_id        uuid REFERENCES encounter(id),
    concept_id          uuid,
    code                varchar(50),
    coding_system       varchar(50),
    display_name        varchar(200),
    onset_date          timestamp,
    abatement_date      timestamp,
    clinical_status     varchar(50) CHECK (
        clinical_status IN (
            'active','recurrence','relapse','inactive','remission','resolved'
        )
    ),
    verification_status varchar(50),
    severity            varchar(50),
    body_site           jsonb,
    stage               jsonb,
    evidence            jsonb,
    related_problems    jsonb,
    notes               text,
    created_by          uuid NOT NULL REFERENCES user_account(id),
    updated_by          uuid NOT NULL REFERENCES user_account(id),
    created_at          timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version             integer DEFAULT 1
);

CREATE TABLE allergy (
    id                  uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id          uuid NOT NULL REFERENCES patient(id),
    substance_code      varchar(50) NOT NULL,
    substance_system    varchar(50),
    reaction            jsonb,
    severity            varchar(50) CHECK (
        severity IN ('mild','moderate','severe','life-threatening')
    ),
    clinical_status     varchar(50) CHECK (
        clinical_status IN ('active','inactive','resolved')
    ),
    verification_status varchar(50) CHECK (
        verification_status IN ('unconfirmed','confirmed','refuted','entered-in-error')
    ),
    type                varchar(50) CHECK (
        type IN ('food','medication','environment','biologic','other')
    ),
    onset_date          timestamp,
    notes               text,
    created_by          uuid NOT NULL REFERENCES user_account(id),
    updated_by          uuid NOT NULL REFERENCES user_account(id),
    created_at          timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version             integer DEFAULT 1
);

CREATE TABLE immunization (
    id                uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id        uuid NOT NULL REFERENCES patient(id),
    vaccine_code      varchar(50) NOT NULL,
    vaccine_system    varchar(50),
    status            varchar(50) CHECK (
        status IN ('completed','entered-in-error','not-done')
    ) DEFAULT 'completed',
    occurrence_date   date NOT NULL,
    primary_source    boolean DEFAULT true,
    site              varchar(50),
    route             varchar(50),
    dose_quantity     decimal,
    dose_unit         varchar(20),
    manufacturer      varchar(200),
    lot_number        varchar(50),
    expiration_date   date,
    notes             text,
    created_by        uuid NOT NULL REFERENCES user_account(id),
    updated_by        uuid REFERENCES user_account(id),
    created_at        timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version           integer DEFAULT 1
);

-- =============================
-- 8. Medication Management
-- =============================

CREATE TABLE medication (
    id            uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    code          varchar(50),
    coding_system varchar(50),
    name          varchar(200) NOT NULL,
    form          varchar(100),
    brand         boolean DEFAULT false,
    manufacturer  varchar(200),
    synonyms      jsonb,
    created_by    uuid REFERENCES user_account(id),
    updated_by    uuid REFERENCES user_account(id),
    created_at    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version       integer DEFAULT 1
);

CREATE TABLE medication_request (
    id               uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id       uuid NOT NULL REFERENCES patient(id),
    encounter_id     uuid REFERENCES encounter(id),
    medication_id    uuid NOT NULL REFERENCES medication(id),
    requester_id     uuid REFERENCES practitioner(id),
    status           varchar(50) CHECK (
        status IN ('active','on-hold','cancelled','completed','entered-in-error','stopped')
    ) DEFAULT 'active',
    intent           varchar(50) CHECK (
        intent IN ('proposal','plan','order','reflex-order')
    ) DEFAULT 'order',
    priority         varchar(20) CHECK (
        priority IN ('routine','urgent','stat','asap')
    ) DEFAULT 'routine',
    dosage_instructions jsonb,
    dispense_request    jsonb,
    substitution        jsonb,
    authored_on         timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reason_code         varchar(50),
    reason_text         text,
    notes               text,
    created_by          uuid NOT NULL REFERENCES user_account(id),
    updated_by          uuid REFERENCES user_account(id),
    created_at          timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version             integer DEFAULT 1
);

CREATE TABLE medication_administration (
    id               uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id       uuid NOT NULL REFERENCES patient(id),
    encounter_id     uuid REFERENCES encounter(id),
    medication_id    uuid NOT NULL REFERENCES medication(id),
    administrator_id uuid REFERENCES practitioner(id),
    status           varchar(50) CHECK (
        status IN ('in-progress','completed','entered-in-error','stopped','on-hold')
    ) DEFAULT 'in-progress',
    effective_time   timestamp NOT NULL,
    dosage           jsonb,
    notes            text,
    created_by       uuid NOT NULL REFERENCES user_account(id),
    updated_by       uuid REFERENCES user_account(id),
    created_at       timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version          integer DEFAULT 1
);

CREATE TABLE medication_statement (
    id             uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id     uuid NOT NULL REFERENCES patient(id),
    medication_id  uuid NOT NULL REFERENCES medication(id),
    status         varchar(50) CHECK (
        status IN ('active','completed','entered-in-error','intended','stopped')
    ) DEFAULT 'active',
    taken          varchar(20) CHECK (
        taken IN ('y','n','unk','na')
    ),
    effective_start timestamp,
    effective_end   timestamp,
    dosage         jsonb,
    reason         text,
    created_by     uuid NOT NULL REFERENCES user_account(id),
    updated_by     uuid REFERENCES user_account(id),
    created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version        integer DEFAULT 1
);

-- =============================
-- 9. Procedure Table
-- =============================

CREATE TABLE procedure (
    id             uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id     uuid NOT NULL REFERENCES patient(id),
    encounter_id   uuid REFERENCES encounter(id),
    performer_id   uuid REFERENCES practitioner(id),
    code           varchar(50),
    coding_system  varchar(50),
    description    text,
    status         varchar(50) CHECK (
        status IN ('preparation','in-progress','suspended','aborted','completed','entered-in-error','unknown')
    ) DEFAULT 'in-progress',
    performed_start timestamp,
    performed_end   timestamp,
    outcome        text,
    follow_up      text,
    notes          text,
    created_by     uuid NOT NULL REFERENCES user_account(id),
    updated_by     uuid REFERENCES user_account(id),
    created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version        integer DEFAULT 1
);

-- =============================
-- 10. Diagnostic Requests and Lab
-- =============================

CREATE TABLE diagnostic_request (
    id           uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id   uuid NOT NULL REFERENCES patient(id),
    encounter_id uuid REFERENCES encounter(id),
    requester_id uuid REFERENCES practitioner(id),
    request_type varchar(50) CHECK (
        request_type IN ('laboratory','imaging','pathology','procedure','other')
    ),
    status       varchar(50) CHECK (
        status IN ('draft','active','suspended','cancelled','completed','entered-in-error','unknown')
    ),
    priority     varchar(20) CHECK (
        priority IN ('routine','urgent','stat','asap')
    ),
    category     jsonb,
    code_system  varchar(50),
    code         varchar(50),
    display_name varchar(200),
    clinical_notes text,
    supporting_info jsonb,
    requested_time timestamp NOT NULL,
    scheduled_time timestamp,
    reason_codes jsonb,
    reason_text  text,
    insurance_info jsonb,
    created_by   uuid NOT NULL REFERENCES user_account(id),
    updated_by   uuid REFERENCES user_account(id),
    created_at   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version      integer DEFAULT 1
);

CREATE TABLE lab_request (
    id                   uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    diagnostic_request_id uuid REFERENCES diagnostic_request(id),
    specimen_requirements jsonb,
    fasting_required      boolean DEFAULT false,
    fasting_duration      interval,
    special_instructions  text,
    performing_lab_id     uuid REFERENCES organization(id),
    collection_instructions text,
    created_at           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version              integer DEFAULT 1
);

CREATE TABLE lab_result (
    id             uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    lab_request_id uuid REFERENCES lab_request(id),
    patient_id     uuid REFERENCES patient(id),
    result_type    varchar(50),
    status         varchar(50) CHECK (
        status IN ('registered','partial','preliminary','final','amended','corrected','cancelled')
    ),
    result_code    varchar(50),
    result_value   text,
    unit           varchar(50),
    reference_range jsonb,
    interpretation varchar(50),
    performed_datetime timestamp,
    performer_id   uuid REFERENCES practitioner(id),
    analyzer_id    uuid,
    method         varchar(100),
    result_notes   text,
    created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version        integer DEFAULT 1
);

-- =============================
-- 11. Imaging System
-- =============================

CREATE TABLE imaging_study (
    id                   uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    diagnostic_request_id uuid REFERENCES diagnostic_request(id),
    patient_id           uuid NOT NULL REFERENCES patient(id),
    accession_number     varchar(50) UNIQUE,
    study_uid            varchar(100) UNIQUE NOT NULL,
    study_date           timestamp NOT NULL,
    modality             varchar(50),
    body_site            jsonb,
    laterality           varchar(20),
    description          text,
    procedure_code       varchar(50),
    reason_code          varchar(50),
    referring_physician_id   uuid REFERENCES practitioner(id),
    performing_physician_id  uuid REFERENCES practitioner(id),
    study_status         varchar(50),
    report_status        varchar(50),
    radiation_dose       jsonb,
    contrast_used        boolean,
    contrast_details     jsonb,
    protocol_name        varchar(200),
    patient_position     varchar(50),
    created_at           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version              integer DEFAULT 1
);

CREATE TABLE imaging_series (
    id            uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    imaging_study_id uuid NOT NULL REFERENCES imaging_study(id),
    series_uid    varchar(100) UNIQUE NOT NULL,
    series_number integer,
    modality      varchar(50),
    description   text,
    body_part     varchar(100),
    laterality    varchar(20),
    protocol_name varchar(200),
    series_date   timestamp,
    equipment_id  uuid,
    performed_procedure_step_id varchar(100),
    created_at    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version       integer DEFAULT 1
);

CREATE TABLE imaging_instance (
    id            uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    series_id     uuid NOT NULL REFERENCES imaging_series(id),
    sop_class_uid varchar(100) NOT NULL,
    instance_uid  varchar(100) UNIQUE NOT NULL,
    instance_number integer,
    content_datetime timestamp,
    acquisition_datetime timestamp,
    image_type    varchar[],
    technical_parameters jsonb,
    storage_path  text NOT NULL,
    file_meta     jsonb,
    created_at    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version       integer DEFAULT 1
);

-- =============================
-- 12. Device Management
-- =============================

CREATE TABLE device (
    id             uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    udi            varchar(200),
    type           varchar(100),
    manufacturer   varchar(200),
    model          varchar(100),
    status         varchar(50) CHECK (
        status IN ('active','inactive','entered-in-error','unknown')
    ) DEFAULT 'active',
    patient_id     uuid REFERENCES patient(id),
    owner_organization_id uuid REFERENCES organization(id),
    notes          text,
    created_by     uuid REFERENCES user_account(id),
    updated_by     uuid REFERENCES user_account(id),
    created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version        integer DEFAULT 1
);

-- =============================
-- 13. Observation
-- =============================

CREATE TABLE observation (
    id                   uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id           uuid NOT NULL REFERENCES patient(id),
    encounter_id         uuid REFERENCES encounter(id),
    diagnostic_request_id uuid REFERENCES diagnostic_request(id),
    code                 varchar(50),
    coding_system        varchar(50),
    display_name         varchar(200),
    effective_time       timestamp,
    status               varchar(50),
    category             varchar(50),
    value_quantity       decimal,
    value_unit           varchar(20),
    value_codeable_concept uuid,
    value_string         text,
    value_boolean        boolean,
    value_datetime       timestamp,
    interpretation       varchar(50),
    method               uuid,
    body_site            uuid,
    device_id            uuid REFERENCES device(id),
    reference_range      jsonb,
    performer_id         uuid REFERENCES practitioner(id),
    notes                text,
    created_by           uuid NOT NULL REFERENCES user_account(id),
    updated_by           uuid REFERENCES user_account(id),
    created_at           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version              integer DEFAULT 1
);

-- =============================
-- 14. Clinical Report
-- =============================

CREATE TABLE clinical_report (
    id                   uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id           uuid NOT NULL REFERENCES patient(id),
    diagnostic_request_id uuid REFERENCES diagnostic_request(id),
    imaging_study_id     uuid REFERENCES imaging_study(id),
    report_type          varchar(50),
    status               varchar(50),
    category             varchar(50),
    findings             text,
    impression           text,
    recommendations      text,
    attachments          jsonb,
    author_id            uuid REFERENCES practitioner(id),
    verifier_id          uuid REFERENCES practitioner(id),
    verified_at          timestamp,
    created_at           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version              integer DEFAULT 1
);

-- =============================
-- 15. Consent Management
-- =============================

CREATE TABLE consent (
    id                uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id        uuid NOT NULL REFERENCES patient(id),
    scope             varchar(50),
    category          varchar(50),
    status            varchar(50) CHECK (
        status IN ('draft','active','inactive','entered-in-error')
    ) DEFAULT 'active',
    date_time         timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    policy            jsonb,
    performer_id      uuid REFERENCES practitioner(id),
    organization_id   uuid REFERENCES organization(id),
    source            jsonb,
    notes             text,
    created_by        uuid NOT NULL REFERENCES user_account(id),
    updated_by        uuid REFERENCES user_account(id),
    created_at        timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version           integer DEFAULT 1
);

-- =============================
-- 16. Appointment Scheduling
-- =============================

CREATE TABLE schedule (
    id               uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    practitioner_id  uuid REFERENCES practitioner(id),
    organization_id  uuid REFERENCES organization(id),
    active           boolean DEFAULT true,
    service_category varchar(50),
    service_type     varchar(50),
    specialty        varchar(50),
    planning_horizon jsonb,
    created_by       uuid REFERENCES user_account(id),
    updated_by       uuid REFERENCES user_account(id),
    created_at       timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version          integer DEFAULT 1
);

CREATE TABLE appointment (
    id             uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id     uuid NOT NULL REFERENCES patient(id),
    schedule_id    uuid REFERENCES schedule(id),
    practitioner_id uuid REFERENCES practitioner(id),
    start_time     timestamp NOT NULL,
    end_time       timestamp NOT NULL,
    status         varchar(50) CHECK (
        status IN ('proposed','pending','booked','arrived','fulfilled','cancelled','noshow')
    ) DEFAULT 'booked',
    description    text,
    reason_code    varchar(50),
    reason_text    text,
    notes          text,
    created_by     uuid REFERENCES user_account(id),
    updated_by     uuid REFERENCES user_account(id),
    created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version        integer DEFAULT 1
);

-- =============================
-- 17. Questionnaires
-- =============================

CREATE TABLE questionnaire (
    id           uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title        varchar(200) NOT NULL,
    status       varchar(50) CHECK (
        status IN ('draft','active','retired','unknown')
    ) DEFAULT 'draft',
    description  text,
    items        jsonb,
    created_by   uuid REFERENCES user_account(id),
    updated_by   uuid REFERENCES user_account(id),
    created_at   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version      integer DEFAULT 1
);

CREATE TABLE questionnaire_response (
    id                uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    questionnaire_id  uuid REFERENCES questionnaire(id),
    patient_id        uuid REFERENCES patient(id),
    encounter_id      uuid REFERENCES encounter(id),
    status            varchar(50) CHECK (
        status IN ('in-progress','completed','amended','entered-in-error','stopped')
    ) DEFAULT 'in-progress',
    authored          timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    author_id         uuid REFERENCES practitioner(id),
    source            uuid,
    answers           jsonb,
    created_by        uuid REFERENCES user_account(id),
    updated_by        uuid REFERENCES user_account(id),
    created_at        timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version           integer DEFAULT 1
);

-- =============================
-- 18. Clinical Decision Support
-- =============================

CREATE TABLE clinical_decision_support (
    id             uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name           varchar(200) NOT NULL,
    cds_type       varchar(50),
    description    text,
    logic          text,
    triggers       jsonb,
    active         boolean DEFAULT true,
    created_by     uuid REFERENCES user_account(id),
    updated_by     uuid REFERENCES user_account(id),
    created_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version        integer DEFAULT 1
);

-- =============================
-- 19. Indexes
-- =============================

CREATE INDEX idx_patient_mrn ON patient(mrn);
CREATE INDEX idx_patient_name ON patient(name_family, name_given);
CREATE INDEX idx_problem_patient ON problem(patient_id);
CREATE INDEX idx_diagnostic_request_patient ON diagnostic_request(patient_id);
CREATE INDEX idx_lab_result_patient ON lab_result(patient_id);
CREATE INDEX idx_imaging_study_patient ON imaging_study(patient_id);
CREATE INDEX idx_observation_patient ON observation(patient_id);
CREATE INDEX idx_clinical_report_patient ON clinical_report(patient_id);

CREATE INDEX idx_patient_identifier ON patient USING gin (identifier);
CREATE INDEX idx_diagnostic_request_category ON diagnostic_request USING gin (category);
CREATE INDEX idx_imaging_study_body_site ON imaging_study USING gin (body_site);

CREATE INDEX idx_encounter_patient ON encounter(patient_id);
CREATE INDEX idx_encounter_status ON encounter(status);
CREATE INDEX idx_allergy_patient ON allergy(patient_id);
CREATE INDEX idx_immunization_patient ON immunization(patient_id);
CREATE INDEX idx_medication_request_patient ON medication_request(patient_id);
CREATE INDEX idx_medication_administration_patient ON medication_administration(patient_id);
CREATE INDEX idx_medication_statement_patient ON medication_statement(patient_id);
CREATE INDEX idx_procedure_patient ON procedure(patient_id);
CREATE INDEX idx_family_history_patient ON family_history(patient_id);
CREATE INDEX idx_social_history_patient ON social_history(patient_id);
CREATE INDEX idx_care_team_patient ON care_team(patient_id);
CREATE INDEX idx_care_plan_patient ON care_plan(patient_id);
CREATE INDEX idx_appointment_patient ON appointment(patient_id);
CREATE INDEX idx_schedule_org ON schedule(organization_id);
CREATE INDEX idx_questionnaire_response_patient ON questionnaire_response(patient_id);
CREATE INDEX idx_device_patient ON device(patient_id);

-- =============================
-- 20. Version Triggers
-- =============================

CREATE TRIGGER user_account_version_trigger
BEFORE INSERT OR UPDATE ON user_account
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER organization_version_trigger
BEFORE INSERT OR UPDATE ON organization
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER practitioner_version_trigger
BEFORE INSERT OR UPDATE ON practitioner
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER code_system_version_trigger
BEFORE INSERT OR UPDATE ON code_system
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER code_value_version_trigger
BEFORE INSERT OR UPDATE ON code_value
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER patient_version_trigger
BEFORE INSERT OR UPDATE ON patient
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER encounter_version_trigger
BEFORE INSERT OR UPDATE ON encounter
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER family_history_version_trigger
BEFORE INSERT OR UPDATE ON family_history
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER social_history_version_trigger
BEFORE INSERT OR UPDATE ON social_history
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER care_team_version_trigger
BEFORE INSERT OR UPDATE ON care_team
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER care_plan_version_trigger
BEFORE INSERT OR UPDATE ON care_plan
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER problem_version_trigger
BEFORE INSERT OR UPDATE ON problem
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER allergy_version_trigger
BEFORE INSERT OR UPDATE ON allergy
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER immunization_version_trigger
BEFORE INSERT OR UPDATE ON immunization
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER medication_version_trigger
BEFORE INSERT OR UPDATE ON medication
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER medication_request_version_trigger
BEFORE INSERT OR UPDATE ON medication_request
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER medication_administration_version_trigger
BEFORE INSERT OR UPDATE ON medication_administration
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER medication_statement_version_trigger
BEFORE INSERT OR UPDATE ON medication_statement
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER procedure_version_trigger
BEFORE INSERT OR UPDATE ON procedure
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER diagnostic_request_version_trigger
BEFORE INSERT OR UPDATE ON diagnostic_request
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER lab_request_version_trigger
BEFORE INSERT OR UPDATE ON lab_request
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER lab_result_version_trigger
BEFORE INSERT OR UPDATE ON lab_result
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER imaging_study_version_trigger
BEFORE INSERT OR UPDATE ON imaging_study
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER imaging_series_version_trigger
BEFORE INSERT OR UPDATE ON imaging_series
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER imaging_instance_version_trigger
BEFORE INSERT OR UPDATE ON imaging_instance
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER device_version_trigger
BEFORE INSERT OR UPDATE ON device
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER observation_version_trigger
BEFORE INSERT OR UPDATE ON observation
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER clinical_report_version_trigger
BEFORE INSERT OR UPDATE ON clinical_report
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER consent_version_trigger
BEFORE INSERT OR UPDATE ON consent
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER schedule_version_trigger
BEFORE INSERT OR UPDATE ON schedule
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER appointment_version_trigger
BEFORE INSERT OR UPDATE ON appointment
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER questionnaire_version_trigger
BEFORE INSERT OR UPDATE ON questionnaire
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER questionnaire_response_version_trigger
BEFORE INSERT OR UPDATE ON questionnaire_response
FOR EACH ROW
EXECUTE FUNCTION create_version();

CREATE TRIGGER clinical_decision_support_version_trigger
BEFORE INSERT OR UPDATE ON clinical_decision_support
FOR EACH ROW
EXECUTE FUNCTION create_version();