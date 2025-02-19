import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserAccount } from '../../user/entities/user-account.entity'; // Assuming this exists
import { Encounter } from '../../encounter/entities/encounter.entity';
import { Problem } from '../../problem/entities/problem.entity';
import { Allergy } from '../../allergy/entities/allergy.entity';
import { Immunization } from '../../immunization/entities/immunization.entity';
import { FamilyHistory } from '../../family-history/entities/family-history.entity';
import { SocialHistory } from '../../social-history/entities/social-history.entity';
import { CareTeam } from '../../care-team/entities/care-team.entity';
import { CarePlan } from '../../care-plan/entities/care-plan.entity';
import { UseDto } from '../../../common/decorators/use-dto.decorator';
import { Gender } from '../enums/gender.enum';
import { PatientDto } from '../dtos/patient.dto';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('patient')
@UseDto(PatientDto)
export class Patient extends BaseEntity {
  @Column({ unique: true })
  mrn!: string;

  @Column({ type: 'jsonb', nullable: true })
  identifier?: Record<string, any>;

  @Column({ length: 10, nullable: true })
  name_prefix?: string;

  @Column({ length: 100 })
  name_given!: string;

  @Column({ length: 100, nullable: true })
  name_middle?: string;

  @Column({ length: 100 })
  name_family!: string;

  @Column({ length: 10, nullable: true })
  name_suffix?: string;

  @Column({ length: 100, nullable: true })
  preferred_name?: string;

  @Column({ type: 'date' })
  birth_date!: Date;

  @Column({ type: 'date', nullable: true })
  death_date?: Date;

  @Column({ length: 50, nullable: true })
  gender_identity?: string;

  @Column({ length: 20, nullable: true })
  biological_sex?: string;

  @Column({ length: 50, nullable: true })
  preferred_pronouns?: string;

  @Column({ type: 'jsonb', nullable: true })
  address?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  contact?: Record<string, any>;

  @Column({ length: 50, nullable: true })
  preferred_language?: string;

  @Column({ default: false })
  interpreter_required!: boolean;

  @Column({ length: 50, nullable: true })
  marital_status?: string;

  @Column({ type: 'jsonb', nullable: true })
  race?: Record<string, any>;

  @Column({ length: 50, nullable: true })
  ethnicity?: string;

  @Column({ type: 'jsonb', nullable: true })
  emergency_contacts?: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  preferred_pharmacy?: string;

  @Column({ type: 'uuid', nullable: true })
  primary_care_provider?: string;

  @Column({ default: true })
  active!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: Record<string, any>;

  @Column({ length: 10, nullable: true })
  blood_type?: string;

  @Column({ nullable: true })
  organ_donor?: boolean;

  @Column({ type: 'jsonb', nullable: true })
  advance_directives?: Record<string, any>;

  // Relationships
  @OneToMany(() => Encounter, encounter => encounter.patient)
  encounters?: Encounter[];

  @OneToMany(() => Problem, problem => problem.patient)
  problems?: Problem[];

  @OneToMany(() => Allergy, allergy => allergy.patient)
  allergies?: Allergy[];

  @OneToMany(() => Immunization, immunization => immunization.patient)
  immunizations?: Immunization[];

  @OneToMany(() => FamilyHistory, familyHistory => familyHistory.patient)
  familyHistories?: FamilyHistory[];

  @OneToMany(() => SocialHistory, socialHistory => socialHistory.patient)
  socialHistories?: SocialHistory[];

  @OneToMany(() => CareTeam, careTeam => careTeam.patient)
  careTeams?: CareTeam[];

  @OneToMany(() => CarePlan, carePlan => carePlan.patient)
  carePlans?: CarePlan[];
} 