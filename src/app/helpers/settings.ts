const settings = {
  role: 'admin',
  totalRecordsToShow: 10, // You need to change dataTableOptions["pageLength"] as well,
  roles: {
    Admin: 'admin',
    Requester: 'customer',
    Manager: 'tech',
    Provider: 'provider'
  },
  rolesData: [
    {title: 'Customer', value: 'customer'},
    {title: 'Tech', value: 'tech'},
    {title: 'Provider', value: 'provider'},
  ],
  status: {
    Active: 'active',
    Sent: 'sent',
    Received: 'received',
    Pending: 'pending',
    PendingPayment: 'pending payment',
    Processing: 'processing',
    OnHold: 'on hold',
    Failed : 'failed',
    Completed: 'completed',
    InProgress: 'in_progress',
    Accepted: 'accepted',
    Rejected: 'rejected',
    Blocked: 'blocked',
    Cancelled: 'cancelled',
    Confirmed: 'confirmed',
    InActive: 'inactive',
    New: 'new',
    Archived: 'archived',
    Surveyed: 'surveyed',
    WaitingForBids: 'waiting_for_bids',
    Won: 'won',
    Offered: 'offered',
    Refunded: 'refunded',
    Escrowed: 'escrowed',
    NOT_PAID: 'not_paid',
    TRUE: 'true',
    FALSE: 'false',
  },
  questionTypes: {
    Text: 'text',
    Sliding: 'slider',
    File: 'file',
    FileDoc: 'file_doc'
  },
  questionTypesData: [
    {title: 'Text', value: 'text'},
    {title: 'Slider', value: 'slider'},
    {title: 'Image', value: 'file'},
    {title: 'Document', value: 'file_doc'}
  ],
  changePasswordStatus: {
    Change: 'change',
    TempChange: 'temp_change'
  },
  dataTableOptions: {
    pagingType: 'first_last_numbers',
    paging: true,
    pageLength: 10,
    serverSide: true,
    processing: true,
    order: [[0, 'desc']],
    dom: 'lfr<".table-responsive"t>ip',
    language: {
      processing: '<i class="fa fa-spin fa-circle-o-notch fa-3x fa-fw" style="color: #8e95af;"></i>' +
        '<span class="sr-only">Loading...</span> '
    }
  },
  countryCodes: [
    {title: '+1', value: '+1'},
    {title: '+92', value: '+92'}
  ],
  dropdownSettings: {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: 'myclass custom-class-example'
  },
  dropdownSettingsSingle: {
    singleSelection: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: 'myclass custom-class-example'
  },
  countries: [
    {title: 'United States', value: 'US'}
  ],
  states: [
    {
      title: 'Alabama',
      value: 'AL'
    },
    {
      title: 'Alaska',
      value: 'AK'
    },
    {
      title: 'American Samoa',
      value: 'AS'
    },
    {
      title: 'Arizona',
      value: 'AZ'
    },
    {
      title: 'Arkansas',
      value: 'AR'
    },
    {
      title: 'California',
      value: 'CA'
    },
    {
      title: 'Colorado',
      value: 'CO'
    },
    {
      title: 'Connecticut',
      value: 'CT'
    },
    {
      title: 'Delaware',
      value: 'DE'
    },
    {
      title: 'District Of Columbia',
      value: 'DC'
    },
    {
      title: 'Federated States Of Micronesia',
      value: 'FM'
    },
    {
      title: 'Florida',
      value: 'FL'
    },
    {
      title: 'Georgia',
      value: 'GA'
    },
    {
      title: 'Guam Gu',
      value: 'GU'
    },
    {
      title: 'Hawaii',
      value: 'HI'
    },
    {
      title: 'Idaho',
      value: 'ID'
    },
    {
      title: 'Illinois',
      value: 'IL'
    },
    {
      title: 'Indiana',
      value: 'IN'
    },
    {
      title: 'Iowa',
      value: 'IA'
    },
    {
      title: 'Kansas',
      value: 'KS'
    },
    {
      title: 'Kentucky',
      value: 'KY'
    },
    {
      title: 'Louisiana',
      value: 'LA'
    },
    {
      title: 'Maine',
      value: 'ME'
    },
    {
      title: 'Marshall Islands',
      value: 'MH'
    },
    {
      title: 'Maryland',
      value: 'MD'
    },
    {
      title: 'Massachusetts',
      value: 'MA'
    },
    {
      title: 'Michigan',
      value: 'MI'
    },
    {
      title: 'Minnesota',
      value: 'MN'
    },
    {
      title: 'Mississippi',
      value: 'MS'
    },
    {
      title: 'Missouri',
      value: 'MO'
    },
    {
      title: 'Montana',
      value: 'MT'
    },
    {
      title: 'Nebraska',
      value: 'NE'
    },
    {
      title: 'Nevada',
      value: 'NV'
    },
    {
      title: 'New Hampshire',
      value: 'NH'
    },
    {
      title: 'New Jersey',
      value: 'NJ'
    },
    {
      title: 'New Mexico',
      value: 'NM'
    },
    {
      title: 'New York',
      value: 'NY'
    },
    {
      title: 'North Carolina',
      value: 'NC'
    },
    {
      title: 'North Dakota',
      value: 'ND'
    },
    {
      title: 'Northern Mariana Islands',
      value: 'MP'
    },
    {
      title: 'Ohio',
      value: 'OH'
    },
    {
      title: 'Oklahoma',
      value: 'OK'
    },
    {
      title: 'Oregon',
      value: 'OR'
    },
    {
      title: 'Palau',
      value: 'PW'
    },
    {
      title: 'Pennsylvania',
      value: 'PA'
    },
    {
      title: 'Puerto Rico',
      value: 'PR'
    },
    {
      title: 'Rhode Island',
      value: 'RI'
    },
    {
      title: 'South Carolina',
      value: 'SC'
    },
    {
      title: 'South Dakota',
      value: 'SD'
    },
    {
      title: 'Tennessee',
      value: 'TN'
    },
    {
      title: 'Texas',
      value: 'TX'
    },
    {
      title: 'Utah',
      value: 'UT'
    },
    {
      title: 'Vermont',
      value: 'VT'
    },
    {
      title: 'Virgin Islands',
      value: 'VI'
    },
    {
      title: 'Virginia',
      value: 'VA'
    },
    {
      title: 'Washington',
      value: 'WA'
    },
    {
      title: 'West Virginia',
      value: 'WV'
    },
    {
      title: 'Wisconsin',
      value: 'WI'
    },
    {
      title: 'Wyoming',
      value: 'WY'
    }
  ]
};

export default settings;
