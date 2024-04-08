const user = { id: 1, username: "admin" };

const dataset = {
  id: 1,
  created_at: "2024-02-19T13:21:25.741370Z",
  updated_at: "2024-03-04T12:27:01.460913Z",
  name: "Test Dataset",
  visibility: "PUBLIC",
  hidden: false,
  data_partner: 1,
  viewers: [1],
  admins: [1],
  editors: [1],
};

const datapartner = {
  id: 1,
  created_at: "2024-02-19T13:16:39.480024Z",
  updated_at: "2024-02-19T13:16:39.480070Z",
  name: "Test",
};

export const scanReports: ScanReport[] = [
  {
    id: 11,
    created_at: "2024-02-26T12:55:00.442208Z",
    updated_at: "2024-02-26T13:21:14.063955Z",
    name: "ScanReport 1_20240226-125500_gdk4duld.xlsx",
    dataset: "Test 3",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 11,
    parent_dataset: 1,
    viewers: [],
    editors: [],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 9,
    created_at: "2024-02-19T15:11:22.494235Z",
    updated_at: "2024-02-26T12:53:57.446183Z",
    name: "ScanReport 1_20240219-151122_9pk3w726.xlsx",
    dataset: "ok",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 9,
    parent_dataset: 1,
    viewers: [],
    editors: [],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 8,
    created_at: "2024-02-19T15:10:41.625933Z",
    updated_at: "2024-02-26T12:53:57.570027Z",
    name: "ScanReport 1_20240219-151041_882paigl.xlsx",
    dataset: "rgh",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 8,
    parent_dataset: 1,
    viewers: [],
    editors: [1],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 15,
    created_at: "2024-03-04T10:26:28.276062Z",
    updated_at: "2024-03-04T10:26:31.689316Z",
    name: "ScanReport 1_20240304-102628_gt7cgx5g.xlsx",
    dataset: "New SR",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 15,
    parent_dataset: 1,
    viewers: [],
    editors: [],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 10,
    created_at: "2024-02-19T15:14:02.292426Z",
    updated_at: "2024-02-26T12:53:57.358177Z",
    name: "ScanReport 1_20240219-151402_sr2inrua.xlsx",
    dataset: "tewetg",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 10,
    parent_dataset: 1,
    viewers: [],
    editors: [],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 4,
    created_at: "2024-02-19T14:56:55.645450Z",
    updated_at: "2024-02-26T13:21:17.770341Z",
    name: "ScanReport 1_20240219-145655_gcbikqfx.xlsx",
    dataset: "Test 4",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 4,
    parent_dataset: 1,
    viewers: [],
    editors: [1],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 14,
    created_at: "2024-02-26T13:17:58.019263Z",
    updated_at: "2024-02-26T13:17:59.292093Z",
    name: "ScanReport 1_20240226-131758_nj9t5x4x.xlsx",
    dataset: "Test 7",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 14,
    parent_dataset: 1,
    viewers: [],
    editors: [],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 7,
    created_at: "2024-02-19T15:05:56.907512Z",
    updated_at: "2024-02-26T12:53:57.452807Z",
    name: "ScanReport 1_20240219-150556_2b3dz3yk.xlsx",
    dataset: "twest§",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 7,
    parent_dataset: 1,
    viewers: [],
    editors: [],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 1,
    created_at: "2024-02-19T13:23:58.887308Z",
    updated_at: "2024-02-26T13:21:24.845321Z",
    name: "ScanReport 1_20240219-132358_pzvqq404.xlsx",
    dataset: "Test Scan Report",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 1,
    parent_dataset: 1,
    viewers: [],
    editors: [],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 5,
    created_at: "2024-02-19T14:57:48.553286Z",
    updated_at: "2024-02-26T12:53:57.607800Z",
    name: "ScanReport 1_20240219-145748_84otxrwb.xlsx",
    dataset: "5",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 5,
    parent_dataset: 1,
    viewers: [],
    editors: [1],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 2,
    created_at: "2024-02-19T14:51:17.936852Z",
    updated_at: "2024-02-26T13:21:21.722470Z",
    name: "ScanReport 1_20240219-145117_is51ehx2.xlsx",
    dataset: "Test 2",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 2,
    parent_dataset: 1,
    viewers: [],
    editors: [],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 6,
    created_at: "2024-02-19T15:05:13.820308Z",
    updated_at: "2024-02-26T12:53:57.590286Z",
    name: "ScanReport 1_20240219-150513_fmsf8do5.xlsx",
    dataset: "test5",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 6,
    parent_dataset: 1,
    viewers: [],
    editors: [],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 12,
    created_at: "2024-02-26T13:02:01.854665Z",
    updated_at: "2024-02-26T13:21:10.828365Z",
    name: "ScanReport 1_20240226-130201_u6jczpjy.xlsx",
    dataset: "Test 3",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 12,
    parent_dataset: 1,
    viewers: [],
    editors: [],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 13,
    created_at: "2024-02-26T13:16:47.367767Z",
    updated_at: "2024-02-26T13:16:49.402517Z",
    name: "ScanReport 1_20240226-131647_frl6t11y.xlsx",
    dataset: "Test 6",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 13,
    parent_dataset: 1,
    viewers: [],
    editors: [],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
  {
    id: 3,
    created_at: "2024-02-19T14:54:29.485808Z",
    updated_at: "2024-02-26T13:21:20.063523Z",
    name: "ScanReport 1_20240219-145429_yrq1vfl6.xlsx",
    dataset: "Test 3",
    hidden: false,
    file: null,
    status: "UPCOMPL",
    visibility: "PUBLIC",
    author: 1,
    data_dictionary: 3,
    parent_dataset: 1,
    viewers: [],
    editors: [],
    data_partner: datapartner.name,
    dataset_name: dataset.name,
    author_name: user.username,
  },
];
