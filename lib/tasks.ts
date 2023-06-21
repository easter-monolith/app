export enum Tasks {
  Borrow = 'borrow',
  Exchange = 'exchange',
  Multiply = 'multiply',
  Redeem = 'redeem',
  Renew = 'renew',
  TBC = 'TBC',
  Topup = 'topup',
}

export const EnabledTasks: Record<string, boolean> = {
  [Tasks.Borrow]: true,
  [Tasks.Exchange]: false,
  [Tasks.Multiply]: false,
  [Tasks.Redeem]: true,
  [Tasks.Renew]: false,
  [Tasks.TBC]: true,
  [Tasks.Topup]: false,
}

export const LightningEnabledTasks: Record<string, boolean> = {
  [Tasks.Borrow]: true,
  [Tasks.Exchange]: false,
  [Tasks.Multiply]: false,
  [Tasks.Redeem]: true,
  [Tasks.Renew]: false,
  [Tasks.TBC]: false,
  [Tasks.Topup]: false,
}
