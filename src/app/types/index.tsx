import { ReadonlyQuat, ReadonlyVec3 } from 'gl-matrix';
import { FlightController, View } from '@novorender/api';
import { SceneData, SceneLoadFail } from '@novorender/data-js-api';

export type CameraTransform = {
  position: ReadonlyVec3;
  rotation: ReadonlyQuat;
};

export type CameraControlsProps = {
  cameraPositions: { [key: number]: CameraTransform | null };
  setCameraPositions: React.Dispatch<
    React.SetStateAction<{ [key: number]: CameraTransform | null }>
  >;
  cameraControl: FlightController | null;
  handleCameraChange: (buttonId: number) => void;
};

export type SearchFormProps = {
  canvasView: View | null;
  viewSceneData: SceneData | SceneLoadFail | undefined;
};
