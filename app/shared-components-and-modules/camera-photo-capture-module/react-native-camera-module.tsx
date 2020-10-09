//key
//sd - self described
/**
 * @authored by Kaybarax
 * Twitter @_ https://twitter.com/Kaybarax
 * Github @_ https://github.com/Kaybarax
 * LinkedIn @_ https://linkedin.com/in/kaybarax
 */

import React, {Component} from "react";
import RN, {Modal, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {isEmptyString, isNullUndefined} from "../../util/util";
import className, {showToast} from "../../util/react-native-based-utils";
import {
    AlignCenterContentCN,
    AlignCenterTextCN,
    FlexColumnContainerCN,
    FlexContainerChildItemFullWidthCN,
    FlexRowContainerCN
} from "../../theme/app-layout-styles-classnames";
import {SCREEN_HEIGHT} from "../../App";
import {RNCamera} from "react-native-camera";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCamera, faCheck, faExchangeAlt, faLightbulb as OnLightbulb, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Spacer} from "../shared-components";
import {faLightbulb} from "@fortawesome/free-regular-svg-icons";
import {POSITIVE_ACTION_COLOR, MAIN_BG_COLOR, SECONDARY_COLOR} from "../../theme/app-theme";

export default function ReactNativeCameraModule(props) {

    let {
        setCapturedImage, hideCameraModal,
        cameraModuleProps, updateCameraModuleProps
    } = props;
    let {
        cameraFlashOn, imagePreview,
        backCamera, cameraLaunched,
    } = cameraModuleProps;

    let takePicture = async function (
        camera, x = 0,
        y = 0, width = 0, height = 0) {
        const options = {
            quality: 1,
            orientation: 1,
            base64: true,
            exif: false,
            width: 500,
            mirrorImage: false,
            doNotSave: false,
            pauseAfterCapture: true,
            writeExif: false,
            /** Android only */
            fixOrientation: true,
            /** iOS only */
            forceUpOrientation: false,
        };

        if (camera) {
            try {
                const data = await camera.takePictureAsync(options);
                console.log("camera response data: ", data);
                if (!isNullUndefined(data.base64) && !isEmptyString(data.base64)) {
                    cameraModuleProps.imagePreview = data;
                    updateCameraModuleProps(cameraModuleProps);
                } else {
                    showToast("Could not save the image.", 'short');
                }
            } catch (error) {
                showToast(error.message, 'short');
            }
        } else {
            showToast("Could not capture the image.", 'short');
        }

    }

    return (

        <View
            style={[
                className(FlexColumnContainerCN),
            ]}
        >

            <Modal
                animationType={'slide'}
                visible={cameraLaunched}
                onRequestClose={() => {
                    hideCameraModal();
                }}
            >

                {
                    !isNullUndefined(imagePreview) &&
                    !isEmptyString(imagePreview.base64) &&
                    <ScrollView
                        style={[
                            className(FlexColumnContainerCN),
                            {
                                backgroundColor: SECONDARY_COLOR,
                            }
                        ]}
                    >

                      <View
                          style={[
                              className(
                                  FlexColumnContainerCN
                              )
                          ]}
                      >

                        <View
                            style={[
                                className(
                                    FlexContainerChildItemFullWidthCN
                                )
                            ]}
                        >
                          <RN.Image
                              style={[
                                  {
                                      width: '100%',
                                      height: SCREEN_HEIGHT * 0.85,
                                      borderRadius: 10,
                                  }
                              ]}
                              source={{uri: "data:image/jpeg;base64," + imagePreview.base64}}
                          />

                        </View>

                        <View
                            style={[
                                className(
                                    FlexContainerChildItemFullWidthCN
                                ),
                                {
                                    backgroundColor: MAIN_BG_COLOR,
                                    height: SCREEN_HEIGHT * 0.13,
                                    borderRadius: 10,
                                }
                            ]}
                        >

                          <View
                              style={[
                                  className(
                                      FlexRowContainerCN,
                                      AlignCenterContentCN
                                  )
                              ]}
                          >
                            <TouchableOpacity
                                activeOpacity={.6}
                                onPress={_ => {
                                    setCapturedImage(imagePreview);
                                    hideCameraModal();
                                }}
                                style={[
                                    {
                                        borderStyle: 'solid',
                                        borderWidth: 2,
                                        borderColor: POSITIVE_ACTION_COLOR,
                                        borderRadius: 10,
                                        padding: 5,
                                    }
                                ]}
                            >
                              <Text
                                  style={[
                                      className(
                                          AlignCenterTextCN
                                      ),
                                      {
                                          fontSize: 20,
                                          color: POSITIVE_ACTION_COLOR,
                                          fontWeight: 'bold'
                                      }
                                  ]}
                              >
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    color={POSITIVE_ACTION_COLOR}
                                    size={30}
                                />
                                <Spacer/>
                                Accept
                              </Text>
                            </TouchableOpacity>
                            <Spacer spaces={5}/>
                            <TouchableOpacity
                                activeOpacity={.6}
                                onPress={_ => {
                                    cameraModuleProps.imagePreview = null;
                                    updateCameraModuleProps(cameraModuleProps);
                                }}
                                style={[
                                    {
                                        borderStyle: 'solid',
                                        borderWidth: 2,
                                        borderColor: 'maroon',
                                        borderRadius: 10,
                                        padding: 5,
                                    }
                                ]}
                            >
                              <Text
                                  style={[
                                      className(
                                          AlignCenterTextCN
                                      ),
                                      {
                                          fontSize: 20,
                                          color: 'maroon',
                                          fontWeight: 'bold'
                                      }
                                  ]}
                              >
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    color={'maroon'}
                                    size={30}
                                />
                                <Spacer/>
                                Retake
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                      </View>

                    </ScrollView>

                }

                {
                    isNullUndefined(imagePreview) &&
                    <View
                        style={[
                            className(FlexContainerChildItemFullWidthCN)
                        ]}
                    >

                      <View
                          style={[
                              className(FlexColumnContainerCN),
                          ]}
                      >

                        <RNCamera
                            style={[
                                className(
                                    FlexContainerChildItemFullWidthCN,
                                ),
                            ]}
                            type={backCamera ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
                            flashMode={cameraFlashOn ? RNCamera.Constants.FlashMode.auto : RNCamera.Constants.FlashMode.off}
                            androidCameraPermissionOptions={{
                                title: 'Permission to use camera',
                                message: 'We need your permission to use your camera',
                                buttonPositive: 'Ok',
                                buttonNegative: 'Cancel',
                            }}
                            androidRecordAudioPermissionOptions={{
                                title: 'Permission to use audio recording',
                                message: 'We need your permission to use your audio',
                                buttonPositive: 'Ok',
                                buttonNegative: 'Cancel',
                            }}
                            pendingAuthorizationView={<PendingView/>}
                        >
                            {({camera, status, recordAudioPermissionStatus}) => {
                                if (status !== 'READY') return <PendingView/>;
                                return (
                                    <View
                                        style={[
                                            className(
                                                FlexRowContainerCN,
                                                AlignCenterContentCN,
                                            ),
                                            {
                                                position: 'absolute',
                                                bottom: SCREEN_HEIGHT * 0.08,
                                                padding: 5
                                            },
                                        ]}
                                    >
                                        <TouchableOpacity
                                            activeOpacity={.6}
                                            onPress={_ => {
                                                showToast('Capturing photo...', 'short');
                                                takePicture(camera).then(null);
                                            }}
                                            style={[]}
                                        >
                                            <Text
                                                style={[
                                                    className(
                                                        AlignCenterTextCN,
                                                    ),
                                                    {
                                                        fontSize: 18,
                                                        padding: 5
                                                    },
                                                ]}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCamera}
                                                    color={'white'}
                                                    size={30}
                                                />
                                            </Text>
                                        </TouchableOpacity>

                                        <Spacer spaces={5}/>

                                        <TouchableOpacity
                                            onPress={_ => {
                                                if (cameraFlashOn) {
                                                    showToast('Turning flashlight off...', 'short');
                                                } else {
                                                    showToast('Turning flashlight on...', 'short');
                                                }
                                                cameraModuleProps.cameraFlashOn = !cameraFlashOn;
                                                updateCameraModuleProps(cameraModuleProps);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    className(
                                                        AlignCenterTextCN,
                                                    ),
                                                    {
                                                        fontSize: 18,
                                                        padding: 5
                                                    },
                                                ]}
                                            >
                                                <FontAwesomeIcon
                                                    icon={cameraFlashOn ? OnLightbulb : faLightbulb}
                                                    color={'white'}
                                                    size={30}
                                                />

                                            </Text>
                                        </TouchableOpacity>

                                        <Spacer spaces={5}/>

                                        <TouchableOpacity
                                            onPress={_ => {
                                                cameraModuleProps.backCamera = !backCamera;
                                                updateCameraModuleProps(cameraModuleProps);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    className(
                                                        AlignCenterTextCN,
                                                    ),
                                                    {
                                                        fontSize: 18,
                                                        padding: 5
                                                    },
                                                ]}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faExchangeAlt}
                                                    color={'white'}
                                                    size={30}
                                                />

                                            </Text>
                                        </TouchableOpacity>

                                        <Spacer spaces={5}/>

                                        <TouchableOpacity
                                            onPress={_ => {
                                                hideCameraModal();
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    className(
                                                        AlignCenterTextCN,
                                                    ),
                                                    {
                                                        fontSize: 18,
                                                        padding: 5
                                                    },
                                                ]}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                    color={'white'}
                                                    size={30}
                                                />

                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                );
                            }}

                        </RNCamera>

                      </View>

                    </View>
                }

            </Modal>

        </View>
    );

}

class PendingView extends Component {
    render() {
        return (
            <View style={{backgroundColor: SECONDARY_COLOR}}>
                <Text style={{textAlign: 'center'}}>Waiting for camera access...</Text>
            </View>
        );
    }
}
