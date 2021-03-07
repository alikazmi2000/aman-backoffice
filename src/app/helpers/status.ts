import APP_SETTINGS from './settings';

const STATUS = {
  project: [
    { title: 'Active', value: APP_SETTINGS.status.Active },
    { title: 'Pending', value: APP_SETTINGS.status.Pending },
    { title: 'Completed', value: APP_SETTINGS.status.Completed },
    { title: 'Cancelled', value: APP_SETTINGS.status.Cancelled },
    { title: 'Surveyed', value: APP_SETTINGS.status.Surveyed },
    { title: 'Waiting For Bids', value: APP_SETTINGS.status.WaitingForBids },
    { title: 'Offered', value: APP_SETTINGS.status.Offered },
    { title: 'Inactive', value: APP_SETTINGS.status.InActive }
  ]
};

export default STATUS;
