// This is just an example,
// so you can safely delete all default props below

export default {
  // ---------
  // system
  // ---------
  // label
  systemLabel: {
    projectName: 'Tipiṭaka Common Reference Platform',
    switchLang: 'เปลี่ยนภาษา',
    submit: 'Submit',
    close: 'Close',
    saveAndClose: 'Save & Close',
    verified: 'Verified',
    createdOn: 'Created On',
    updatedOn: 'Updated On',
    createdBy: 'Created By',
    updatedBy: 'Updated By',
    create: 'Create',
    update: 'Update',
    checkToDelete: 'Check to delete',
    requiredField: 'This field is required.',
    userList: 'User List',
    permissionList: 'Permission List',
    search: 'Search',
    backHome: 'Back Home',
    page404: 'Page Not Found',
    page403: 'Access Denied',
    checkPermissions: 'Checking Permissions',
    notValid: 'Input Is Not Valid',
    deleteRecord: 'Delete Record',
    saveRecord: 'Save',
    confirm: 'Confirm',
    cancel: 'Cancel',
    note: 'Note',
    filter: 'Filter',
    confirmToDelete: 'Are you sure to delete this record.'
  },
  // message
  systemMessage: {
    infoTitle: '<span class="text-blue">Info</span>',
    errorTitle: '<span class="text-red">Error</span>',
    success: 'Success',
    updateSuccess: 'update successful!',
    error: 'Error, Please contact Admin',
    deleted: 'File deleted successfully',
    noRecordFound: 'No Record Found'
  },
  // ---------
  // store
  // ---------
  // storeAuth
  storeAuth: {
    emailAlreadyInUse: 'The email address is already in use by another account.',
    sendEmailVerification: 'A verification link has been sent to your email account. Open it up to activate your account.',
    wrongPassword: 'The password is invalid or the user does not have a password.',
    userNotFound: 'There is no user record corresponding to this identifier. The user may have been deleted.',
    sendPasswordResetEmail: 'A password reset link was sent. Click the link in the email to create a new password.'
  },
  // ---------
  // layouts
  // ---------
  mainLayout: {
    login: 'Login',
    logout: 'Logout',
    navigation: 'Navigation'
  },
  // ---------
  // pages
  // ---------
  // pageAuth
  pageAuth: {
    login: 'Login',
    register: 'Register',
    resetPassword: 'Reset Password'
  },
  // profile
  profile: {
    updateProfile: 'Profile',
    firstName: 'First Name',
    lastName: 'Last Name'
  },
  // accessControl
  accessControl: {
    uid: 'uid',
    email: 'Email',
    user: 'User List',
    firstName: 'First Name',
    lastName: 'Last Name',
    creationDate: 'Registration Date',
    group: 'Group List',
    role: 'Role',
    description: 'Description',
    permission: 'Permission'
  },
  // operation
  operation: {
    tipitakaEdition: 'Tipiṭaka Edition',
    digitization: 'Tipiṭaka Digitization & Database',
    pageNumber: 'Page Number',
    volume: 'Volume',
    number: 'Number',
    name: 'Name',
    totalPages: 'Total Pages',
    selectVolume: 'Select Volume',
    volumesSet: 'Volumes Set',
    pages: 'Pages',
    imageReference: 'Image Reference',
    volumeNumber: 'Volume Number',
    text: 'Text',
    image: 'Image',
    uploadImage: 'Upload Image',
    proofread: 'Proofread',
    removeExtraSpace: 'Remove Extra Space',
    increaseLineHeight: 'Increase Line Spacing',
    decreaseLineHeight: 'Derease Line Spacing',
    lineSpacing: 'Line Spacing',
    paddingTop: '1st Line',
    confirmToCreateWrodlist: 'Once the "word list" has been created, System will not allow to edit the original text.',
    confirmToRemoveWrodlist: 'Delete all "word lists" created from this page.',
    commonToc: 'Common Table of Content'
  },
  // commonToc
  commonToc: {
    label: 'Label',
    upward: 'Upward',
    downward: 'Downward',
    delete: 'Delete',
    update: 'Update',
    add: 'Add',
    expandAll: 'Collapse/Expand All',
    settings: 'Settings',
    volumes: 'Volumes',
    chengeParent: 'Change Parent',
    pageView: 'Page View',
    treeView: 'TOC View',
    beginContent: 'Begin Content',
    endContent: 'End Content',
    markContent: 'Mark Content',
    clearMarkContent: 'Clear Mark Content',
    clearSelectedWord: 'Clear Selected Word',
    firstWord: 'First Word',
    lastWord: 'Last Word',
    wordSeqBlock: 'Word Sequence Block',
    save: 'Save',
    volumeNumber: 'Volume #',
    pageNumber: 'Page #',
    word: 'Word',
    tcr: 'TCR',
    verseNumber: 'Verse Number',
    search: 'Search'
  },
  // configuration
  configuration: {
    tipitakaEdition: 'Tipitaka Edition',
    sequence: 'Sequence',
    code: 'Code',
    name: 'Name',
    description: 'Description',
    yearOfPublication: 'Year Of Publication',
    language: 'Language',
    script: 'Script',
    volumes: 'Volumes',
    publisher: 'Publisher',
    country: 'Country',
    buddhistEra: 'ie. 2500',
    pali: 'Pāḷi',
    burmese: 'Burmese',
    devanagari: 'Devanagari',
    khmer: 'khmer',
    lanna: 'Lanna',
    laos: 'Laos',
    roman: 'Roman',
    sinhala: 'Sinhala',
    thai: 'Thai',
    sriLanka: 'Sri Lanka',
    myanmar: 'Myanmar',
    content: 'Web Content',
    routeName: 'Route Name',
    query: 'Query',
    mi1: 'Tool #1',
    mi2: 'Tool #2',
    mi3: 'Tool #3',
    mi4: 'Tool #4',
    mi5: 'Tool #5',
    mi6: 'Tool #6',
    mi7: 'Tool #7',
    mi8: 'Tool #8',
    tocSet: 'Table of Contents Set'
  },
  // ---------
  // components
  // ---------
  // loginRegister
  loginRegister: {
    email: 'Email',
    password: 'Password',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    resetPassword: 'Reset Password',
    loginSuccessful: 'Login Successful',
    resendEmail: 'Resend Email',
    verifyAccount: '<p class="text-h6">Please verify your email address to complete account activation.</p> <p class="q-py-sm text-body1">You should receive an email message from TCRP. Click the unique link provided in that email to finish verifying your email address. The web page which then launches will confirm your success.</p>',
    wordOfBuddha: '<p class="text-subtitle1">YO VO DHAMMO CA VINAYO CA DESITO PAÑÑATTO<br>SO VO MAMACCAYENA SATTHĀ</p><p class="q-py-sm text-body1">Dhamma and Vinaya <br>will be your Teacher after I am gone..</p>'
  },
  // mainNav
  mainNav: {
    profile: 'Profile',
    home: 'Home',
    project: 'Project',
    myProfile: 'My Profile',
    settings: 'Settings',
    accessControl: 'Access Control',
    user: 'User',
    group: 'Group',
    permission: 'Permission',
    membership: 'Membership',
    configuration: 'Configuration',
    tipitakaEdition: 'Tipitaka Edition',
    tipitaka: 'Tipitaka',
    tipitakaPreservation: 'Tipitaka Preservation',
    commonToc: 'Common TOC',
    webContent: 'Web Content',
    utility: 'Utility',
    tocSet: 'Table of Contents Set'
  }
}
