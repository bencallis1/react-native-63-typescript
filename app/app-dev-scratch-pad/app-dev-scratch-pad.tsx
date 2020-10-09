//key
//sd - self described
/**
 * @authored by Kaybarax
 * Twitter @_ https://twitter.com/Kaybarax
 * Github @_ https://github.com/Kaybarax
 * LinkedIn @_ https://linkedin.com/in/kaybarax
 */

import React from 'react';
import RN from 'react-native';
import SafeComponentWrapper from "../safe-component-wrapper";
import {
    AlignCenterContentCN,
    FlexColumnContainerCN,
    FlexContainerChildItemFullWidthCN,
    FlexFluidRowContainerCN
} from "../theme/app-layout-styles-classnames";
import className, {showToast} from "../util/react-native-based-utils";
import {BlankSpaceDivider} from "../shared-components-and-modules/shared-components";
import ReactNativeCameraModule
    from "../shared-components-and-modules/camera-photo-capture-module/react-native-camera-module";
import {POSITIVE_ACTION_COLOR} from "../theme/app-theme";
import {
    CAMERA_PERMISSION,
    requestPermission
} from "../shared-components-and-modules/camera-photo-capture-module/camera-capture-util";
import RnMultiSelectKaybarax from "../shared-components-and-modules/form-controls/rn-multi-select-kaybarax";
import appNavigation from "../routing-and-navigation/app-navigation";

export default function AppDevScratchPad(props) {

    console.log('AppDevScratchPad props: ', props);
    let {navigation} = props;

    let [multiSelectDialogIsOpen, toggleOpenMultiSelectDialog] = React.useState(false);
    //for testing react native photo capture module
    let [cameraModuleProps, updateCameraModule] = React.useState({
        cameraFlashOn: false,
        cameraLaunched: false,
        backCamera: true,
        imagePreview: null,
        acceptPhoto: false,
    });
    let [photoCaptureModuleTrigger, InvokePhotoCaptureModuleTrigger] = React.useState(1);

    let updateCameraModuleProps = (props) => {
        updateCameraModule(props);
        photoCaptureModuleTrigger += 1;
        InvokePhotoCaptureModuleTrigger(photoCaptureModuleTrigger);
    };

    return (
        <SafeComponentWrapper>

            <RN.ScrollView
                style={[
                    className(FlexColumnContainerCN)
                ]}
            >

                <RN.View
                    style={[
                        className(
                            FlexContainerChildItemFullWidthCN
                        )
                    ]}
                >
                    <RN.Text
                        style={[
                            className(
                                FlexFluidRowContainerCN,
                                AlignCenterContentCN,
                            )
                        ]}
                    >
                        MOCK STUFF AWAY TO YOUR HEARTS DESIRE!!
                    </RN.Text>
                </RN.View>

                <RN.View
                    style={[
                        className(
                            FlexContainerChildItemFullWidthCN,
                            {paddingTop: 10}
                        ),
                    ]}
                >
                    <RN.Button
                        title={'Go Home'}
                        onPress={_ => {
                            appNavigation.navigateToHome(navigation);
                        }}
                    />
                    <BlankSpaceDivider/>
                    <RN.View
                        style={[
                            className(
                                FlexFluidRowContainerCN,
                            )
                        ]}
                    >
                        <RN.View
                            style={[
                                className(
                                    FlexContainerChildItemFullWidthCN,
                                )
                            ]}
                        >
                            <RN.Text
                                style={[
                                    className(
                                        FlexFluidRowContainerCN,
                                        AlignCenterContentCN
                                    )
                                ]}
                            >
                                Mock file upload for example
                            </RN.Text>
                            <BlankSpaceDivider/>
                            <RN.Button
                                title={'Upload a file'}
                                onPress={_ => {
                                    //
                                }}
                            />
                            <BlankSpaceDivider/>
                            <RN.Button
                                title={'Submit file upload'}
                                onPress={_ => {
                                    //
                                }}
                            />
                        </RN.View>
                        <BlankSpaceDivider/>
                        <RN.View
                            style={[
                                className(
                                    FlexContainerChildItemFullWidthCN,
                                )
                            ]}
                        >
                            <RN.Text
                                style={[
                                    className(
                                        FlexFluidRowContainerCN,
                                        AlignCenterContentCN,
                                    )
                                ]}
                            >
                                Call a native module
                            </RN.Text>
                            <BlankSpaceDivider/>
                            <RN.Button
                                title={'Call password hash native module'}
                                onPress={_ => {
                                    //
                                }}
                            />
                        </RN.View>
                    </RN.View>
                </RN.View>

                <BlankSpaceDivider/>

                <RN.View
                    style={[
                        className(
                            FlexContainerChildItemFullWidthCN
                        )
                    ]}
                >

                    <RN.Text>Test Multi select component</RN.Text>

                    <RnMultiSelectKaybarax
                        style={{zIndex: 100000000}}
                        itemsList={
                            itemsList
                        }
                        selectedItems={selectedItems}
                        onItemSelected={value => {

                            console.log('WAS SELECTED', value);

                        }}
                        onItemRemoved={value => {

                            console.log('WAS REMOVED', value);

                        }}
                        multiSelectDialogIsOpen={multiSelectDialogIsOpen}
                        toggleOpenMultiSelectDialog={(value) => {
                            toggleOpenMultiSelectDialog(value);
                        }}
                    />

                </RN.View>

                <RN.View
                    style={[
                        className(
                            FlexContainerChildItemFullWidthCN
                        )
                    ]}
                >

                    <RN.View
                        style={[
                            className(FlexFluidRowContainerCN)
                        ]}
                    >

                        <RN.TouchableOpacity
                            activeOpacity={.6}
                            style={[
                                className(FlexContainerChildItemFullWidthCN),
                                {
                                    backgroundColor: POSITIVE_ACTION_COLOR
                                }
                            ]}
                            onPress={_ => {

                                requestPermission(CAMERA_PERMISSION, 'Application needs access to the camera',
                                    'Application needs access to the camera to take person photo.')
                                    .then((accessGranted) => {
                                            if (accessGranted) {
                                                cameraModuleProps.cameraLaunched = true;
                                                cameraModuleProps.imagePreview = null;
                                                updateCameraModuleProps(cameraModuleProps)
                                            } else {
                                                showToast('Camera Permissions have been denied', 'short');
                                            }
                                        },
                                    );
                            }}
                        >
                            <RN.Text style={[
                                {
                                    color: 'white',
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                },
                                className(AlignCenterContentCN)
                            ]}>Test Camera Photo Capture</RN.Text>
                        </RN.TouchableOpacity>

                        <RN.View
                            style={[
                                className(FlexContainerChildItemFullWidthCN),
                            ]}
                        >
                            <ReactNativeCameraModule
                                setCapturedImage={base64StringPhoto => {
                                    console.log('base64StringPhoto: ', base64StringPhoto);
                                }}
                                hideCameraModal={_ => {
                                    cameraModuleProps.cameraLaunched = false;
                                    updateCameraModuleProps(cameraModuleProps)
                                }}
                                cameraModuleProps={cameraModuleProps}
                                updateCameraModuleProps={updateCameraModuleProps}
                            />
                        </RN.View>

                    </RN.View>

                </RN.View>

            </RN.ScrollView>

        </SafeComponentWrapper>
    );
}

const itemsList = [];
const selectedItems = [];
