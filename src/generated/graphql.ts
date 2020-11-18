export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /**
   * Leverages the internal Python implmeentation of UUID (uuid.UUID) to provide native UUID objects
   * in fields, resolvers and input.
   */
  UUID: any;
  DictType: any;
};

export type Query = {
  __typename?: 'Query';
  projectLibrarylist?: Maybe<Array<Maybe<ProjectLibrary>>>;
  projectLibrary?: Maybe<ProjectLibrary>;
  projectLibraryCategoriesList?: Maybe<Array<Maybe<ProjectLibraryCategory>>>;
  projectLibraryCategories?: Maybe<ProjectLibraryCategory>;
  domainList?: Maybe<Array<Maybe<Domain>>>;
  domain?: Maybe<Domain>;
  domainCategoriesList?: Maybe<Array<Maybe<DomainLibraryCategory>>>;
  domainCategories?: Maybe<DomainLibraryCategory>;
  componentList?: Maybe<Array<Maybe<Component>>>;
  component?: Maybe<Component>;
  componentCategoriesList?: Maybe<Array<Maybe<ComponentLibraryCategory>>>;
  componentCategories?: Maybe<ComponentLibraryCategory>;
  assemblyList?: Maybe<Array<Maybe<Assembly>>>;
  assembly?: Maybe<Assembly>;
  assemblyCategoriesList?: Maybe<Array<Maybe<AssemblyLibraryCategory>>>;
  assemblyCategories?: Maybe<AssemblyLibraryCategory>;
  activityList?: Maybe<Array<Maybe<Activity>>>;
  activity?: Maybe<Activity>;
  activityCategoriesList?: Maybe<Array<Maybe<ActivityLibraryCategory>>>;
  activityCategories?: Maybe<ActivityLibraryCategory>;
  domainTemplatelist?: Maybe<Array<Maybe<DomainTemplate>>>;
  domainTemplate?: Maybe<DomainTemplate>;
  domainTemplateCategoriesList?: Maybe<Array<Maybe<DomainLibraryCategory>>>;
  domainTemplateCategories?: Maybe<DomainLibraryCategory>;
  userList?: Maybe<Array<Maybe<User>>>;
  user?: Maybe<User>;
  projectRoleList?: Maybe<Array<Maybe<ProjectRole>>>;
  projectRole?: Maybe<ProjectRole>;
  attachmentTypeList?: Maybe<Array<Maybe<AttachmentType>>>;
  attachmentType?: Maybe<AttachmentType>;
  userGroupList?: Maybe<Array<Maybe<UserGroup>>>;
  userGroup?: Maybe<UserGroup>;
  organizationList?: Maybe<Array<Maybe<Organization>>>;
  organization?: Maybe<Organization>;
  countryList?: Maybe<Array<Maybe<Country>>>;
  country?: Maybe<Country>;
  regionList?: Maybe<Array<Maybe<Region>>>;
  region?: Maybe<Region>;
  coordinateSystemList?: Maybe<Array<Maybe<CoordinateSystem>>>;
  coordinateSystem?: Maybe<CoordinateSystem>;
  attachmentList?: Maybe<Array<Maybe<Attachment>>>;
  attachment?: Maybe<Attachment>;
  projectFileList?: Maybe<Array<Maybe<ProjectFile>>>;
  projectFile?: Maybe<ProjectFile>;
  domainEntityList?: Maybe<Array<Maybe<DomainEntity>>>;
  domainEntity?: Maybe<DomainEntity>;
  project?: Maybe<ProjectOrError>;
  projectList?: Maybe<ProjectListOrError>;
  me?: Maybe<User>;
};

export type QueryProjectLibraryArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryProjectLibraryCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryDomainArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryDomainCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryComponentArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryComponentCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryAssemblyArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryAssemblyCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryActivityArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryActivityCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryDomainTemplateArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryDomainTemplateCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryUserArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryProjectRoleArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryAttachmentTypeArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryUserGroupArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryOrganizationArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryCountryArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryRegionArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryCoordinateSystemArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryAttachmentArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryProjectFileArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryDomainEntityArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type QueryProjectArgs = {
  vid?: Maybe<Scalars['UUID']>;
  version?: Maybe<Scalars['Int']>;
};

export type ProjectLibrary = {
  __typename?: 'ProjectLibrary';
  category?: Maybe<ProjectLibraryCategory>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type ProjectLibraryCategory = {
  __typename?: 'ProjectLibraryCategory';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<ProjectLibraryCategory>;
};

export type Domain = {
  __typename?: 'Domain';
  category?: Maybe<DomainLibraryCategory>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type DomainLibraryCategory = {
  __typename?: 'DomainLibraryCategory';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<DomainLibraryCategory>;
};

export type Component = {
  __typename?: 'Component';
  category?: Maybe<ComponentLibraryCategory>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type ComponentLibraryCategory = {
  __typename?: 'ComponentLibraryCategory';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<ComponentLibraryCategory>;
};

export type Assembly = {
  __typename?: 'Assembly';
  category?: Maybe<AssemblyLibraryCategory>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type AssemblyLibraryCategory = {
  __typename?: 'AssemblyLibraryCategory';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<AssemblyLibraryCategory>;
};

export type Activity = {
  __typename?: 'Activity';
  category?: Maybe<ActivityLibraryCategory>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type ActivityLibraryCategory = {
  __typename?: 'ActivityLibraryCategory';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<ActivityLibraryCategory>;
};

export type DomainTemplate = {
  __typename?: 'DomainTemplate';
  category?: Maybe<DomainLibraryCategory>;
  entity?: Maybe<DomainEntity>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  attributes?: Maybe<Array<Maybe<PropertyMeta>>>;
};

export type DomainEntity = {
  __typename?: 'DomainEntity';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
};

/**
 * Model to description object attributes.
 *
 *     Model attributes:
 *         title - civil attribute name by user native language
 *         name - technical attribute name
 *         attr_type - attributes data type, must be mapped to marshmellow types,
 *                     example: Str, Int, RefLink('Model')
 *         unit - Attributes unit, example: km^2, m^3
 *         validation_rules - Rules for validation object attribute value
 */
export type PropertyMeta = {
  __typename?: 'PropertyMeta';
  title?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  entity?: Maybe<DomainEntity>;
  attrType?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  validationRules?: Maybe<ValidationRules>;
  description?: Maybe<Scalars['String']>;
};

/**
 * Validation Rules.
 *
 *     Todo:
 *     1. Develop valudation rule syntax
 *     2. Realize validate value by valudation rules
 */
export type ValidationRules = {
  __typename?: 'ValidationRules';
  rules?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type User = {
  __typename?: 'User';
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  login?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  patronym?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  adId?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  favoriteProjects?: Maybe<Array<Maybe<Scalars['ID']>>>;
  groups?: Maybe<Array<Maybe<UserGroup>>>;
};

export type UserGroup = {
  __typename?: 'UserGroup';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
};

export type ProjectRole = {
  __typename?: 'ProjectRole';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  defaultAttachmentType?: Maybe<AttachmentType>;
};

export type AttachmentType = {
  __typename?: 'AttachmentType';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
};

export type Organization = {
  __typename?: 'Organization';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
};

export type Country = {
  __typename?: 'Country';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
};

export type Region = {
  __typename?: 'Region';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  country?: Maybe<Country>;
};

export type CoordinateSystem = {
  __typename?: 'CoordinateSystem';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  coordsNumber?: Maybe<Scalars['Int']>;
};

export type Attachment = {
  __typename?: 'Attachment';
  extension?: Maybe<Scalars['String']>;
  uri?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  createdBy?: Maybe<User>;
  editedBy?: Maybe<User>;
  comment?: Maybe<Scalars['String']>;
  category?: Maybe<AttachmentType>;
  contentType?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Int']>;
  projectId?: Maybe<Scalars['ID']>;
  size?: Maybe<Scalars['Int']>;
};

/** ??? */
export type ProjectFile = {
  __typename?: 'ProjectFile';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  extension?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  uri?: Maybe<Scalars['String']>;
};

export type ProjectOrError = Project | Error;

export type Project = {
  __typename?: 'Project';
  isFavorite?: Maybe<Scalars['Boolean']>;
  attendeesTotal?: Maybe<Scalars['Int']>;
  filesTotal?: Maybe<Scalars['Int']>;
  files?: Maybe<Array<Maybe<Attachment>>>;
  attendees?: Maybe<Array<Maybe<Attendee>>>;
  yearEnd?: Maybe<Scalars['Int']>;
  domainSchema?: Maybe<DomainSchema>;
  versions?: Maybe<Array<Maybe<Scalars['Int']>>>;
  myRoles?: Maybe<Array<Maybe<ProjectRole>>>;
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  type?: Maybe<Scalars['String']>;
  createdBy?: Maybe<User>;
  editedBy?: Maybe<User>;
  authorUnit?: Maybe<Scalars['String']>;
  region?: Maybe<Region>;
  coordinates?: Maybe<Scalars['String']>;
  coordinateSystem?: Maybe<CoordinateSystem>;
  description?: Maybe<Scalars['String']>;
  rootEntity?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  planningHorizon?: Maybe<Scalars['String']>;
  yearStart?: Maybe<Scalars['Int']>;
  years?: Maybe<Scalars['Int']>;
  version?: Maybe<Scalars['Int']>;
};

export type Attendee = {
  __typename?: 'Attendee';
  user?: Maybe<User>;
  roles?: Maybe<Array<Maybe<ProjectRole>>>;
};

export type DomainSchema = {
  __typename?: 'DomainSchema';
  entityImages?: Maybe<Array<Maybe<DomainEntityImage>>>;
  version?: Maybe<Scalars['String']>;
};

export type DomainEntityImage = {
  __typename?: 'DomainEntityImage';
  vid?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  entity?: Maybe<DomainEntity>;
  attributes?: Maybe<Array<Maybe<PropertyMeta>>>;
  description?: Maybe<Scalars['String']>;
};

/** Common error-object class. */
export type Error = ErrorInterface & {
  __typename?: 'Error';
  /** Код ошибки, соответствующий человекочитаемому сообщению об ошибке */
  code: ErrorCodes;
  /** Сообщение об ошибке. Отображается в случае отсутствия соответствующего коду человекочитаемого сообщения на клиенте */
  message: Scalars['String'];
  details?: Maybe<Scalars['String']>;
  payload?: Maybe<Scalars['DictType']>;
};

/** Интерфейс ошибок, отображаемых пользователю. */
export type ErrorInterface = {
  /** Код ошибки, соответствующий человекочитаемому сообщению об ошибке */
  code: ErrorCodes;
  /** Сообщение об ошибке. Отображается в случае отсутствия соответствующего коду человекочитаемого сообщения на клиенте */
  message: Scalars['String'];
  details?: Maybe<Scalars['String']>;
  payload?: Maybe<Scalars['DictType']>;
};

/** An enumeration. */
export enum ErrorCodes {
  /** Проект не найден */
  ProjectNotFound = 'PROJECT_NOT_FOUND',
  /** Проект уже удалён */
  ProjectAlreadyRemoved = 'PROJECT_ALREADY_REMOVED',
  /** Ошибка при обновлении проекта */
  ProjectUpdateError = 'PROJECT_UPDATE_ERROR',
  /** Объект справочника не найден */
  ReferenceItemNotFound = 'REFERENCE_ITEM_NOT_FOUND',
  /** Объект библиотеки не найден */
  LibraryItemNotFound = 'LIBRARY_ITEM_NOT_FOUND',
  /** Ошибка */
  Error = 'ERROR',
  /** Некорректная версия проекта */
  IncorrectProjectVersion = 'INCORRECT_PROJECT_VERSION',
  /** Расхождение версий проекта */
  ProjectVersionDiffError = 'PROJECT_VERSION_DIFF_ERROR',
  /** Попытка создания объекта с повторяющися vid */
  DoubleIdCreation = 'DOUBLE_ID_CREATION',
  /** Объект не найден */
  ObjectNotFound = 'OBJECT_NOT_FOUND',
  /** Использованы излишние параметры */
  TooManyParameters = 'TOO_MANY_PARAMETERS',
  /** Объект не соответсвует требованиям к данным */
  ValidationError = 'VALIDATION_ERROR',
  /** Проект с таким именем уже существует */
  ProjectNameAlreadyExists = 'PROJECT_NAME_ALREADY_EXISTS',
  /** Пустое имя проекта */
  EmptyProjectName = 'EMPTY_PROJECT_NAME',
  /** Пользователь не обладает провами для совершения операции */
  NoRights = 'NO_RIGHTS',
  /** FEM instance not found */
  FemInstanceNotFound = 'FEM_INSTANCE_NOT_FOUND',
  /** Year value not found */
  YearValueNotFound = 'YEAR_VALUE_NOT_FOUND',
  /** Wrong date tracked value type */
  DateTrackedValueType = 'DATE_TRACKED_VALUE_TYPE',
  /** CAPEX deserialization error */
  CapexDeserialization = 'CAPEX_DESERIALIZATION',
  /** Autoexport is already set in OPEX */
  AutoexportIsAlreadySet = 'AUTOEXPORT_IS_ALREADY_SET',
  /** Autoexport is not set in OPEX */
  AutoexportIsNotSet = 'AUTOEXPORT_IS_NOT_SET',
  /** MKOS is already set in OPEX */
  MkosIsAlreadySet = 'MKOS_IS_ALREADY_SET',
  /** MKOS is not set in OPEX */
  MkosIsNotSet = 'MKOS_IS_NOT_SET',
  /** OPEX deserialization error */
  OpexDeserialization = 'OPEX_DESERIALIZATION',
  /** Необходимо указать либо набор, либо группу объектов. */
  LcScenarioStepWrongData = 'LC_SCENARIO_STEP_WRONG_DATA',
  /** Указанные объекты отсутствуют в проекте. */
  LcScenarioObjectListError = 'LC_SCENARIO_OBJECT_LIST_ERROR',
}

export type ProjectListOrError = ProjectList | Error;

export type ProjectList = {
  __typename?: 'ProjectList';
  projectList?: Maybe<Array<Maybe<Project>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createProjectLibrary?: Maybe<CreateProjectLibrary>;
  deleteProjectLibrary?: Maybe<DeleteProjectLibrary>;
  updateProjectLibrary?: Maybe<UpdateProjectLibrary>;
  createProjectLibraryCategories?: Maybe<CreateProjectLibraryCategories>;
  deleteProjectLibraryCategories?: Maybe<DeleteProjectLibraryCategories>;
  updateProjectLibraryCategories?: Maybe<UpdateProjectLibraryCategories>;
  createDomain?: Maybe<CreateDomain>;
  deleteDomain?: Maybe<DeleteDomain>;
  updateDomain?: Maybe<UpdateDomain>;
  createDomainCategories?: Maybe<CreateDomainCategories>;
  deleteDomainCategories?: Maybe<DeleteDomainCategories>;
  updateDomainCategories?: Maybe<UpdateDomainCategories>;
  createComponent?: Maybe<CreateComponent>;
  deleteComponent?: Maybe<DeleteComponent>;
  updateComponent?: Maybe<UpdateComponent>;
  createComponentCategories?: Maybe<CreateComponentCategories>;
  deleteComponentCategories?: Maybe<DeleteComponentCategories>;
  updateComponentCategories?: Maybe<UpdateComponentCategories>;
  createAssembly?: Maybe<CreateAssembly>;
  deleteAssembly?: Maybe<DeleteAssembly>;
  updateAssembly?: Maybe<UpdateAssembly>;
  createAssemblyCategories?: Maybe<CreateAssemblyCategories>;
  deleteAssemblyCategories?: Maybe<DeleteAssemblyCategories>;
  updateAssemblyCategories?: Maybe<UpdateAssemblyCategories>;
  createActivity?: Maybe<CreateActivity>;
  deleteActivity?: Maybe<DeleteActivity>;
  updateActivity?: Maybe<UpdateActivity>;
  createActivityCategories?: Maybe<CreateActivityCategories>;
  deleteActivityCategories?: Maybe<DeleteActivityCategories>;
  updateActivityCategories?: Maybe<UpdateActivityCategories>;
  createDomainTemplate?: Maybe<CreateDomainTemplate>;
  deleteDomainTemplate?: Maybe<DeleteDomainTemplate>;
  updateDomainTemplate?: Maybe<UpdateDomainTemplate>;
  createDomainTemplateCategories?: Maybe<CreateDomainTemplateCategories>;
  deleteDomainTemplateCategories?: Maybe<DeleteDomainTemplateCategories>;
  updateDomainTemplateCategories?: Maybe<UpdateDomainTemplateCategories>;
  createUser?: Maybe<CreateUser>;
  deleteUser?: Maybe<DeleteUser>;
  updateUser?: Maybe<UpdateUser>;
  createProjectRole?: Maybe<CreateProjectRole>;
  deleteProjectRole?: Maybe<DeleteProjectRole>;
  updateProjectRole?: Maybe<UpdateProjectRole>;
  createAttachmentType?: Maybe<CreateAttachmentType>;
  deleteAttachmentType?: Maybe<DeleteAttachmentType>;
  updateAttachmentType?: Maybe<UpdateAttachmentType>;
  createUserGroup?: Maybe<CreateUserGroup>;
  deleteUserGroup?: Maybe<DeleteUserGroup>;
  updateUserGroup?: Maybe<UpdateUserGroup>;
  createOrganization?: Maybe<CreateOrganization>;
  deleteOrganization?: Maybe<DeleteOrganization>;
  updateOrganization?: Maybe<UpdateOrganization>;
  createCountry?: Maybe<CreateCountry>;
  deleteCountry?: Maybe<DeleteCountry>;
  updateCountry?: Maybe<UpdateCountry>;
  createRegion?: Maybe<CreateRegion>;
  deleteRegion?: Maybe<DeleteRegion>;
  updateRegion?: Maybe<UpdateRegion>;
  createCoordinateSystem?: Maybe<CreateCoordinateSystem>;
  deleteCoordinateSystem?: Maybe<DeleteCoordinateSystem>;
  updateCoordinateSystem?: Maybe<UpdateCoordinateSystem>;
  createAttachment?: Maybe<CreateAttachment>;
  deleteAttachment?: Maybe<DeleteAttachment>;
  updateAttachment?: Maybe<UpdateAttachment>;
  createProjectFile?: Maybe<CreateProjectFile>;
  deleteProjectFile?: Maybe<DeleteProjectFile>;
  updateProjectFile?: Maybe<UpdateProjectFile>;
  createDomainEntity?: Maybe<CreateDomainEntity>;
  deleteDomainEntity?: Maybe<DeleteDomainEntity>;
  updateDomainEntity?: Maybe<UpdateDomainEntity>;
  createProject?: Maybe<ProjectOrError>;
  deleteProject?: Maybe<UuidOrError>;
  updateProject?: Maybe<ProjectDiffOrError>;
  addAttendees?: Maybe<AttendeeListOrError>;
  removeAttendees?: Maybe<AttendeeListOrError>;
};

export type MutationCreateProjectLibraryArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteProjectLibraryArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateProjectLibraryArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateProjectLibraryCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteProjectLibraryCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateProjectLibraryCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateDomainArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteDomainArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateDomainArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateDomainCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteDomainCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateDomainCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateComponentArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteComponentArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateComponentArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateComponentCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteComponentCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateComponentCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateAssemblyArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteAssemblyArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateAssemblyArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateAssemblyCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteAssemblyCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateAssemblyCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateActivityArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteActivityArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateActivityArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateActivityCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteActivityCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateActivityCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateDomainTemplateArgs = {
  attributes?: Maybe<Array<Maybe<PropertyMetaInputType>>>;
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  entity?: Maybe<Scalars['UUID']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteDomainTemplateArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateDomainTemplateArgs = {
  attributes?: Maybe<Array<Maybe<PropertyMetaInputType>>>;
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  entity?: Maybe<Scalars['UUID']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateDomainTemplateCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteDomainTemplateCategoriesArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateDomainTemplateCategoriesArgs = {
  code?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['UUID']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateUserArgs = {
  adId?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  favoriteProjects?: Maybe<Array<Maybe<Scalars['UUID']>>>;
  firstName?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Maybe<Scalars['UUID']>>>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  login?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  patronym?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteUserArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateUserArgs = {
  adId?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  favoriteProjects?: Maybe<Array<Maybe<Scalars['UUID']>>>;
  firstName?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Maybe<Scalars['UUID']>>>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  login?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  patronym?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateProjectRoleArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  defaultAttachmentType?: Maybe<Scalars['UUID']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteProjectRoleArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateProjectRoleArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  defaultAttachmentType?: Maybe<Scalars['UUID']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateAttachmentTypeArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteAttachmentTypeArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateAttachmentTypeArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateUserGroupArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteUserGroupArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateUserGroupArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateOrganizationArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteOrganizationArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateOrganizationArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateCountryArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteCountryArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateCountryArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateRegionArgs = {
  code?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['UUID']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  fullName?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteRegionArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateRegionArgs = {
  code?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['UUID']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  fullName?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateCoordinateSystemArgs = {
  code?: Maybe<Scalars['String']>;
  coordsNumber?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteCoordinateSystemArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateCoordinateSystemArgs = {
  code?: Maybe<Scalars['String']>;
  coordsNumber?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateAttachmentArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<Scalars['UUID']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  editedBy?: Maybe<Scalars['UUID']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  projectId?: Maybe<Scalars['UUID']>;
  size?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteAttachmentArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateAttachmentArgs = {
  category?: Maybe<Scalars['UUID']>;
  code?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdBy?: Maybe<Scalars['UUID']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  editedBy?: Maybe<Scalars['UUID']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  projectId?: Maybe<Scalars['UUID']>;
  size?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateProjectFileArgs = {
  category?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  extension?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  uri?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteProjectFileArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateProjectFileArgs = {
  category?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  extension?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  uri?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateDomainEntityArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationDeleteDomainEntityArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateDomainEntityArgs = {
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  editedAt?: Maybe<Scalars['DateTime']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationCreateProjectArgs = {
  data?: Maybe<ProjectInputType>;
};

export type MutationDeleteProjectArgs = {
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationUpdateProjectArgs = {
  data?: Maybe<ProjectUpdateType>;
  vid?: Maybe<Scalars['UUID']>;
};

export type MutationAddAttendeesArgs = {
  attendees: Array<Maybe<AttendeeInputType>>;
  projectId: Scalars['UUID'];
  version: Scalars['Int'];
};

export type MutationRemoveAttendeesArgs = {
  attendees: Array<Maybe<Scalars['UUID']>>;
  projectId: Scalars['UUID'];
  version: Scalars['Int'];
};

export type CreateProjectLibrary = {
  __typename?: 'CreateProjectLibrary';
  result?: Maybe<ProjectLibrary>;
};

export type DeleteProjectLibrary = {
  __typename?: 'DeleteProjectLibrary';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateProjectLibrary = {
  __typename?: 'UpdateProjectLibrary';
  result?: Maybe<ProjectLibrary>;
};

export type CreateProjectLibraryCategories = {
  __typename?: 'CreateProjectLibraryCategories';
  result?: Maybe<ProjectLibraryCategory>;
};

export type DeleteProjectLibraryCategories = {
  __typename?: 'DeleteProjectLibraryCategories';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateProjectLibraryCategories = {
  __typename?: 'UpdateProjectLibraryCategories';
  result?: Maybe<ProjectLibrary>;
};

export type CreateDomain = {
  __typename?: 'CreateDomain';
  result?: Maybe<Domain>;
};

export type DeleteDomain = {
  __typename?: 'DeleteDomain';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateDomain = {
  __typename?: 'UpdateDomain';
  result?: Maybe<Domain>;
};

export type CreateDomainCategories = {
  __typename?: 'CreateDomainCategories';
  result?: Maybe<DomainLibraryCategory>;
};

export type DeleteDomainCategories = {
  __typename?: 'DeleteDomainCategories';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateDomainCategories = {
  __typename?: 'UpdateDomainCategories';
  result?: Maybe<Domain>;
};

export type CreateComponent = {
  __typename?: 'CreateComponent';
  result?: Maybe<Component>;
};

export type DeleteComponent = {
  __typename?: 'DeleteComponent';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateComponent = {
  __typename?: 'UpdateComponent';
  result?: Maybe<Component>;
};

export type CreateComponentCategories = {
  __typename?: 'CreateComponentCategories';
  result?: Maybe<ComponentLibraryCategory>;
};

export type DeleteComponentCategories = {
  __typename?: 'DeleteComponentCategories';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateComponentCategories = {
  __typename?: 'UpdateComponentCategories';
  result?: Maybe<Component>;
};

export type CreateAssembly = {
  __typename?: 'CreateAssembly';
  result?: Maybe<Assembly>;
};

export type DeleteAssembly = {
  __typename?: 'DeleteAssembly';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateAssembly = {
  __typename?: 'UpdateAssembly';
  result?: Maybe<Assembly>;
};

export type CreateAssemblyCategories = {
  __typename?: 'CreateAssemblyCategories';
  result?: Maybe<AssemblyLibraryCategory>;
};

export type DeleteAssemblyCategories = {
  __typename?: 'DeleteAssemblyCategories';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateAssemblyCategories = {
  __typename?: 'UpdateAssemblyCategories';
  result?: Maybe<Assembly>;
};

export type CreateActivity = {
  __typename?: 'CreateActivity';
  result?: Maybe<Activity>;
};

export type DeleteActivity = {
  __typename?: 'DeleteActivity';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateActivity = {
  __typename?: 'UpdateActivity';
  result?: Maybe<Activity>;
};

export type CreateActivityCategories = {
  __typename?: 'CreateActivityCategories';
  result?: Maybe<ActivityLibraryCategory>;
};

export type DeleteActivityCategories = {
  __typename?: 'DeleteActivityCategories';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateActivityCategories = {
  __typename?: 'UpdateActivityCategories';
  result?: Maybe<Activity>;
};

export type CreateDomainTemplate = {
  __typename?: 'CreateDomainTemplate';
  result?: Maybe<DomainTemplate>;
};

export type PropertyMetaInputType = {
  title?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  entity?: Maybe<Scalars['UUID']>;
  attrType?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  validationRules?: Maybe<ValidationRulesInputType>;
  description?: Maybe<Scalars['String']>;
  required?: Maybe<Scalars['Boolean']>;
};

export type ValidationRulesInputType = {
  rules?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type DeleteDomainTemplate = {
  __typename?: 'DeleteDomainTemplate';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateDomainTemplate = {
  __typename?: 'UpdateDomainTemplate';
  result?: Maybe<DomainTemplate>;
};

export type CreateDomainTemplateCategories = {
  __typename?: 'CreateDomainTemplateCategories';
  result?: Maybe<DomainLibraryCategory>;
};

export type DeleteDomainTemplateCategories = {
  __typename?: 'DeleteDomainTemplateCategories';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateDomainTemplateCategories = {
  __typename?: 'UpdateDomainTemplateCategories';
  result?: Maybe<DomainTemplate>;
};

export type CreateUser = {
  __typename?: 'CreateUser';
  result?: Maybe<User>;
};

export type DeleteUser = {
  __typename?: 'DeleteUser';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateUser = {
  __typename?: 'UpdateUser';
  result?: Maybe<User>;
};

export type CreateProjectRole = {
  __typename?: 'CreateProjectRole';
  result?: Maybe<ProjectRole>;
};

export type DeleteProjectRole = {
  __typename?: 'DeleteProjectRole';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateProjectRole = {
  __typename?: 'UpdateProjectRole';
  result?: Maybe<ProjectRole>;
};

export type CreateAttachmentType = {
  __typename?: 'CreateAttachmentType';
  result?: Maybe<AttachmentType>;
};

export type DeleteAttachmentType = {
  __typename?: 'DeleteAttachmentType';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateAttachmentType = {
  __typename?: 'UpdateAttachmentType';
  result?: Maybe<AttachmentType>;
};

export type CreateUserGroup = {
  __typename?: 'CreateUserGroup';
  result?: Maybe<UserGroup>;
};

export type DeleteUserGroup = {
  __typename?: 'DeleteUserGroup';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateUserGroup = {
  __typename?: 'UpdateUserGroup';
  result?: Maybe<UserGroup>;
};

export type CreateOrganization = {
  __typename?: 'CreateOrganization';
  result?: Maybe<Organization>;
};

export type DeleteOrganization = {
  __typename?: 'DeleteOrganization';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateOrganization = {
  __typename?: 'UpdateOrganization';
  result?: Maybe<Organization>;
};

export type CreateCountry = {
  __typename?: 'CreateCountry';
  result?: Maybe<Country>;
};

export type DeleteCountry = {
  __typename?: 'DeleteCountry';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateCountry = {
  __typename?: 'UpdateCountry';
  result?: Maybe<Country>;
};

export type CreateRegion = {
  __typename?: 'CreateRegion';
  result?: Maybe<Region>;
};

export type DeleteRegion = {
  __typename?: 'DeleteRegion';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateRegion = {
  __typename?: 'UpdateRegion';
  result?: Maybe<Region>;
};

export type CreateCoordinateSystem = {
  __typename?: 'CreateCoordinateSystem';
  result?: Maybe<CoordinateSystem>;
};

export type DeleteCoordinateSystem = {
  __typename?: 'DeleteCoordinateSystem';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateCoordinateSystem = {
  __typename?: 'UpdateCoordinateSystem';
  result?: Maybe<CoordinateSystem>;
};

export type CreateAttachment = {
  __typename?: 'CreateAttachment';
  result?: Maybe<Attachment>;
};

export type DeleteAttachment = {
  __typename?: 'DeleteAttachment';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateAttachment = {
  __typename?: 'UpdateAttachment';
  result?: Maybe<Attachment>;
};

export type CreateProjectFile = {
  __typename?: 'CreateProjectFile';
  result?: Maybe<ProjectFile>;
};

export type DeleteProjectFile = {
  __typename?: 'DeleteProjectFile';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateProjectFile = {
  __typename?: 'UpdateProjectFile';
  result?: Maybe<ProjectFile>;
};

export type CreateDomainEntity = {
  __typename?: 'CreateDomainEntity';
  result?: Maybe<DomainEntity>;
};

export type DeleteDomainEntity = {
  __typename?: 'DeleteDomainEntity';
  result?: Maybe<Scalars['Boolean']>;
};

export type UpdateDomainEntity = {
  __typename?: 'UpdateDomainEntity';
  result?: Maybe<DomainEntity>;
};

export type ProjectInputType = {
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['ID']>;
  coordinateSystem?: Maybe<Scalars['ID']>;
  coordinates?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  planningHorizon?: Maybe<Scalars['String']>;
  yearStart?: Maybe<Scalars['Int']>;
  years?: Maybe<Scalars['Int']>;
};

export type UuidOrError = UuidType | Error;

export type UuidType = {
  __typename?: 'UuidType';
  vid?: Maybe<Scalars['UUID']>;
};

export type ProjectDiffOrError = Project | UpdateProjectDiff | Error;

/** Contains remote and local versions of  project if versions are not equal. */
export type UpdateProjectDiff = {
  __typename?: 'UpdateProjectDiff';
  remoteProject?: Maybe<Project>;
  localProject?: Maybe<Project>;
  message?: Maybe<Scalars['String']>;
};

export type ProjectUpdateType = {
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['ID']>;
  coordinateSystem?: Maybe<Scalars['ID']>;
  coordinates?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  status: ProjectStatus;
  isFavorite?: Maybe<Scalars['Boolean']>;
  resourceId?: Maybe<Scalars['String']>;
  planningHorizon?: Maybe<Scalars['String']>;
  yearStart?: Maybe<Scalars['Int']>;
  years?: Maybe<Scalars['Int']>;
  /** Version of the original project. */
  version: Scalars['Int'];
};

export enum ProjectStatus {
  Draft = 'DRAFT',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Paused = 'PAUSED',
  Removed = 'REMOVED',
}

export type AttendeeListOrError = AttendeeList | UpdateProjectDiff | Error;

export type AttendeeList = {
  __typename?: 'AttendeeList';
  attendeeList?: Maybe<Array<Maybe<Attendee>>>;
};

export type AttendeeInputType = {
  user: Scalars['UUID'];
  roles: Array<Maybe<Scalars['UUID']>>;
};
