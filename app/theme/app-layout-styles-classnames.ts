//key
//sd - self described
/**
 * @authored by Kaybarax
 * Twitter @_ https://twitter.com/Kaybarax
 * Github @_ https://github.com/Kaybarax
 * LinkedIn @_ https://linkedin.com/in/kaybarax
 */

//this one for aid during dev to see your content borders
export const BlockPartitionsDisplayCN = {
  // borderStyle: 'solid',
  // borderWidth: 1,
  // borderColor: '#152939',
};

//containers
//start flex containers
export const FlexRowContainerCN = {
  display: 'flex',
  flex: 1,
  flexDirection: 'row',
  padding: 2,
  width: '100%',
  ...BlockPartitionsDisplayCN
};

export const FlexFluidRowContainerCN = {
  display: 'flex',
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  padding: 2,
  width: '100%',
  ...BlockPartitionsDisplayCN
};

export const FlexColumnContainerCN = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  padding: 2,
  width: '100%',
  ...BlockPartitionsDisplayCN
};

export const FlexFluidColumnContainerCN = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  flexWrap: 'wrap',
  padding: 2,
  width: '100%',
  ...BlockPartitionsDisplayCN
};
// end flex containers

//start flex container children
export const FlexContainerChildrenGapCN = {
  flex: 1,
  margin: 2, // and that, will result in a 4 points dimensions gap
  ...BlockPartitionsDisplayCN
};

export const FlexContainerChildItemCN = {
  padding: 2,
  flexGrow: 1,
  ...BlockPartitionsDisplayCN
};

export const FlexContainerChildItemNoGrowCN = {
  padding: 2,
  flexGrow: 0,
  ...BlockPartitionsDisplayCN
};

export const FlexContainerChildItemFullWidthCN = {
  flexBasis: '100%',
  padding: 2,
  ...BlockPartitionsDisplayCN
};

export const FlexContainerChildItemThreeQuartersWidthCN = {
  flexBasis: '75%',
  padding: 2,
  ...BlockPartitionsDisplayCN
};

export const FlexContainerChildItemOneHalfWidthCN = {
  flexBasis: '50%',
  padding: 2,
  ...BlockPartitionsDisplayCN
};

export const FlexContainerChildItemOneQuarterWidthCN = {
  flexBasis: '25%',
  padding: 2,
  ...BlockPartitionsDisplayCN
};

export const FlexContainerChildItemOneThirdWidthCN = {
  flexBasis: '33.33%',
  padding: 2,
  ...BlockPartitionsDisplayCN
};

export const FlexContainerChildItemWidthCN = (width: string) => ({
  flexBasis: width,
  padding: 2,
  ...BlockPartitionsDisplayCN
});
// end flex container children

// start flex container content alignments
export const AlignCenterContentCN = {
  justifyContent: 'center',
  alignItems: 'center',
  ...BlockPartitionsDisplayCN
};

export const AlignRightFlexContainerContentCN = {
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  ...BlockPartitionsDisplayCN
};

export const AlignRightTextCN = {
  textAlign: 'right',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  ...BlockPartitionsDisplayCN
};

export const AlignCenterTextCN = {
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  ...BlockPartitionsDisplayCN
};

export const AlignLeftFlexContainerContentCN = {
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  ...BlockPartitionsDisplayCN
};

export const AlignLeftTextCN = {
  textAlign: 'left',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  ...BlockPartitionsDisplayCN
};
// end flex container content alignments
